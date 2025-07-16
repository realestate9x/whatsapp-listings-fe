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

  const handleToggleGroup = async (groupId: string, enabled: boolean) => {
    // Optimistically update the UI
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.group_id === groupId ? { ...group, is_enabled: enabled } : group
      )
    );

    // Auto-save the preference
    try {
      const updatedGroup = groups.find((g) => g.group_id === groupId);
      if (updatedGroup) {
        const preferences = groups
          .map((group) => ({
            group_id: group.group_id,
            group_name: group.group_name,
            is_enabled: group.group_id === groupId ? enabled : group.is_enabled,
          }))
          .filter((group) => group.is_enabled);

        await updatePreferences.mutateAsync(preferences);
      }
    } catch (error) {
      // Revert the change if save fails
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.group_id === groupId
            ? { ...group, is_enabled: !enabled }
            : group
        )
      );
    }
  };

  const enabledGroupsCount = groups.filter((group) => group.is_enabled).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">How it works</span>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-orange-600" />
                )}
                <span
                  className={`text-sm ${
                    isConnected ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {isConnected ? "Connected" : "Not Connected"}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>
              • Only messages from enabled groups will be saved to the database
            </p>
            <p>• Changes are saved automatically when you toggle a group</p>
            <p>• Changes take effect immediately</p>
            <p>• Historical messages are not affected by preference changes</p>
          </CardContent>
        </Card>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          disabled={updatePreferences.isPending}
                          onCheckedChange={(enabled) =>
                            handleToggleGroup(group.group_id, enabled)
                          }
                          className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Groups;
