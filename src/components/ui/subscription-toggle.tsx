
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type SubscriptionTier = "basic" | "premium";

interface SubscriptionToggleProps {
  className?: string;
}

export const SubscriptionToggle = ({ className }: SubscriptionToggleProps) => {
  const { user, updateDemoTier } = useAuth();
  // Use subscription as primary and demoTier as fallback
  const currentTier = user?.subscription === "premium" || user?.demoTier === "premium" ? "premium" : "basic";
  const [isPro, setIsPro] = useState(currentTier === "premium");
  
  const handleToggleChange = (checked: boolean) => {
    const newTier = checked ? "premium" : "basic";
    setIsPro(checked);
    updateDemoTier(newTier);
  };

  return (
    <Card className={`p-3 flex items-center justify-between ${className}`}>
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
    </Card>
  );
};
