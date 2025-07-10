import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import WhatsAppQRCode from "@/components/whatsapp-qr-code";

const Dashboard = () => {
  const { user } = useAuth();
  const name =
    (user?.identities?.[0]?.identity_data?.contact_name as string) ||
    user?.user_metadata?.name ||
    "User";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Welcome back, {name}
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your WhatsApp connection and view your account information
          </p>
        </div>

        {/* WhatsApp Connection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WhatsAppQRCode className="lg:col-span-1" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
