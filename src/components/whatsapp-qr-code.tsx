import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useStartWhatsApp,
  useMyWhatsAppStatus,
  useForceLogout,
} from "@/hooks/use-whatsapp";
import QRCode from "react-qr-code";
import { Smartphone, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface WhatsAppQRCodeProps {
  className?: string;
}

const WhatsAppQRCode = ({ className }: WhatsAppQRCodeProps) => {
  const { data: status, isLoading, error, refetch } = useMyWhatsAppStatus();
  const startWhatsApp = useStartWhatsApp();
  const forceLogout = useForceLogout();
  const [hasAttemptedAutoStart, setHasAttemptedAutoStart] = useState(false);

  // Auto-start connection attempt when component mounts and no connection exists
  useEffect(() => {
    if (
      !isLoading &&
      !hasAttemptedAutoStart &&
      status &&
      !status.isConnected &&
      !status.qrCode
    ) {
      console.log("Attempting auto-start WhatsApp connection...");
      setHasAttemptedAutoStart(true);
      startWhatsApp.mutate();
    }
  }, [isLoading, hasAttemptedAutoStart, status, startWhatsApp]);

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

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-500" />
            <p className="text-gray-600">Checking WhatsApp status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Connection Error
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Unable to check WhatsApp status
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={() => refetch()} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => forceLogout.mutate()}
                variant="outline"
                className="w-full"
                disabled={forceLogout.isPending}
              >
                Reset Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Connected state
  if (status?.isConnected || status?.connected) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                WhatsApp Connected
              </h3>
              <p className="text-sm text-gray-600">
                Ready to receive property listings
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // QR code state
  if (status?.qrCode) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Connect WhatsApp
              </h3>
              <p className="text-sm text-gray-600">
                Scan this QR code with WhatsApp
              </p>
            </div>

            <div className="flex justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <QRCode
                style={{ height: 200, maxWidth: "100%", width: "100%" }}
                value={status.qrCode}
                viewBox="0 0 256 256"
              />
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>1. Open WhatsApp on your phone</p>
              <p>2. Tap Menu {`>`} Linked Devices</p>
              <p>3. Tap "Link a Device" and scan this code</p>
            </div>

            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default state - not connected
  return (
    <Card className={className}>
      <CardContent className="p-8 text-center">
        <div className="space-y-6">
          <div>
            <Smartphone className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Connect WhatsApp
            </h3>
            <p className="text-sm text-gray-600">
              Connect your WhatsApp to start receiving property listings from
              groups
            </p>
          </div>

          <Button
            onClick={handleStartConnection}
            disabled={startWhatsApp.isPending}
            className="w-full"
            size="lg"
          >
            {startWhatsApp.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 mr-2" />
                Connect WhatsApp
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppQRCode;
