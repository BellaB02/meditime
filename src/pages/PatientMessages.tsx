
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Send, User, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const PatientMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }
        
        // Get patient info
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (patientError || !patientData) {
          throw new Error("Patient non trouvé");
        }
        
        setPatient(patientData);
        
        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('patient_messages')
          .select('*')
          .eq('patient_id', patientData.id)
          .order('created_at', { ascending: true });
          
        if (messagesError) throw messagesError;
        
        setMessages(messagesData || []);
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Erreur lors du chargement des messages");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Scroll to bottom on load
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [navigate]);
  
  useEffect(() => {
    if (!patient) return;
    
    // Set up realtime subscription
    const channel = supabase
      .channel('patient-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'patient_messages',
          filter: `patient_id=eq.${patient.id}`
        },
        (payload) => {
          const newMessage = payload.new as any;
          setMessages(prev => [...prev, newMessage]);
          
          // Mark messages as read if they are from the caregiver
          if (!newMessage.is_from_patient && !newMessage.read_at) {
            markMessageAsRead(newMessage.id);
          }
          
          // Scroll to bottom on new message
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [patient]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('patient_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);
    } catch (error) {
      console.error("Erreur lors du marquage du message comme lu:", error);
    }
  };
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !patient) return;
    
    try {
      const { error } = await supabase
        .from('patient_messages')
        .insert({
          patient_id: patient.id,
          content: newMessage.trim(),
          is_from_patient: true
        });
        
      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const formatMessageDate = (dateStr: string) => {
    return format(new Date(dateStr), 'PPp', { locale: fr });
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/patient-portal')} className="mr-2">
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold">Messages avec mon soignant</h1>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Skeleton className="h-8 w-8 rounded-full mr-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-16 w-[300px]" />
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-16 w-[300px]" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full ml-2" />
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Aucun message dans cette conversation. Envoyez le premier message à votre soignant.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={cn(
                        "flex items-start",
                        message.is_from_patient ? "justify-end" : "justify-start"
                      )}
                    >
                      {!message.is_from_patient && (
                        <Avatar className="mr-2">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            S
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div 
                        className={cn(
                          "rounded-lg p-3 max-w-[80%]",
                          message.is_from_patient 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className={cn(
                          "text-xs mt-1",
                          message.is_from_patient 
                            ? "text-primary-foreground/80" 
                            : "text-muted-foreground"
                        )}>
                          {formatMessageDate(message.created_at)}
                        </div>
                      </div>
                      
                      {message.is_from_patient && (
                        <Avatar className="ml-2">
                          <AvatarFallback className="bg-secondary">
                            <User size={16} />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="border-t p-4">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Textarea
                  placeholder="Écrivez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[60px] flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="self-end"
                >
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientMessages;
