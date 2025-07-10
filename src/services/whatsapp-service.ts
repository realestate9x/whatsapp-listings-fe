import { axiosInstance, publicAxiosInstance } from "./api";
import { supabase } from "@/integrations/supabase/client";

export interface WhatsAppStatus {
  isConnected: boolean;
  qrCode?: string | null;
  status?: string;
  message?: string;
  connected?: boolean;
  qr_pending?: boolean;
  socket_active?: boolean;
  active_connections?: number;
  total_services?: number;
  user_id?: string;
}

export const whatsappService = {
  // Get public WhatsApp system status (no auth required)
  getStatus: async (): Promise<WhatsAppStatus> => {
    try {
      const response = await publicAxiosInstance.get<WhatsAppStatus>("/status");
      return response.data;
    } catch (error) {
      console.error("Error fetching WhatsApp status:", error);
      throw error;
    }
  },

  // Get user-specific WhatsApp status (auth required)
  getMyStatus: async (): Promise<WhatsAppStatus> => {
    try {
      // Use publicAxiosInstance with manual auth for non-/api endpoints
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await publicAxiosInstance.get<WhatsAppStatus>(
        "/my-whatsapp-status",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user WhatsApp status:", error);
      throw error;
    }
  },

  // Start WhatsApp connection for the current user (auth required)
  startConnection: async (): Promise<WhatsAppStatus> => {
    try {
      // Note: /start-whatsapp is a direct route, not under /api
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await publicAxiosInstance.get<WhatsAppStatus>(
        "/start-whatsapp",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error starting WhatsApp connection:", error);
      throw error;
    }
  },

  // Disconnect user's WhatsApp connection (auth required)
  disconnect: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.post<{
        success: boolean;
        message: string;
      }>("/whatsapp/disconnect");
      return response.data;
    } catch (error) {
      console.error("Error disconnecting WhatsApp:", error);
      throw error;
    }
  },
};
