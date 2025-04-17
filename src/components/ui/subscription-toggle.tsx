
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

interface SubscriptionToggleProps {
  className?: string;
  minimal?: boolean;
}

export const SubscriptionToggle = ({ className, minimal = false }: SubscriptionToggleProps) => {
  const { user, updateDemoTier } = useAuth();
  const [isPro, setIsPro] = useState(user?.subscription === "premium");
  
  const handleToggleChange = (checked: boolean) => {
    const newTier = checked ? "premium" : "basic";
    setIsPro(checked);
    updateDemoTier(newTier);
  };

  if (minimal) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Switch
          id="demo-mode-minimal"
          checked={isPro}
          onCheckedChange={handleToggleChange}
          className="data-[state=checked]:bg-healthcare-600"
        />
        <Label htmlFor="demo-mode-minimal" className="text-sm text-muted-foreground">
          Pro Features {isPro ? "Enabled" : "Disabled"}
        </Label>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${className}`}>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-healthcare-100 text-healthcare-700 px-2">
          Demo Mode
        </Badge>
        <Label htmlFor="demo-mode" className="text-sm font-medium">
          {isPro ? "Pro Tier" : "Basic Tier"}
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Basic</span>
        <Switch
          id="demo-mode"
          checked={isPro}
          onCheckedChange={handleToggleChange}
        />
        <span className="text-xs font-medium text-muted-foreground">Pro</span>
      </div>
    </div>
  );
};
