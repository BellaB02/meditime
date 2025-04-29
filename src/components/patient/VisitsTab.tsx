
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { DocumentService } from "@/services/DocumentService";
import { PatientInfo } from "@/services/PatientService";
import { AddVisitDialog } from "./dialogs/AddVisitDialog";

export interface Visit {
  id: string;
  date: string;
  time: string;
  care: string;
  notes: string;
}

type VisitsTabProps = {
  visits: Visit[];
  patientInfo: PatientInfo;
};

const VisitsTab: React.FC<VisitsTabProps> = ({ visits, patientInfo }) => {
  const [isAddVisitDialogOpen, setIsAddVisitDialogOpen] = useState(false);
  
  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Visite ajoutée avec succès");
    setIsAddVisitDialogOpen(false);
  };
  
  const handleMarkVisitComplete = (visit: Visit) => {
    toast.success(`Soin "${visit.care}" marqué comme terminé`);
    
    // Générer une feuille de soins
    if (patientInfo) {
      DocumentService.generateCareSheet("care-" + Date.now(), `${patientInfo.firstName} ${patientInfo.name}`);
    }
  };
  
  const handleMarkVisitCanceled = (visit: Visit) => {
    toast.info(`Soin "${visit.care}" marqué comme annulé`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Historique des visites</CardTitle>
        <AddVisitDialog 
          isOpen={isAddVisitDialogOpen} 
          onOpenChange={setIsAddVisitDialogOpen}
          patientName={patientInfo.name}
          onAddVisit={handleAddVisit}
        />
      </CardHeader>
      <CardContent>
        {visits.length > 0 ? (
          <div className="space-y-4">
            {visits.map((visit, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-3">
                    <div className="bg-accent p-2 rounded-full">
                      <Calendar size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{visit.date}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={14} />
                        <span>{visit.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {visit.care}
                  </div>
                </div>
                <div className="mt-2 bg-accent/50 p-3 rounded-md">
                  <p className="text-sm">{visit.notes}</p>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleMarkVisitComplete(visit)}
                  >
                    Marquer comme fait
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => handleMarkVisitCanceled(visit)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucune visite enregistrée pour ce patient
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisitsTab;
