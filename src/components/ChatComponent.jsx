"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  Send,
  Paperclip,
  X,
  Image as ImageIcon,
  Video,
  MoreVertical,
  ArrowLeft,
  Loader2,
  Check,
  CheckCheck,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  MessageSquareDashed,
  Mic,
  StopCircle,
  FileAudio,
} from "lucide-react";

// --- SOUND ASSETS ---
const SEND_SOUND_URL = "/sounds/message-send.mp3";
const RECEIVE_SOUND_URL = "/sounds/message-receive.mp3";

export default function ChatComponent({
  currentUserId,
  otherUserId,
  otherUserModel = "Admin",
  token,
  apiUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
}) {
  // --- STATE ---
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("offline");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [otherUserInfo, setOtherUserInfo] = useState({
    name: otherUserModel,
    profilePicture: null,
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const audioSendRef = useRef(null);
  const audioReceiveRef = useRef(null);

  // Room ID Logic
  const roomId = [currentUserId, otherUserId].sort().join("_");

  // --- THEME & SOUND ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
    if (typeof window !== "undefined") {
      audioSendRef.current = new Audio(SEND_SOUND_URL);
      audioReceiveRef.current = new Audio(RECEIVE_SOUND_URL);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("chat_theme", newTheme ? "dark" : "light");
  };

  const playSound = (type) => {
    if (!isSoundEnabled) return;
    try {
      if (type === "send" && audioSendRef.current) {
        audioSendRef.current.currentTime = 0;
        audioSendRef.current.play().catch(() => {});
      } else if (type === "receive" && audioReceiveRef.current) {
        audioReceiveRef.current.currentTime = 0;
        audioReceiveRef.current.play().catch(() => {});
      }
    } catch (e) {}
  };

  // --- AUTO SCROLL ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherUserTyping, selectedFile]);

  // --- SOCKET ---
  useEffect(() => {
    if (!token || !currentUserId || !otherUserId) return;

    const socketUrl = apiUrl.replace("/api", "");
    const newSocket = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join_room", { roomId });
      newSocket.emit("check_online_status", { userId: otherUserId });
      fetchChatHistory();
    });

    newSocket.on("is_user_online_response", (data) => {
      if (String(data.userId) === String(otherUserId)) {
        setOnlineStatus(data.isOnline ? "online" : "offline");
      }
    });

    newSocket.on("user_status_update", (data) => {
      if (String(data.userId) === String(otherUserId)) {
        setOnlineStatus(data.isOnline ? "online" : "offline");
      }
    });

    newSocket.on("receive_message", (message) => {
      if (message.roomId === roomId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          const senderId = message.senderId?._id || message.senderId;
          if (senderId !== currentUserId) {
            playSound("receive");
            newSocket.emit("mark_read", { messageId: message._id, roomId });
          }
          return [...prev, message];
        });
      }
    });

    newSocket.on("display_typing", (data) => {
      if (data.userId === otherUserId && data.roomId === roomId) {
        setOtherUserTyping(true);
      }
    });

    newSocket.on("hide_typing", (data) => {
      if (data.userId === otherUserId && data.roomId === roomId) {
        setOtherUserTyping(false);
      }
    });

    newSocket.on("message_read", (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId ? { ...msg, isRead: true } : msg,
          ),
        );
      }
    });

    return () => {
      newSocket.off("receive_message");
      newSocket.off("display_typing");
      newSocket.off("hide_typing");
      newSocket.off("user_status_update");
      newSocket.off("message_read");
      newSocket.emit("leave_room", { roomId });
      newSocket.disconnect();
    };
  }, [currentUserId, otherUserId, token, roomId, apiUrl]);

  // --- API ---
  const fetchChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await axios.get(`${apiUrl}/api/chat/history/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        let historyData = res.data.data?.messages || [];
        historyData.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        setMessages(historyData);
        socket?.emit("mark_read", { roomId });
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const uploadFile = async (fileToUpload) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const res = await axios.post(`${apiUrl}/api/chat/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) return res.data.data;
    } catch (error) {
      alert("File upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async (fileData = null) => {
    if (!fileData && !inputText.trim()) return;

    const msgType = fileData ? fileData.fileType : "text";
    const messagePayload = {
      roomId,
      receiverId: otherUserId,
      receiverModel: otherUserModel,
      text: inputText || "",
      messageType: msgType,
      fileUrl: fileData ? fileData.fileUrl : null,
      fileName: fileData ? fileData.fileName : null,
      fileSize: fileData ? fileData.fileSize : null,
      tempId: Date.now(),
    };

    socket?.emit("send_message", messagePayload);
    playSound("send");
    setInputText("");
    setSelectedFile(null);
    socket?.emit("stop_typing", { roomId });
  };

  const handleFileSend = async () => {
    if (!selectedFile) return;
    const fileData = await uploadFile(selectedFile);
    if (fileData) {
      if (selectedFile.type.startsWith("audio/")) fileData.fileType = "audio";
      await sendMessage(fileData);
    }
  };

  const handleTyping = () => {
    if (!typingTimeoutRef.current) socket?.emit("typing", { roomId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stop_typing", { roomId });
      typingTimeoutRef.current = null;
    }, 800);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice_note.webm", {
          type: "audio/webm",
        });
        const fileData = await uploadFile(audioFile);
        if (fileData) {
          fileData.fileType = "audio";
          sendMessage(fileData);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      // --- FINAL FULL SCREEN FIX ---
      // Mobile: 'fixed inset-0 z-50' -> Keyboard open ayina screen kadalakunda untundi.
      // Desktop: 'md:h-screen' -> Navbar ledu kabatti, 100% screen height teesukuntundi (Gap raadu).
      className={`fixed inset-0 z-50 md:static md:w-full md:h-screen md:flex md:items-center md:justify-center font-sans overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* 🌌 Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Chat Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        // --- CARD SIZE ---
        // Desktop: 'md:h-[650px]' ani fixed height petta.
        // Idi 100% screen lo center lo correct ga "App" laaga kanipistundi.
        className={`flex flex-col w-full h-full md:flex-none md:w-[900px] md:h-[650px] relative md:rounded-[2rem] md:shadow-2xl overflow-hidden border transition-all duration-300 ${
          isDarkMode
            ? "bg-slate-900/60 backdrop-blur-2xl border-white/10"
            : "bg-white/80 backdrop-blur-xl border-white/60 shadow-blue-200/20"
        }`}
      >
        {/* --- HEADER --- */}
        <div
          className={`h-20 px-6 flex items-center justify-between border-b z-20 transition-colors ${
            isDarkMode
              ? "border-white/5 bg-slate-900/50"
              : "border-gray-100 bg-white/60"
          }`}
        >
          <div className="flex items-center gap-4">
            <Link href="/">
              <button
                className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
              >
                <ArrowLeft size={20} />
              </button>
            </Link>

            <div className="relative">
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-blue-400 to-indigo-600">
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-white"}`}
                >
                  <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">
                    {otherUserInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {onlineStatus === "online" && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
              )}
            </div>

            <div>
              <h2 className="font-bold text-base leading-tight">
                Support Team
              </h2>
              <p
                className={`text-xs font-medium ${onlineStatus === "online" ? "text-emerald-500" : "text-slate-400"}`}
              >
                {otherUserTyping
                  ? "Typing..."
                  : onlineStatus === "online"
                    ? "Online"
                    : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-2.5 rounded-full transition-all ${isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-gray-100 text-slate-500"}`}
            >
              {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all ${isDarkMode ? "hover:bg-white/10 text-yellow-400" : "hover:bg-gray-100 text-slate-600"}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* --- MESSAGES AREA --- */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-none"
          style={{
            backgroundImage: isDarkMode
              ? "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)"
              : "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {isLoadingHistory ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <MessageSquareDashed size={48} className="mb-2 text-slate-400" />
              <p className="text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe =
                msg.senderId === currentUserId ||
                msg.senderId?._id === currentUserId;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-[60%] p-4 rounded-[20px] shadow-sm relative ${
                      isMe
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-[4px]"
                        : isDarkMode
                          ? "bg-slate-800/80 backdrop-blur-md text-slate-200 border border-white/5 rounded-bl-[4px]"
                          : "bg-white text-slate-800 border border-gray-100 rounded-bl-[4px]"
                    }`}
                  >
                    {msg.fileUrl && (
                      <div className="mb-3 rounded-xl overflow-hidden bg-black/20">
                        {msg.messageType === "image" ? (
                          <img
                            src={msg.fileUrl}
                            alt="attachment"
                            className="w-full max-h-[250px] object-cover cursor-pointer"
                            onClick={() => window.open(msg.fileUrl, "_blank")}
                          />
                        ) : msg.messageType === "video" ? (
                          <video
                            src={msg.fileUrl}
                            controls
                            className="w-full max-h-[250px]"
                          />
                        ) : msg.messageType === "audio" ? (
                          <div className="p-3 flex items-center gap-3 bg-black/10">
                            <FileAudio size={24} />
                            <audio
                              src={msg.fileUrl}
                              controls
                              className="h-8 w-full"
                            />
                          </div>
                        ) : null}
                      </div>
                    )}

                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] opacity-80 ${isMe ? "text-blue-100" : ""}`}
                    >
                      <span>{formatTime(msg.createdAt)}</span>
                      {isMe &&
                        (msg.isRead ? (
                          <CheckCheck size={12} />
                        ) : (
                          <Check size={12} />
                        ))}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT AREA --- */}
        <div className="px-4 pb-3 pt-2 md:p-6 z-20 bg-transparent">
          {/* File Preview */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="absolute bottom-20 left-6 right-6 z-30"
              >
                <div
                  className={`flex items-center gap-3 p-3 rounded-2xl shadow-xl border ${isDarkMode ? "bg-slate-800 border-white/10" : "bg-white border-gray-100"}`}
                >
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                    <Paperclip size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs opacity-60">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 hover:bg-black/5 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`flex items-center gap-2 p-1.5 rounded-[2rem] shadow-lg border relative transition-all ${
              isDarkMode
                ? "bg-slate-800/80 border-white/10 shadow-black/40"
                : "bg-white/90 border-white/60 shadow-blue-500/10"
            }`}
          >
            {/* File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) =>
                e.target.files?.[0] && setSelectedFile(e.target.files[0])
              }
              className="hidden"
              accept="image/*,video/*,audio/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-full transition-all ${isDarkMode ? "hover:bg-white/10 text-slate-400" : "hover:bg-gray-100 text-slate-500"}`}
            >
              <Paperclip size={20} />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder={isRecording ? "Recording..." : "Type a message..."}
              disabled={uploading || isRecording}
              className={`flex-1 bg-transparent border-none outline-none text-[15px] px-2 ${isDarkMode ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
            />

            {/* Action Button */}
            {inputText.trim() || selectedFile ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  selectedFile ? handleFileSend() : sendMessage()
                }
                disabled={uploading}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center"
              >
                {uploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} className="ml-0.5" />
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                    : isDarkMode
                      ? "hover:bg-white/10 text-slate-400"
                      : "hover:bg-gray-100 text-slate-500"
                }`}
              >
                {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
