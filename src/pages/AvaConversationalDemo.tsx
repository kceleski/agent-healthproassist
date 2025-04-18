import React from 'react';
import { Helmet } from 'react-helmet';
import { ConversationalAIProvider } from '@/context/ConversationalAIContext';
import AvaConversationalInterface from '@/components/ava/AvaConversationalInterface';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DIDScriptHead from '@/components/DIDScriptHead';

const AvaConversationalDemo = () => {
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Ava Conversational AI Demo - HealthProAssist</title>
      </Helmet>
      
      <DIDScriptHead mode="avatar" autoStart={false} />
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Ava Conversational AI</h1>
          <p className="text-muted-foreground">
            Interact with Ava to find facilities, manage contacts, and get information about senior care.
          </p>
        </div>
        
        <Tabs defaultValue="demo" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Demo</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="p-4">
            <Card className="h-[700px] overflow-hidden">
              <ConversationalAIProvider>
                <AvaConversationalInterface />
              </ConversationalAIProvider>
            </Card>
          </TabsContent>
          
          <TabsContent value="features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Natural Conversation</h3>
                <p className="text-muted-foreground mb-4">
                  Ava understands natural language and can engage in meaningful conversations about senior care, facilities, and healthcare options.
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Ask questions about senior living options</li>
                  <li>Get personalized recommendations</li>
                  <li>Discuss care requirements and preferences</li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Facility Search</h3>
                <p className="text-muted-foreground mb-4">
                  Find senior living facilities based on location, care type, amenities, and other criteria.
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Search by location or zip code</li>
                  <li>Filter by care type (assisted living, memory care, etc.)</li>
                  <li>View ratings, amenities, and contact information</li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Contact Management</h3>
                <p className="text-muted-foreground mb-4">
                  Access and manage your contacts, including facility staff, clients, and their families.
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>View contact details</li>
                  <li>See relationship history</li>
                  <li>Get reminders for follow-ups</li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Calendar & Payments</h3>
                <p className="text-muted-foreground mb-4">
                  Check your schedule and payment information with simple voice or text commands.
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>View upcoming appointments</li>
                  <li>Check payment status</li>
                  <li>Get summaries of financial information</li>
                </ul>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Try asking Ava:</h3>
          <ul className="space-y-2 text-sm">
            <li>"Find memory care facilities near Boston"</li>
            <li>"What are the top-rated assisted living facilities?"</li>
            <li>"Show me my contacts at Sunrise Senior Living"</li>
            <li>"What appointments do I have today?"</li>
            <li>"Check my payment status for Golden Oaks Care Center"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvaConversationalDemo;