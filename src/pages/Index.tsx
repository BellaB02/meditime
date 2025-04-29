
import React, { useEffect, useState } from "react";
import { DailyCareProgress } from "@/components/Dashboard/DailyCareProgress";
import StatsCards from "@/components/Dashboard/StatsCards";
import StatsModule from "@/components/Dashboard/StatsModule";
import { UserWelcome } from "@/components/Dashboard/UserWelcome";
import { DailySummary } from "@/components/Dashboard/DailySummary";
import AppointmentList, { Appointment } from "@/components/Dashboard/AppointmentList";
import { CareSheetList } from "@/components/CareSheets/CareSheetList";
import { Document } from "@/services/DocumentService";
import { WelcomeGuide } from "@/components/Dashboard/WelcomeGuide";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { createDemoData, isNewUser } from "@/utils/demoDataHelper";

export default function Index() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUserState, setIsNewUserState] = useState(false);
  
  // Check if user is new and create demo data if needed
  useEffect(() => {
    const checkNewUserAndCreateDemo = async () => {
      if (!user) return;
      
      setIsLoading(true);
      const userIsNew = await isNewUser();
      
      if (userIsNew) {
        setIsNewUserState(true);
        await createDemoData();
      }
      
      setIsLoading(false);
    };
    
    checkNewUserAndCreateDemo();
  }, [user]);
  
  // Simuler un profil d'utilisateur
  const userProfile = {
    firstName: profile?.first_name || "Utilisateur",
    lastName: profile?.last_name || "",
    role: "Professionnel de santé"
  };

  // Simuler des rendez-vous
  const appointments: Appointment[] = [
    {
      id: "apt1",
      time: "09:00",
      patient: {
        id: "p1",
        name: "Jean Dupont",
        address: "15 rue de Paris",
        care: "Prise de sang"
      }
    },
    {
      id: "apt2",
      time: "10:30",
      patient: {
        id: "p2",
        name: "Marie Martin",
        address: "8 Avenue Victor Hugo",
        care: "Injection"
      }
    }
  ];

  // Simuler des documents pour les feuilles de soins
  const careSheets: Document[] = [
    {
      id: "cs1",
      patientName: "Jean Dupont",
      patientId: "p1",
      name: "Feuille de soins - Prise de sang",
      date: "15/04/2025",
      type: "feuille_de_soins",
      careInfo: {
        type: "Prise de sang",
        code: "AMI 1.5",
        description: "Prélèvement sanguin"
      }
    },
    {
      id: "cs2",
      patientName: "Marie Martin",
      patientId: "p2",
      name: "Feuille de soins - Injection",
      date: "15/04/2025",
      type: "feuille_de_soins",
      careInfo: {
        type: "Injection",
        code: "AMI 1",
        description: "Injection sous-cutanée"
      }
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* En-tête avec message de bienvenue */}
      <UserWelcome firstName={userProfile.firstName} role={userProfile.role} />
      
      {/* Guide de bienvenue pour les nouveaux utilisateurs */}
      <WelcomeGuide />
      
      {/* Statistiques principales */}
      <StatsCards />
      
      {/* Grille principale */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Résumé quotidien - prend 1 colonne sur mobile, 1 sur desktop */}
        <DailySummary 
          appointmentsCount={appointments.length} 
          completedAppointmentsCount={1} 
          nextAppointment={{
            time: "10:30",
            patientName: "Marie Martin"
          }}
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
