
import React, { useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Message } from '@/hooks/use-ava-assistant';

interface AvaChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  setInput: (input: string) => void;
  onSendMessage: () => void;
}

export function AvaChatInterface({
  messages,
  isLoading,
  input,
  setInput,
  onSendMessage
}: AvaChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat with Ava</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Start a conversation with Ava about finding senior care facilities
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-12' 
                    : 'bg-muted mr-12'
                }`}
              >
                {message.content}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full gap-2">
          <Input
            placeholder="Ask Ava about senior care facilities..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSendMessage()}
            disabled={isLoading}
          />
          <Button onClick={onSendMessage} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
