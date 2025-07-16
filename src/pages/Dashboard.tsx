import WhatsAppQRCode from "@/components/whatsapp-qr-code";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const name =
    (user?.identities?.[0]?.identity_data?.contact_name as string) ||
    user?.user_metadata?.name ||
    "User";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* WhatsApp Connection Section */}
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-md">
            <WhatsAppQRCode className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
