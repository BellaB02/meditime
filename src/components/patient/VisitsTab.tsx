
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Check, X, RotateCcw, FileText } from "lucide-react";
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
  status?: 'pending' | 'completed' | 'cancelled';
}

type VisitsTabProps = {
  visits: Visit[];
  patientInfo: PatientInfo;
};

const VisitsTab: React.FC<VisitsTabProps> = ({ visits, patientInfo }) => {
  const [isAddVisitDialogOpen, setIsAddVisitDialogOpen] = useState(false);
  const [visitsList, setVisitsList] = useState<Visit[]>(
    visits.map(visit => ({
      ...visit,
      status: visit.status || 'pending'
    }))
  );
  
  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Visite ajoutée avec succès");
    setIsAddVisitDialogOpen(false);
  };
  
  const handleUpdateVisitStatus = (visit: Visit, newStatus: 'pending' | 'completed' | 'cancelled') => {
    setVisitsList(prevVisits => 
      prevVisits.map(v => 
        v.id === visit.id 
          ? { ...v, status: newStatus } 
          : v
      )
    );
    
    const statusText = 
      newStatus === 'completed' ? "terminé" : 
      newStatus === 'cancelled' ? "annulé" :
      "remis en cours";
    
    toast.success(`Soin "${visit.care}" marqué comme ${statusText}`);
    
    // Générer une feuille de soins uniquement si le soin est marqué comme terminé
    if (newStatus === 'completed' && patientInfo) {
      DocumentService.generateCareSheet("care-" + Date.now(), `${patientInfo.firstName} ${patientInfo.name}`, patientInfo.id);
    }
  };

  const handleDownloadCareSheet = (visit: Visit) => {
    if (patientInfo) {
      DocumentService.downloadDocument('careSheet', patientInfo.id, {
        type: visit.care,
        date: visit.date
      }, true);
      toast.success(`Feuille de soins téléchargée pour ${patientInfo.firstName} ${patientInfo.name}`);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Historique des visites</CardTitle>
        <AddVisitDialog 
          isOpen={isAddVisitDialogOpen} 
          onOpenChange={setIsAddVisitDialogOpen}
          patientName={patientInfo.name}
          patientId={patientInfo.id}
          onAddVisit={handleAddVisit}
        />
      </CardHeader>
      <CardContent>
        {visitsList.length > 0 ? (
          <div className="space-y-4">
            {visitsList.map((visit, index) => (
              <div 
                key={visit.id || index} 
                className={`border rounded-md p-4 ${
                  visit.status === 'completed' 
                    ? 'border-green-200 bg-green-50/50' 
                    : visit.status === 'cancelled' 
                    ? 'border-red-200 bg-red-50/50' 
                    : ''
                }`}
              >
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
                  <div 
                    className={`px-3 py-1 rounded-full text-sm ${
                      visit.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : visit.status === 'cancelled' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {visit.status === 'completed' 
                      ? 'Terminé' 
                      : visit.status === 'cancelled' 
                      ? 'Annulé' 
                      : visit.care}
                  </div>
                </div>
                <div className="mt-2 bg-accent/50 p-3 rounded-md">
                  <p className="text-sm">{visit.notes}</p>
                </div>
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  {visit.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateVisitStatus(visit, 'completed')}
                      >
                        <Check className="mr-2 h-3 w-3" />
                        Marquer comme fait
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => handleUpdateVisitStatus(visit, 'cancelled')}
                      >
                        <X className="mr-2 h-3 w-3" />
                        Annuler
                      </Button>
                    </>
                  )}
                  
                  {visit.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadCareSheet(visit)}
                    >
                      <FileText className="mr-2 h-3 w-3" />
                      Feuille de soins
                    </Button>
                  )}
                  
                  {(visit.status === 'completed' || visit.status === 'cancelled') && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateVisitStatus(visit, 'pending')}
                    >
                      <RotateCcw className="mr-2 h-3 w-3" />
                      Remettre en cours
                    </Button>
                  )}
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
