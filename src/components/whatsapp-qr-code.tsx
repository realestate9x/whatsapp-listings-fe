import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useStartWhatsApp, useMyWhatsAppStatus } from "@/hooks/use-whatsapp";
import QRCode from "react-qr-code";
import {
  Smartphone,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  QrCode,
} from "lucide-react";

interface WhatsAppQRCodeProps {
  className?: string;
}

const WhatsAppQRCode = ({ className }: WhatsAppQRCodeProps) => {
  const { data: status, isLoading, error, refetch } = useMyWhatsAppStatus();
  const startWhatsApp = useStartWhatsApp();

  // Auto-refresh when QR code is shown or when connecting
  useEffect(() => {
    if (
      (status?.qrCode && !status?.isConnected) ||
      status?.status === "connecting"
    ) {
      const interval = setInterval(() => {
        refetch();
      }, 5000); // Check every 5 seconds when QR is shown or connecting

      return () => clearInterval(interval);
    }
  }, [status?.qrCode, status?.isConnected, status?.status, refetch]);

  const handleStartConnection = () => {
    startWhatsApp.mutate();
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            WhatsApp Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            WhatsApp Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to check status. Try again.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => refetch()}
            className="mt-4 w-full"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If connected, show connected status
  if (status?.isConnected || status?.connected) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            WhatsApp Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <Wifi className="w-4 h-4 mr-1" />
                Connected
              </Badge>
            </div>
            <p className="text-sm text-gray-600">WhatsApp connected!</p>

            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If QR code is available, show it
  if (status?.qrCode) {
    return (
      <Card className={className}>
        <CardContent className="p-4 space-y-4">
          <Alert>
            <QrCode className="h-4 w-4" />
            <AlertDescription>Scan with WhatsApp to connect.</AlertDescription>
          </Alert>

          <div className="flex justify-center p-4 bg-white rounded-lg border">
            <QRCode
              style={{ height: 300, maxWidth: "100%", width: "100%" }}
              value={status.qrCode}
              viewBox="0 0 256 256"
            />
          </div>

          <Button
            onClick={() => refetch()}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh QR Code
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Default state - show start button
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          WhatsApp Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <WifiOff className="w-4 h-4 mr-1" />
            Not Connected
          </Badge>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">Connect WhatsApp to start.</p>

          <Button
            onClick={handleStartConnection}
            disabled={startWhatsApp.isPending}
            className="w-full"
          >
            {startWhatsApp.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Starting Connection...
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 mr-2" />
                Start WhatsApp Connection
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppQRCode;
