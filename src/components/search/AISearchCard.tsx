
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
  const [isProcessing, setIsProcessing] = useState(false);
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

    setIsProcessing(true);
    sendMessage(aiQuery);
    
    // Reset processing state after a short delay
    setTimeout(() => {
      setIsProcessing(false);
      // Clear the input after processing
      setAIQuery("");
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAISearch();
    }
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
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={!isConnected || isProcessing}
          />
          <Button 
            onClick={handleAISearch}
            disabled={!isConnected || isProcessing}
            className="bg-healthcare-600 hover:bg-healthcare-700"
          >
            <Bot className="h-4 w-4 mr-2" />
            {isProcessing ? "Processing..." : "Ask AI"}
          </Button>
        </div>
        {!isConnected && (
          <p className="text-sm text-muted-foreground">
            Connecting to AI assistant...
          </p>
        )}
        <div className="text-sm text-muted-foreground">
          <p>Try queries like:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>"Find memory care facilities in Phoenix with transportation services"</li>
            <li>"Show me assisted living options with pet-friendly amenities"</li>
            <li>"Nursing facilities with 24/7 medical staff near Scottsdale"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
