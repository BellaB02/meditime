
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSupabaseServices } from '@/hooks/useSupabaseServices';
import { supabase } from '@/integrations/supabase/client';
import { PatientMessage } from '@/integrations/supabase/services/types';
import { useProfile } from '@/hooks/useProfile';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Send, Clock, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const MessagingTab = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const { profile } = useProfile();

  // Récupération des messages
  useEffect(() => {
    if (!patientId) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('patient_messages')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des messages:', err);
        toast.error("Impossible de charger les messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Abonnement aux nouveaux messages via realtime
    const channel = supabase
      .channel('patient-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_messages',
          filter: `patient_id=eq.${patientId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [payload.new as PatientMessage, ...prev]);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  // Envoi d'un message
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('patient_messages')
        .insert({
          patient_id: patientId,
          sender_id: profile?.id,
          content,
          is_from_patient: false,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNewMessage('');
      toast.success("Message envoyé");
      queryClient.invalidateQueries({ queryKey: ['patient', patientId, 'messages'] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  });

  // Marquer un message comme lu
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { data, error } = await supabase
        .from('patient_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setMessages(prev => 
        prev.map(msg => msg.id === data.id ? data : msg)
      );
      queryClient.invalidateQueries({ queryKey: ['patient', patientId, 'messages'] });
    },
    onError: (error) => {
      console.error("Erreur lors du marquage du message comme lu:", error);
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate(newMessage);
  };

  const handleMarkAsRead = (messageId: string) => {
    markAsReadMutation.mutate(messageId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication avec le patient</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <Textarea 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Écrivez un message au patient..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                className="flex items-center gap-2"
              >
                <Send size={16} /> Envoyer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun message échangé avec ce patient
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={cn(
                      "p-4 rounded-lg",
                      message.is_from_patient 
                        ? "bg-muted border border-border" 
                        : "bg-primary/10"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">
                        {message.is_from_patient ? 'Patient' : 'Soignant'}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {message.created_at && (
                          <span>
                            {format(new Date(message.created_at), 'PPp', { locale: fr })}
                          </span>
                        )}
                        {message.is_from_patient && (
                          message.read_at ? (
                            <CheckCheck size={14} className="text-green-500" />
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => handleMarkAsRead(message.id)}
                            >
                              <Clock size={14} />
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingTab;
