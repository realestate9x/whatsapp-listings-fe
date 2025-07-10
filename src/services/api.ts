import { toast } from "sonner";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Create public axios instance without /api prefix
export const publicAxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get the access token from Supabase
const getAccessToken = async (): Promise<string | null> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error("Error retrieving access token:", error);
    return null;
  }
};

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.response?.data ||
      error.message ||
      "Unknown error";

    if (error.response?.status !== 400) {
      toast.error(`Request failed: ${errorMessage}`);
    }
    return Promise.reject(error);
  }
);

// Add the same error handling to public instance
publicAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.response?.data ||
      error.message ||
      "Unknown error";

    if (error.response?.status !== 400) {
      toast.error(`Request failed: ${errorMessage}`);
    }
    return Promise.reject(error);
  }
);

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url: endpoint,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// API service methods
export const apiService = {
  // GET request
  get: async <T>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: "GET" });
  },

  // POST request
  post: async <T, D = unknown>(endpoint: string, data?: D): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "POST",
      data,
    });
  },

  // PUT request
  put: async <T, D = unknown>(endpoint: string, data?: D): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      data,
    });
  },

  // DELETE request
  delete: async <T>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: "DELETE" });
  },

  // PATCH request
  patch: async <T, D = unknown>(endpoint: string, data?: D): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      data,
    });
  },
};

// Utility function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session?.access_token;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};
