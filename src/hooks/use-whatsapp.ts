import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { whatsappService, WhatsAppStatus } from "@/services/whatsapp-service";
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
    refetchInterval: 5000, // Poll every 5 seconds to check for status changes
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
        toast.info("Connection started. Generating QR code...");
      }
    },
    onError: (error) => {
      console.error("Failed to start WhatsApp connection:", error);
      toast.error("Failed to start WhatsApp connection");
    },
  });
};
