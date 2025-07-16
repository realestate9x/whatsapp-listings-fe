import { supabase } from "@/integrations/supabase/client";
import axios from "axios";
import { toast } from "sonner";
import type { PropertyFilters, PropertyResponse } from "@/types/property";

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

// Export axios instances directly for use
export { axiosInstance };

// Property API functions
export const fetchProperties = async (
  filters: PropertyFilters = {}
): Promise<PropertyResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await axiosInstance.get(
    `/parsing-job/properties?${params.toString()}`
  );
  return response.data;
};

// Export properties to CSV (backend handles CSV generation)
export const exportPropertiesToCSV = async (
  filters: Omit<PropertyFilters, "limit"> = {}
): Promise<Blob> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await axiosInstance.get(
    `/parsing-job/properties/export/csv?${params.toString()}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
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
