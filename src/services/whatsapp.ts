import { axiosInstance, publicAxiosInstance } from "./api";

export interface WhatsAppMessage {
  id: string;
  user_id: string;
  timestamp: string;
  group_id: string;
  group_name: string;
  sender: string;
  message: Record<string, unknown>;
  created_at: string;
}

export interface WhatsAppGroup {
  group_name: string;
  group_id: string;
  message_count: number;
  last_message: string;
}

export interface MessageResponse {
  messages: WhatsAppMessage[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
  };
}

export interface GroupsResponse {
  groups: WhatsAppGroup[];
}

export interface GroupMessageResponse extends MessageResponse {
  group_name: string;
}

// WhatsApp API service
export const whatsappService = {
  // Authenticate WhatsApp service for current user
  authenticate: async (): Promise<{
    success: boolean;
    message: string;
    user_id: string;
  }> => {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
      user_id: string;
    }>("/whatsapp/authenticate");
    return response.data;
  },

  // Get all messages for authenticated user
  getMessages: async (params?: {
    group_name?: string;
    limit?: number;
    offset?: number;
  }): Promise<MessageResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.group_name)
      searchParams.append("group_name", params.group_name);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    const endpoint = `/messages${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await axiosInstance.get<MessageResponse>(endpoint);
    return response.data;
  },

  // Get list of groups
  getGroups: async (): Promise<GroupsResponse> => {
    const response = await axiosInstance.get<GroupsResponse>(
      "/messages/groups"
    );
    return response.data;
  },

  // Get messages from specific group
  getGroupMessages: async (
    groupName: string,
    params?: { limit?: number; offset?: number }
  ): Promise<GroupMessageResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    const endpoint = `/messages/groups/${encodeURIComponent(groupName)}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await axiosInstance.get<GroupMessageResponse>(endpoint);
    return response.data;
  },
};

// WhatsApp connection service (using public API without auth)
export const whatsappConnectionService = {
  // Start WhatsApp connection
  startConnection: async (): Promise<{
    status: string;
    message: string;
    isConnected: boolean;
    qrCode: string | null;
  }> => {
    const response = await publicAxiosInstance.get<{
      status: string;
      message: string;
      isConnected: boolean;
      qrCode: string | null;
    }>("/start-whatsapp");
    return response.data;
  },

  // Check connection status
  getStatus: async (): Promise<{
    connected: boolean;
    qr_pending: boolean;
    socket_active: boolean;
    isConnected: boolean;
    qrCode: string | null;
    status: string;
    message: string;
  }> => {
    const response = await publicAxiosInstance.get<{
      connected: boolean;
      qr_pending: boolean;
      socket_active: boolean;
      isConnected: boolean;
      qrCode: string | null;
      status: string;
      message: string;
    }>("/status");
    return response.data;
  },
};
