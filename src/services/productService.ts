import apiClient from "./apiClient";
import { AxiosError } from "axios";

// --- INTERFACES (Data Types) ---

// రివ్యూ సబ్మిట్ చేయడానికి కావాల్సిన డేటా టైప్
export interface ReviewPayload {
  rating: number;
  review: string;
}

// Backend నుంచి వచ్చే ఎర్రర్ రెస్పాన్స్ టైప్
interface ErrorResponse {
  status: string;
  message: string;
}

// --- API FUNCTIONS ---

/**
 * Get all reviews for a specific product
 * @param productId - ID of the product
 */
export const getProductReviews = async (productId: string): Promise<any> => {
  try {
    // 🔥 UPDATED URL: Matches backend router.use('/:productId/reviews', reviewRouter)
    const response = await apiClient.get(
      `/products/${productId}/reviews?limit=50`,
    );
    return response.data;
  } catch (error) {
    // Axios Error Handling with Types
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data?.message || "Error fetching reviews";
  }
};

/**
 * Create a new review for a product
 * @param productId - ID of the product
 * @param reviewData - Object containing rating and comment
 */
export const createProductReview = async (
  productId: string,
  // 🔥 FIX: Change type to accept 'FormData' OR 'ReviewPayload'
  reviewData: FormData | ReviewPayload,
): Promise<any> => {
  try {
    const response = await apiClient.post(
      `/products/${productId}/reviews`,
      reviewData,
      {
        headers: {
          // If sending FormData, let browser set boundary automatically or force multipart
          "Content-Type":
            reviewData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>; // Changed to 'any' to catch generic backend errors
    throw axiosError.response?.data?.message || "Error submitting review";
  }
};

// Review Delete Function
export const deleteProductReview = async (reviewId: string): Promise<any> => {
  try {
    // Backend route: /api/reviews/:id
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Error deleting review";
  }
};
