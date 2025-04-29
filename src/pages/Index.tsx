import { useState } from "react";
import StatsCards from "@/components/Dashboard/StatsCards";
import AppointmentList from "@/components/Dashboard/AppointmentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, FileText } from "lucide-react";

// Données fictives pour la démo
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
    }
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
    time: "Demain, 09:00",
    patient: {
      id: "p4",
      name: "Sophie Leroy",
      address: "25 rue des Martyrs, 75009 Paris",
      care: "Soins post-opératoires"
    }
  },
  {
    id: "5",
    time: "Demain, 11:30",
    patient: {
      id: "p5",
      name: "Pierre Bernard",
      address: "14 boulevard Haussmann, 75008 Paris",
      care: "Perfusion"
    }
  }
];

const Index = () => {
  const [selectedTab, setSelectedTab] = useState("today");

  return (
    <div className="animate-fade-in">
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="today" className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Aujourd'hui</span>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>À venir</span>
                </TabsTrigger>
              </TabsList>
              
              <Button asChild>
                <a href="/calendar">Voir planning</a>
              </Button>
            </div>
            
            <TabsContent value="today">
              <AppointmentList 
                title="Rendez-vous d'aujourd'hui" 
                appointments={todayAppointments} 
              />
            </TabsContent>
            
            <TabsContent value="upcoming">
              <AppointmentList 
                title="Prochains rendez-vous" 
                appointments={upcomingAppointments} 
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <a href="/patients">
                <Users className="mr-2 h-4 w-4" /> Liste des patients
              </a>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/calendar">
                <Calendar className="mr-2 h-4 w-4" /> Gérer le planning
              </a>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/admin">
                <FileText className="mr-2 h-4 w-4" /> Facturation
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
