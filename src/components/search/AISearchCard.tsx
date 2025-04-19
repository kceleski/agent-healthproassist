
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAISearch } from '@/hooks/useAISearch';

interface AISearchCardProps {
  onFiltersUpdate: (filters: any) => void;
}

export const AISearchCard = ({ onFiltersUpdate }: AISearchCardProps) => {
  const { toast } = useToast();
  const [aiQuery, setAIQuery] = useState<string>("");
  const { sendMessage, isConnected } = useAISearch(onFiltersUpdate);

  const handleAISearch = () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter what you're looking for",
        variant: "destructive",
      });
      return;
    }

    sendMessage(aiQuery);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Assisted Search</CardTitle>
        <CardDescription>
          Describe what you're looking for and our AI will help find the right facilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="E.g., 'Looking for memory care facilities in Phoenix with activities for seniors'"
            value={aiQuery}
            onChange={(e) => setAIQuery(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleAISearch}
            disabled={!isConnected}
            className="bg-healthcare-600 hover:bg-healthcare-700"
          >
            <Bot className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
        </div>
        {!isConnected && (
          <p className="text-sm text-muted-foreground">
            Connecting to AI assistant...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
