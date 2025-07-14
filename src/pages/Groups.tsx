import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useMyWhatsAppStatus,
  useWhatsAppGroups,
  useUpdateGroupPreferences,
} from "@/hooks/use-whatsapp";
import {
  Loader2,
  Users,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WhatsAppGroup {
  group_id: string;
  group_name: string;
  is_enabled: boolean;
}

const Groups = () => {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const { toast } = useToast();

  // Use react-query hooks
  const { data: statusData, isLoading: statusLoading } = useMyWhatsAppStatus();
  const {
    data: groupsData,
    isLoading: groupsLoading,
    error: groupsError,
  } = useWhatsAppGroups();
  const updatePreferences = useUpdateGroupPreferences();

  const isConnected = statusData?.isConnected || statusData?.connected || false;
  const loading = statusLoading || groupsLoading;

  // Update groups state when query data changes
  useEffect(() => {
    if (groupsData?.groups) {
      setGroups(groupsData.groups);
    }
  }, [groupsData?.groups]);

  // Show error from groups query
  useEffect(() => {
    if (groupsError) {
      toast({
        title: "Error",
        description: "Failed to fetch WhatsApp groups",
        variant: "destructive",
      });
    }
  }, [groupsError, toast]);

  const handleToggleGroup = (groupId: string, enabled: boolean) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.group_id === groupId ? { ...group, is_enabled: enabled } : group
      )
    );
  };

  const savePreferences = async () => {
    try {
      // Only save groups that are enabled - no need to save disabled groups
      const preferences = groups
        .filter((group) => group.is_enabled)
        .map((group) => ({
          group_id: group.group_id,
          group_name: group.group_name,
          is_enabled: true,
        }));

      await updatePreferences.mutateAsync(preferences);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const enabledGroupsCount = groups.filter((group) => group.is_enabled).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            WhatsApp Groups
          </h1>
          <p className="text-gray-600 text-lg">
            Select which WhatsApp groups you want to monitor for real estate
            messages
          </p>
        </div>

        {/* Connection Status */}
        <Alert
          className={
            isConnected
              ? "border-green-200 bg-green-50"
              : "border-orange-200 bg-orange-50"
          }
        >
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-600" />
            )}
            <AlertDescription
              className={isConnected ? "text-green-800" : "text-orange-800"}
            >
              {isConnected
                ? "WhatsApp is connected and ready"
                : "WhatsApp is not connected. Please connect first from the Dashboard."}
            </AlertDescription>
          </div>
        </Alert>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Group Monitoring Settings
              {groups.length > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({enabledGroupsCount} of {groups.length} enabled)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading groups...</span>
              </div>
            ) : !isConnected ? (
              <div className="text-center py-8">
                <WifiOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Connect to WhatsApp first to see your groups
                </p>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No WhatsApp groups found</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groups.map((group) => (
                    <div
                      key={group.group_id}
                      className="flex flex-col p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {group.is_enabled ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {group.group_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {group.is_enabled
                              ? "Monitoring active"
                              : "Not monitoring"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Switch
                          checked={group.is_enabled}
                          onCheckedChange={(enabled) =>
                            handleToggleGroup(group.group_id, enabled)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={savePreferences}
                    disabled={updatePreferences.isPending}
                    className="w-full"
                  >
                    {updatePreferences.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>
              • Only messages from enabled groups will be saved to the database
            </p>
            <p>• You can change these settings anytime</p>
            <p>• Changes take effect immediately after saving</p>
            <p>• Historical messages are not affected by preference changes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Groups;
