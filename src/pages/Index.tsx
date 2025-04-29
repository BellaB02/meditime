
import { Button } from "@/components/ui/button";
import StatsCards from "@/components/Dashboard/StatsCards";
import { DailyCareProgress } from "@/components/Dashboard/DailyCareProgress";
import { Welcome } from "@/components/Dashboard/Welcome";
import AppointmentList from "@/components/Dashboard/AppointmentList";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Sample appointments data
const todayAppointments = [
  {
    id: "1",
    time: "08:30",
    patient: {
      id: "p1",
      name: "Jean Dupont",
      address: "12 rue des Lilas, 75010 Paris",
      care: "Prise de sang"
    }
  },
  {
    id: "2",
    time: "10:15",
    patient: {
      id: "p2",
      name: "Marie Martin",
      address: "5 avenue Victor Hugo, 75016 Paris",
      care: "Changement pansement"
    },
    completed: true
  },
  {
    id: "3",
    time: "14:00",
    patient: {
      id: "p3",
      name: "Robert Petit",
      address: "8 rue du Commerce, 75015 Paris",
      care: "Injection insuline"
    }
  }
];

const upcomingAppointments = [
  {
    id: "4",
    time: "09:00",
    patient: {
      id: "p4",
      name: "Sophie Leroy",
      address: "25 rue des Martyrs, 75009 Paris",
      care: "Soins post-opératoires"
    }
  },
  {
    id: "5",
    time: "11:30",
    patient: {
      id: "p5",
      name: "Pierre Bernard",
      address: "14 boulevard Haussmann, 75008 Paris",
      care: "Perfusion"
    }
  }
];

export default function Index() {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Show a welcome toast when the dashboard first loads
    if (!showToast) {
      setTimeout(() => {
        toast.success("Bienvenue dans votre application de gestion d'infirmier libéral");
        setShowToast(true);
      }, 1500);
    }
  }, [showToast]);
  
  // Handle appointment completion
  const handleAppointmentComplete = (appointmentId: string) => {
    console.log(`Marking appointment ${appointmentId} as completed`);
  };

  return (
    <motion.div 
      className="space-y-6 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Welcome />
      
      <StatsCards />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyCareProgress 
          completed={1}
          total={3}
        />
        
        <AppointmentList 
          title="Rendez-vous d'aujourd'hui"
          appointments={todayAppointments}
          onAppointmentComplete={handleAppointmentComplete}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <AppointmentList 
          title="Prochains rendez-vous"
          appointments={upcomingAppointments}
        />
      </div>
    </motion.div>
  );
}
