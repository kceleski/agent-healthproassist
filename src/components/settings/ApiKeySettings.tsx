import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  getSerpApiKey, 
  setSerpApiKey, 
  getOpenAiKey, 
  setOpenAiKey,
  getDidKey,
  setDidKey,
  getAssistantId,
  setAssistantId
} from '@/lib/localStorageService';
import { isSerpApiConfigured } from '@/lib/serpApiService';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

const ApiKeySettings = () => {
  const { user } = useAuth();
  const isPro = (user?.demoTier || user?.subscription) === 'premium';
  
  const [serpApiKey, setSerpApiKeyState] = useState<string>('');
  const [openAiKey, setOpenAiKeyState] = useState<string>('');
  const [didKey, setDidKeyState] = useState<string>('');
  const [assistantId, setAssistantIdState] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Load saved keys on component mount
  useEffect(() => {
    const savedSerpApiKey = getSerpApiKey();
    const savedOpenAiKey = getOpenAiKey();
    const savedDidKey = getDidKey();
    const savedAssistantId = getAssistantId();
    
    if (savedSerpApiKey) setSerpApiKeyState(savedSerpApiKey);
    if (savedOpenAiKey) setOpenAiKeyState(savedOpenAiKey);
    if (savedDidKey) setDidKeyState(savedDidKey);
    if (savedAssistantId) setAssistantIdState(savedAssistantId);
  }, []);
  
  const handleSaveKeys = () => {
    setIsSaving(true);
    
    try {
      // Save all keys to local storage
      if (serpApiKey) setSerpApiKey(serpApiKey);
      if (openAiKey) setOpenAiKey(openAiKey);
      if (didKey) setDidKey(didKey);
      if (assistantId) setAssistantId(assistantId);
      
      toast.success('API keys saved successfully');
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast.error('Failed to save API keys');
    } finally {
      setIsSaving(false);
    }
  };
  
  const maskKey = (key: string): string => {
    if (!key) return '';
    if (key.length <= 8) return '********';
    return key.substring(0, 4) + '...' + key.substring(key.length - 4);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Configure your API keys for various services. These keys are stored in your browser's local storage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SerpAPI Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="serpapi-key">SerpAPI Key</Label>
            <Badge variant={isSerpApiConfigured() ? "success" : "outline"}>
              {isSerpApiConfigured() ? "Configured" : "Not Configured"}
            </Badge>
          </div>
          <Input
            id="serpapi-key"
            type="password"
            value={serpApiKey}
            onChange={(e) => setSerpApiKeyState(e.target.value)}
            placeholder="Enter your SerpAPI key"
          />
          <p className="text-sm text-muted-foreground">
            Used for facility search functionality. {isPro ? "Required for Pro users to access live data." : "Only available for Pro users."}
          </p>
        </div>
        
        {/* OpenAI API Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Badge variant={openAiKey ? "success" : "outline"}>
              {openAiKey ? "Configured" : "Not Configured"}
            </Badge>
          </div>
          <Input
            id="openai-key"
            type="password"
            value={openAiKey}
            onChange={(e) => setOpenAiKeyState(e.target.value)}
            placeholder="Enter your OpenAI API key"
          />
          <p className="text-sm text-muted-foreground">
            Required for the AI assistant functionality.
          </p>
        </div>
        
        {/* D-ID API Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="did-key">D-ID API Key</Label>
            <Badge variant={didKey ? "success" : "outline"}>
              {didKey ? "Configured" : "Not Configured"}
            </Badge>
          </div>
          <Input
            id="did-key"
            type="password"
            value={didKey}
            onChange={(e) => setDidKeyState(e.target.value)}
            placeholder="Enter your D-ID API key"
          />
          <p className="text-sm text-muted-foreground">
            Required for the talking avatar functionality.
          </p>
        </div>
        
        {/* Assistant ID */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="assistant-id">OpenAI Assistant ID</Label>
            <Badge variant={assistantId ? "success" : "outline"}>
              {assistantId ? "Configured" : "Not Configured"}
            </Badge>
          </div>
          <Input
            id="assistant-id"
            value={assistantId}
            onChange={(e) => setAssistantIdState(e.target.value)}
            placeholder="Enter your OpenAI Assistant ID"
          />
          <p className="text-sm text-muted-foreground">
            The ID of your OpenAI Assistant.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveKeys} 
          disabled={isSaving}
          className="bg-healthcare-600"
        >
          {isSaving ? 'Saving...' : 'Save API Keys'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeySettings;