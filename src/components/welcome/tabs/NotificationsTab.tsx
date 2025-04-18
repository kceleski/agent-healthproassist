
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationsTabProps {
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  communicationPreferences: {
    receiveUpdates: boolean;
    receiveReferrals: boolean;
    allowContactSharing: boolean;
  };
  onNotificationChange: (field: "email" | "sms" | "inApp", value: boolean) => void;
  onCommunicationPrefChange: (field: "receiveUpdates" | "receiveReferrals" | "allowContactSharing", value: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
}

const NotificationsTab = ({
  notifications,
  communicationPreferences,
  onNotificationChange,
  onCommunicationPrefChange,
  onBack,
  onContinue
}: NotificationsTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Notification Preferences</h2>
      <p>
        Choose how you'd like to receive updates and communications from HealthProAssist.
        You can update these preferences anytime in your profile settings.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications" className="font-medium">
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive updates and alerts via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={notifications.email}
            onCheckedChange={(checked) => onNotificationChange("email", checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="sms-notifications" className="font-medium">
              SMS Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive updates and alerts via text message
            </p>
          </div>
          <Switch 
            id="sms-notifications"
            checked={notifications.sms}
            onCheckedChange={(checked) => onNotificationChange("sms", checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="inapp-notifications" className="font-medium">
              In-App Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive updates and alerts within the application
            </p>
          </div>
          <Switch 
            id="inapp-notifications"
            checked={notifications.inApp}
            onCheckedChange={(checked) => onNotificationChange("inApp", checked)}
          />
        </div>
        
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="receive-updates" className="font-medium">
                Receive Healthcare Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get industry news and healthcare facility updates
              </p>
            </div>
            <Switch 
              id="receive-updates"
              checked={communicationPreferences.receiveUpdates}
              onCheckedChange={(checked) => onCommunicationPrefChange("receiveUpdates", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="receive-referrals" className="font-medium">
                Receive Referral Opportunities
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow facilities to contact you about potential client referrals
              </p>
            </div>
            <Switch 
              id="receive-referrals"
              checked={communicationPreferences.receiveReferrals}
              onCheckedChange={(checked) => onCommunicationPrefChange("receiveReferrals", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-contacts" className="font-medium">
                Contact Sharing
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow sharing your contact info with healthcare facilities
              </p>
            </div>
            <Switch 
              id="share-contacts"
              checked={communicationPreferences.allowContactSharing}
              onCheckedChange={(checked) => onCommunicationPrefChange("allowContactSharing", checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default NotificationsTab;
