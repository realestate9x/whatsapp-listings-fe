import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  whatsappService,
  WhatsAppStatus,
  GroupsResponse,
  GroupPreference,
} from "@/services/whatsapp-service";
import { toast } from "sonner";

export const useWhatsAppStatus = () => {
  return useQuery({
    queryKey: ["whatsapp-status"],
    queryFn: whatsappService.getStatus,
    refetchInterval: 5000, // Poll every 5 seconds to check for status changes
    retry: (failureCount, error) => {
      // Don't retry if it's a network error, but retry for other errors
      if (failureCount < 3) return true;
      return false;
    },
  });
};

export const useMyWhatsAppStatus = () => {
  return useQuery({
    queryKey: ["my-whatsapp-status"],
    queryFn: whatsappService.getMyStatus,
    refetchInterval: (query) => {
      // More frequent polling when not connected or QR is pending
      const data = query.state.data;
      if (!data?.isConnected || data?.qrCode) {
        return 5000; // 5 seconds
      }
      // Less frequent polling when connected
      return 30000; // 30 seconds
    },
    retry: (failureCount, error) => {
      // Don't retry if it's a network error, but retry for other errors
      if (failureCount < 3) return true;
      return false;
    },
    enabled: true, // Always enabled but will only be called when needed
  });
};

export const useStartWhatsApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappService.startConnection,
    onSuccess: (data: WhatsAppStatus) => {
      // Update both cached statuses
      queryClient.setQueryData(["whatsapp-status"], data);
      queryClient.setQueryData(["my-whatsapp-status"], data);

      if (data.isConnected) {
        toast.success("WhatsApp connected successfully!");
      } else if (data.qrCode) {
        toast.info(
          data.message || "QR code generated. Please scan with WhatsApp."
        );
      } else if (data.status === "connecting") {
        toast.info("Attempting to restore connection...");
      }
    },
    onError: (error) => {
      console.error("Failed to start WhatsApp connection:", error);
      toast.error("Failed to start WhatsApp connection");
    },
  });
};

export const useForceLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappService.forceLogout,
    onSuccess: (data) => {
      // Invalidate all WhatsApp related queries
      queryClient.invalidateQueries({ queryKey: ["whatsapp-status"] });
      queryClient.invalidateQueries({ queryKey: ["my-whatsapp-status"] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-groups"] });

      toast.success("WhatsApp logout and cleanup completed successfully!");
    },
    onError: (error) => {
      console.error("Failed to force logout:", error);
      toast.error("Failed to force logout");
    },
  });
};

export const useWhatsAppGroups = () => {
  return useQuery({
    queryKey: ["whatsapp-groups"],
    queryFn: whatsappService.getGroups,
    retry: 2,
    staleTime: 0, // Always consider data stale - no caching
    gcTime: 0, // Don't keep data in cache after component unmounts
  });
};

export const useUpdateGroupPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: GroupPreference[]) =>
      whatsappService.updateGroupPreferences(preferences),
    onSuccess: () => {
      // Invalidate and refetch groups data
      queryClient.invalidateQueries({ queryKey: ["whatsapp-groups"] });
      toast.success("Group monitoring preferences saved successfully!");
    },
    onError: (error) => {
      console.error("Failed to save group preferences:", error);
      toast.error("Failed to save group preferences");
    },
  });
};
