
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateFormatService } from "@/services/DateFormatService";
import { UserWelcome } from "./UserWelcome";
import { Check, Clock } from "lucide-react";

interface DailySummaryProps {
  appointmentsCount: number;
  completedAppointmentsCount: number;
  nextAppointment?: {
    time: string;
    patientName: string;
  };
}

export const DailySummary = ({ 
  appointmentsCount, 
  completedAppointmentsCount,
  nextAppointment 
}: DailySummaryProps) => {
  // Current date in French format
  const currentDate = DateFormatService.formatCurrentDate();
  
  // Percentage of completed appointments
  const completionPercentage = appointmentsCount > 0 
    ? Math.round((completedAppointmentsCount / appointmentsCount) * 100)
    : 0;
  
  return (
    <div className="space-y-6">
      <UserWelcome />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Résumé de la journée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted-foreground">{currentDate}</p>
                <h3 className="text-2xl font-bold">{appointmentsCount} rendez-vous</h3>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Terminés</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">{completedAppointmentsCount}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
            </div>
            
            {nextAppointment && (
              <div className="bg-accent/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Prochain rendez-vous</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{nextAppointment.patientName}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {nextAppointment.time}
                  </span>
                </div>
              </div>
            )}
            
            <div className="bg-primary/10 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {appointmentsCount - completedAppointmentsCount} rendez-vous restants aujourd'hui
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
