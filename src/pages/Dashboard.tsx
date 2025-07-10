import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

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
            Manage your account and view your information
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="border-l-4 border-l-blue-600 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Dashboard Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              You're successfully authenticated and ready to access your
              personalized dashboard. Your account information and settings are
              available below.
            </p>
          </CardContent>
        </Card>

        {/* User Info Card */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">
                    Email Address
                  </span>
                  <span className="text-gray-900">
                    {user?.email || "Not available"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">
                    Display Name
                  </span>
                  <span className="text-gray-900">{name}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">User ID</span>
                  <span className="text-gray-900 font-mono text-sm">
                    {user?.id?.slice(0, 8) || "Not available"}...
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">
                    Account Created
                  </span>
                  <span className="text-gray-900">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
