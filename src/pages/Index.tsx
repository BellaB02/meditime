
import { StatsCards } from "@/components/Dashboard/StatsCards";
import { AppointmentList } from "@/components/Dashboard/AppointmentList";
import { DailyCareProgress } from "@/components/Dashboard/DailyCareProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Users } from "lucide-react";

export default function Index() {
  return (
    <div className="space-y-6">
      <StatsCards />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AppointmentList />
        </div>
        <div className="space-y-6">
          <DailyCareProgress completed={3} total={7} />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Rendez-vous à venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-md border bg-accent/10">
                  <div className="font-medium">Jean Dupont</div>
                  <div className="text-sm text-muted-foreground">Demain, 10:00</div>
                  <div className="text-sm mt-1">Pansement</div>
                </div>
                <div className="p-3 rounded-md border bg-accent/10">
                  <div className="font-medium">Marie Martin</div>
                  <div className="text-sm text-muted-foreground">Demain, 11:30</div>
                  <div className="text-sm mt-1">Injection insuline</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Feuille de soins générée</div>
                  <div className="text-xs text-muted-foreground">Il y a 35 minutes</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Facture envoyée</div>
                  <div className="text-xs text-muted-foreground">Il y a 2 heures</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Nouveau patient ajouté</div>
                  <div className="text-xs text-muted-foreground">Il y a 4 heures</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
