
import { useState } from "react";
import { toast } from "sonner";
import { createReminder, ReminderType, ReminderTime, Reminder } from "@/services/reminderService";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ReminderSettingsProps {
  appointmentId: string;
  existingReminders?: Reminder[];
  onSave?: () => void;
}

const ReminderSettings = ({ appointmentId, existingReminders = [], onSave }: ReminderSettingsProps) => {
  const { user } = useAuth();
  const [emailEnabled, setEmailEnabled] = useState(existingReminders.some(r => r.type === 'email'));
  const [smsEnabled, setSmsEnabled] = useState(existingReminders.some(r => r.type === 'sms'));
  const [emailTime, setEmailTime] = useState<ReminderTime>(
    (existingReminders.find(r => r.type === 'email')?.time_before as ReminderTime) || '30min'
  );
  const [smsTime, setSmsTime] = useState<ReminderTime>(
    (existingReminders.find(r => r.type === 'sms')?.time_before as ReminderTime) || '15min'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsSaving(true);
    try {
      const remindersToCreate = [];

      if (emailEnabled) {
        remindersToCreate.push({
          appointment_id: appointmentId,
          type: 'email' as ReminderType,
          time_before: emailTime,
          user_id: user.id
        });
      }

      if (smsEnabled) {
        remindersToCreate.push({
          appointment_id: appointmentId,
          type: 'sms' as ReminderType,
          time_before: smsTime,
          user_id: user.id
        });
      }

      // Process each reminder
      for (const reminder of remindersToCreate) {
        await createReminder(reminder);
      }

      toast.success("Reminders saved successfully");
      if (onSave) onSave();
    } catch (error) {
      console.error("Error saving reminders:", error);
      toast.error("Failed to save reminders");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 p-1">
      <h3 className="text-lg font-medium">Reminder Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between border p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 h-8 w-8 rounded-full flex items-center justify-center">
              <Mail size={16} />
            </div>
            <div>
              <Label htmlFor="email-reminder" className="font-medium">Email Reminder</Label>
              <p className="text-sm text-muted-foreground">Send a reminder to your email</p>
            </div>
          </div>
          <Switch 
            id="email-reminder" 
            checked={emailEnabled}
            onCheckedChange={setEmailEnabled}
          />
        </div>
        
        {emailEnabled && (
          <div className="ml-11 space-y-2">
            <Label htmlFor="email-time">Remind me</Label>
            <Select value={emailTime} onValueChange={(value) => setEmailTime(value as ReminderTime)}>
              <SelectTrigger id="email-time" className="w-full">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes before</SelectItem>
                <SelectItem value="30min">30 minutes before</SelectItem>
                <SelectItem value="1hour">1 hour before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center justify-between border p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-700 h-8 w-8 rounded-full flex items-center justify-center">
              <Phone size={16} />
            </div>
            <div>
              <Label htmlFor="sms-reminder" className="font-medium">SMS Reminder</Label>
              <p className="text-sm text-muted-foreground">Send a reminder to your phone</p>
            </div>
          </div>
          <Switch 
            id="sms-reminder" 
            checked={smsEnabled}
            onCheckedChange={setSmsEnabled}
          />
        </div>
        
        {smsEnabled && (
          <div className="ml-11 space-y-2">
            <Label htmlFor="sms-time">Remind me</Label>
            <Select value={smsTime} onValueChange={(value) => setSmsTime(value as ReminderTime)}>
              <SelectTrigger id="sms-time" className="w-full">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes before</SelectItem>
                <SelectItem value="30min">30 minutes before</SelectItem>
                <SelectItem value="1hour">1 hour before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="pt-2 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Reminders"}
          <Bell className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReminderSettings;
