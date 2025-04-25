import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAISearch } from '@/hooks/useAISearch';

interface AISearchCardProps {
  onFiltersUpdate: (filters: any) => void;
}

export const AISearchCard = ({ onFiltersUpdate }: AISearchCardProps) => {
  const { toast } = useToast();
  const [aiQuery, setAIQuery] = useState<string>("");
  const { sendMessage, isLoading } = useAISearch(onFiltersUpdate);
  
  const [conversationData, setConversationData] = useState<{
    recommendations?: string[];
    preferences?: Record<string, string>;
    notes?: string[];
  }>({});

  const handleAISearch = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter what you're looking for",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await sendMessage(aiQuery);
      
      if (response && response.conversationData) {
        setConversationData(response.conversationData);
        sessionStorage.setItem('searchConversationData', JSON.stringify(response.conversationData));
      }
      
      setAIQuery("");
    } catch (error) {
      console.error('AI Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    }
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
          Chat with our AI assistant to find the right facilities for your needs
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
            disabled={isLoading}
          />
          <Button 
            onClick={handleAISearch}
            disabled={isLoading}
            className="bg-healthcare-600 hover:bg-healthcare-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bot className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Processing..." : "Ask AI"}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Try queries like:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>"Find memory care facilities in Phoenix with transportation services"</li>
            <li>"Show me assisted living options with pet-friendly amenities"</li>
            <li>"Nursing facilities with 24/7 medical staff near Scottsdale"</li>
          </ul>
        </div>

        {conversationData.recommendations && conversationData.recommendations.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc pl-4 space-y-1">
              {conversationData.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
