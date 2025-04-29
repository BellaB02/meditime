
import React, { useEffect, useState } from "react";
import { DailyCareProgress } from "@/components/Dashboard/DailyCareProgress";
import StatsCards from "@/components/Dashboard/StatsCards";
import StatsModule from "@/components/Dashboard/StatsModule";
import { UserWelcome } from "@/components/Dashboard/UserWelcome";
import { DailySummary } from "@/components/Dashboard/DailySummary";
import AppointmentList from "@/components/Dashboard/AppointmentList";
import { CareSheetList } from "@/components/CareSheets/CareSheetList";
import { WelcomeGuide } from "@/components/Dashboard/WelcomeGuide";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { isNewUser } from "@/utils/demoDataHelper";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUserState, setIsNewUserState] = useState(false);
  
  // Check if user is new
  useEffect(() => {
    const checkNewUser = async () => {
      if (!user) return;
      
      setIsLoading(true);
      const userIsNew = await isNewUser();
      setIsNewUserState(userIsNew);
      setIsLoading(false);
    };
    
    checkNewUser();
  }, [user]);
  
  // Fetch real appointments from Supabase
  const { data: appointments = [] } = useQuery({
    queryKey: ['today-appointments'],
    queryFn: async () => {
      if (!user) return [];
      
      // Get today's date in ISO format (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          time,
          patient_id,
          care_type,
          status,
          patients(first_name, last_name, address)
        `)
        .eq('date', today)
        .order('time');
        
      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
      
      // Transform the data to match the component's expected format
      return data.map(appt => ({
        id: appt.id,
        time: appt.time.substring(0, 5), // Format HH:MM
        completed: appt.status === 'completed', // Map status to completed boolean
        patient: {
          id: appt.patient_id,
          name: `${appt.patients?.first_name || ""} ${appt.patients?.last_name || ""}`,
          address: appt.patients?.address || "",
          care: appt.care_type
        }
      }));
    },
    enabled: !!user
  });
  
  // Fetch real care sheets from Supabase
  const { data: careSheets = [] } = useQuery({
    queryKey: ['recent-caresheets'],
    queryFn: async () => {
      if (!user) return [];
      
      // Get documents of type "feuille_de_soins" or similar
      const { data, error } = await supabase
        .from('care_documents')
        .select(`
          id, 
          title, 
          document_type,
          patient_id,
          patients(first_name, last_name),
          created_at
        `)
        .in('document_type', ['feuille_de_soins', 'careSheet'])
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Error fetching care sheets:", error);
        throw error;
      }
      
      // Transform the data to match the component's expected format
      return data.map(doc => {
        // Format date to DD/MM/YYYY
        const date = new Date(doc.created_at);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        
        return {
          id: doc.id,
          patientName: `${doc.patients?.first_name || ""} ${doc.patients?.last_name || ""}`,
          patientId: doc.patient_id,
          name: doc.title,
          date: formattedDate,
          type: doc.document_type,
          careInfo: {
            type: doc.title?.includes('-') ? doc.title.split('-')[1]?.trim() : "",
            code: "",
            description: ""
          }
        };
      });
    },
    enabled: !!user
  });
  
  // User profile for welcome message
  const userProfile = {
    firstName: profile?.first_name || "Utilisateur",
    lastName: profile?.last_name || "",
    role: "Professionnel de santé"
  };
  
  // Calculate summary data from real appointments
  const completedAppointmentsCount = appointments.filter(apt => apt.completed).length || 0;
  const nextAppointment = appointments.length > 0 ? {
    time: appointments[0].time,
    patientName: appointments[0].patient.name
  } : undefined;
  
  return (
    <div className="space-y-6">
      {/* En-tête avec message de bienvenue */}
      <UserWelcome firstName={userProfile.firstName} role={userProfile.role} />
      
      {/* Guide de bienvenue pour les nouveaux utilisateurs */}
      {isNewUserState && <WelcomeGuide />}
      
      {/* Statistiques principales */}
      <StatsCards />
      
      {/* Grille principale */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Résumé quotidien - prend 1 colonne sur mobile, 1 sur desktop */}
        <DailySummary 
          appointmentsCount={appointments.length} 
          completedAppointmentsCount={completedAppointmentsCount} 
          nextAppointment={nextAppointment}
        />
        
        {/* Progression des soins - prend toute la largeur sur mobile, 2 colonnes sur desktop */}
        <DailyCareProgress className="md:col-span-2" />
      </div>
      
      {/* Liste de rendez-vous et feuilles de soins */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Liste de rendez-vous - prend toute la largeur sur mobile, 2 colonnes sur desktop */}
        <div className="md:col-span-2">
          <AppointmentList 
            title="Rendez-vous du jour" 
            appointments={appointments}
          />
        </div>
        
        {/* Liste de feuilles de soins - prend 1 colonne */}
        <CareSheetList careSheets={careSheets} />
      </div>
      
      {/* Module de statistiques */}
      <StatsModule />
    </div>
  );
}
