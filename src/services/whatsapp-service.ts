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

export interface WhatsAppGroup {
  group_id: string;
  group_name: string;
  is_enabled: boolean;
}

export interface GroupPreference {
  group_id: string;
  group_name: string;
  is_enabled: boolean;
}

export interface GroupsResponse {
  groups: WhatsAppGroup[];
}

export const whatsappService = {
  // Get public WhatsApp system status (no auth required)
  getStatus: async (): Promise<WhatsAppStatus> => {
    try {
      const response = await publicAxiosInstance.get<WhatsAppStatus>(
        "/api/whatsapp/public-status"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching WhatsApp status:", error);
      throw error;
    }
  },

  // Get user-specific WhatsApp status (auth required)
  getMyStatus: async (): Promise<WhatsAppStatus> => {
    try {
      const response = await axiosInstance.get<WhatsAppStatus>(
        "/whatsapp/status"
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
      const response = await axiosInstance.post<WhatsAppStatus>(
        "/whatsapp/connect"
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

  // Force logout and cleanup auth data (auth required)
  forceLogout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.post<{
        success: boolean;
        message: string;
      }>("/whatsapp/force-logout");
      return response.data;
    } catch (error) {
      console.error("Error forcing WhatsApp logout:", error);
      throw error;
    }
  },

  // Get user's WhatsApp groups and preferences (auth required)
  getGroups: async (): Promise<GroupsResponse> => {
    try {
      const response = await axiosInstance.get<GroupsResponse>(
        "/whatsapp/groups"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching WhatsApp groups:", error);
      throw error;
    }
  },

  // Update user's group monitoring preferences (auth required)
  updateGroupPreferences: async (
    preferences: GroupPreference[]
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.put<{
        success: boolean;
        message: string;
      }>("/whatsapp/groups", { preferences });
      return response.data;
    } catch (error) {
      console.error("Error updating group preferences:", error);
      throw error;
    }
  },
};
