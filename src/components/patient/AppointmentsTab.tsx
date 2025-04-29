
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppointmentsTabProps {
  patientId: string;
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ patientId }) => {
  const appointments = [
    {
      id: "apt-1",
      date: "15/04/2025",
      time: "10:00",
      careType: "Prise de sang",
      status: "completed"
    },
    {
      id: "apt-2",
      date: "20/04/2025",
      time: "14:30",
      careType: "Injection",
      status: "scheduled"
    }
  ];
  
  const handleAddAppointment = () => {
    // Simuler l'ajout d'un rendez-vous
    console.log("Ajouter un rendez-vous pour le patient:", patientId);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500"><Check size={12} className="mr-1" /> Terminé</Badge>;
      case "scheduled":
        return <Badge variant="outline"><Clock size={12} className="mr-1" /> Planifié</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Rendez-vous</CardTitle>
        <Button size="sm" onClick={handleAddAppointment}>
          <Calendar className="mr-2 h-4 w-4" />
          Ajouter un rendez-vous
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{appointment.date} - {appointment.time}</h3>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <div>Type de soin: {appointment.careType}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucun rendez-vous enregistré
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsTab;
