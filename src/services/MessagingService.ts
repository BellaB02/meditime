
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PatientMessage } from '@/integrations/supabase/services/types';
import { useProfile } from "@/hooks/useProfile";

export const MessagingService = {
  /**
   * Récupère les messages pour un patient spécifique
   */
  getPatientMessages: async (patientId: string): Promise<PatientMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('patient_messages')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erreur lors de la récupération des messages:', err);
      toast.error("Impossible de charger les messages");
      return [];
    }
  },
  
  /**
   * Envoie un message à un patient
   */
  sendMessageToPatient: async (patientId: string, senderId: string, content: string): Promise<PatientMessage | null> => {
    try {
      const { data, error } = await supabase
        .from('patient_messages')
        .insert({
          patient_id: patientId,
          sender_id: senderId,
          content,
          is_from_patient: false,
        })
        .select()
        .single();
        
      if (error) throw error;
      toast.success("Message envoyé");
      return data;
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      toast.error("Erreur lors de l'envoi du message");
      return null;
    }
  },
  
  /**
   * Marque un message comme lu
   */
  markMessageAsRead: async (messageId: string): Promise<PatientMessage | null> => {
    try {
      const { data, error } = await supabase
        .from('patient_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Erreur lors du marquage du message comme lu:", err);
      return null;
    }
  },
  
  /**
   * Envoie un message depuis un patient
   */
  sendMessageFromPatient: async (patientId: string, content: string): Promise<PatientMessage | null> => {
    try {
      const { data, error } = await supabase
        .from('patient_messages')
        .insert({
          patient_id: patientId,
          content,
          is_from_patient: true,
        })
        .select()
        .single();
        
      if (error) throw error;
      toast.success("Message envoyé");
      return data;
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      toast.error("Erreur lors de l'envoi du message");
      return null;
    }
  },
  
  /**
   * Récupère les messages non lus pour un patient
   */
  getUnreadMessagesCount: async (patientId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('patient_messages')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', patientId)
        .eq('is_from_patient', true)
        .is('read_at', null);
        
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.error('Erreur lors de la récupération des messages non lus:', err);
      return 0;
    }
  }
};

// Hook pour utiliser le service de messagerie
export const useMessaging = () => {
  const { profile } = useProfile();
  
  const sendMessage = async (patientId: string, content: string) => {
    if (!profile?.id) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return null;
    }
    
    return MessagingService.sendMessageToPatient(patientId, profile.id, content);
  };
  
  const markAsRead = async (messageId: string) => {
    return MessagingService.markMessageAsRead(messageId);
  };
  
  return {
    getPatientMessages: MessagingService.getPatientMessages,
    sendMessage,
    markAsRead,
    getUnreadMessagesCount: MessagingService.getUnreadMessagesCount,
  };
};
