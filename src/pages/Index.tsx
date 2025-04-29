
import React from "react";
import { DailyCareProgress } from "@/components/Dashboard/DailyCareProgress";
import StatsCards from "@/components/Dashboard/StatsCards";
import StatsModule from "@/components/Dashboard/StatsModule";
import { UserWelcome } from "@/components/Dashboard/UserWelcome";
import { DailySummary } from "@/components/Dashboard/DailySummary";
import AppointmentList, { Appointment } from "@/components/Dashboard/AppointmentList";
import { CareSheetList } from "@/components/CareSheets/CareSheetList";
import { Document } from "@/services/DocumentService";

export default function Index() {
  // Simuler un profil d'utilisateur
  const userProfile = {
    firstName: "Laura",
    lastName: "Dubois",
    role: "Infirmière libérale"
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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <UserWelcome firstName={userProfile.firstName} role={userProfile.role} />
          <StatsCards />
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <DailySummary 
              appointmentsCount={appointments.length} 
              completedAppointmentsCount={1} 
              nextAppointment={{
                time: "10:30",
                patientName: "Marie Martin"
              }}
            />
            <DailyCareProgress className="lg:col-span-2" />
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AppointmentList 
                title="Rendez-vous du jour" 
                appointments={appointments}
              />
            </div>
            <CareSheetList careSheets={careSheets} />
          </div>
          <StatsModule />
        </div>
      </div>
    </div>
  );
}
