import React, { useState, useRef, useEffect } from 'react';
import { useConversationalAI } from '@/context/ConversationalAIContext';
import { DataType } from '@/services/data-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, Search, Calendar, DollarSign, Users, Building, Mic, X } from 'lucide-react';
import { LocationSearchResult } from '@/services/maps-service';

interface AvaConversationalInterfaceProps {
  className?: string;
  avatarUrl?: string;
  defaultPresenter?: string;
}

const AvaConversationalInterface: React.FC<AvaConversationalInterfaceProps> = ({
  className = '',
  avatarUrl = 'https://create-images-results.d-id.com/DefaultPresenters/Erica_f/image.jpeg',
  defaultPresenter = 'Erica'
}) => {
  const {
    messages,
    isLoading,
    isAnimating,
    currentVideoUrl,
    dataResults,
    sendMessage,
    fetchDataFromAI,
    clearMessages
  } = useConversationalAI();
  
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Play video when URL changes
  useEffect(() => {
    if (currentVideoUrl && videoRef.current) {
      videoRef.current.src = currentVideoUrl;
      videoRef.current.play().catch(err => console.error('Error playing video:', err));
    }
  }, [currentVideoUrl]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue);
    setInputValue('');
  };
  
  // Handle voice input
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };
  
  // Handle data request
  const handleDataRequest = async (type: DataType, query?: string) => {
    await fetchDataFromAI({
      type,
      query: query || inputValue,
      limit: 5
    });
  };
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={avatarUrl} alt="Ava" />
            <AvatarFallback>{defaultPresenter.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">Ava - Healthcare Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by AI</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearMessages}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Avatar className="h-16 w-16 mb-4">
                  <AvatarImage src={avatarUrl} alt="Ava" />
                  <AvatarFallback>{defaultPresenter.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium mb-2">Hello, I'm Ava</h3>
                <p className="text-muted-foreground mb-4">
                  I can help you find facilities, manage contacts, and answer questions about senior care.
                </p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-start"
                    onClick={() => handleDataRequest(DataType.FACILITIES, "senior living facilities near me")}
                  >
                    <Building className="h-4 w-4" />
                    <span>Find facilities</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-start"
                    onClick={() => handleDataRequest(DataType.CONTACTS)}
                  >
                    <Users className="h-4 w-4" />
                    <span>View contacts</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-start"
                    onClick={() => handleDataRequest(DataType.CALENDAR)}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Check calendar</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-start"
                    onClick={() => handleDataRequest(DataType.PAYMENTS)}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>View payments</span>
                  </Button>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Video player for D-ID */}
          {currentVideoUrl && (
            <div className="p-4 border-t">
              <video
                ref={videoRef}
                className="w-full max-h-[200px] rounded-lg"
                controls
                autoPlay
                playsInline
              >
                <source src={currentVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {/* Input area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isLoading || isListening}
                onClick={handleVoiceInput}
              >
                <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
              </Button>
              <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Data results panel */}
        {dataResults && (
          <div className="w-1/3 border-l overflow-y-auto p-4">
            <h3 className="font-medium mb-4">Results</h3>
            
            {dataResults.type === DataType.FACILITIES && (
              <div className="space-y-4">
                {(dataResults.data as LocationSearchResult[]).map((facility) => (
                  <Card key={facility.id} className="p-3">
                    <h4 className="font-medium">{facility.name}</h4>
                    <p className="text-sm text-muted-foreground">{facility.address}</p>
                    {facility.rating && (
                      <div className="flex items-center mt-1">
                        <span className="text-sm font-medium">{facility.rating}</span>
                        <span className="text-yellow-500 ml-1">★</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
            
            {dataResults.type === DataType.CONTACTS && (
              <div className="space-y-4">
                {dataResults.data.map((contact: any) => (
                  <Card key={contact.id} className="p-3">
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                    <p className="text-sm">{contact.facility}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span>{contact.email}</span>
                      <span>|</span>
                      <span>{contact.phone}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {dataResults.type === DataType.PAYMENTS && (
              <div className="space-y-4">
                {dataResults.data.map((payment: any) => (
                  <Card key={payment.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{payment.facility}</h4>
                        <p className="text-sm text-muted-foreground">Resident: {payment.resident}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">${payment.amount}</span>
                        <p className={`text-sm ${payment.status === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                          {payment.status}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mt-1">Date: {payment.date}</p>
                  </Card>
                ))}
              </div>
            )}
            
            {dataResults.type === DataType.CALENDAR && (
              <div className="space-y-4">
                {dataResults.data.map((event: any) => (
                  <Card key={event.id} className="p-3">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.date} at {event.time}
                    </p>
                    <p className="text-sm">Location: {event.location}</p>
                    <div className="mt-1">
                      <p className="text-sm font-medium">Attendees:</p>
                      <div className="text-sm">
                        {event.attendees.map((attendee: string, index: number) => (
                          <span key={index}>
                            {attendee}{index < event.attendees.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvaConversationalInterface;