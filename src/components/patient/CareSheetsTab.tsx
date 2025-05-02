
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer } from "lucide-react";
import { DocumentService } from "@/services/DocumentService";
import { toast } from "sonner";

interface CareSheetsTabProps {
  patientId: string;
}

const CareSheetsTab: React.FC<CareSheetsTabProps> = ({ patientId }) => {
  const careSheets = [
    {
      id: "cs-1",
      date: "15/04/2025",
      title: "Feuille de soins - Prise de sang",
      careType: "Prise de sang"
    },
    {
      id: "cs-2",
      date: "10/04/2025",
      title: "Feuille de soins - Injection",
      careType: "Injection"
    }
  ];
  
  const handleDownload = async (sheetId: string) => {
    try {
      await DocumentService.downloadDocument('feuille_de_soins', patientId, {
        type: "Soin courant",
        date: new Date().toLocaleDateString('fr-FR')
      }, true);
      
      toast.success("Téléchargement de la feuille de soins");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement");
    }
  };
  
  const handlePrint = async (sheetId: string) => {
    try {
      await DocumentService.printDocument('feuille_de_soins', patientId, {
        type: "Soin courant",
        date: new Date().toLocaleDateString('fr-FR')
      }, true);
      
      toast.success("Impression de la feuille de soins");
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast.error("Erreur lors de l'impression");
    }
  };
  
  const generateCareSheet = () => {
    // Simuler la génération d'une nouvelle feuille de soins
    toast.success("Nouvelle feuille de soins générée");
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Feuilles de soins</CardTitle>
        <Button size="sm" onClick={generateCareSheet}>
          <FileText className="mr-2 h-4 w-4" />
          Nouvelle feuille de soins
        </Button>
      </CardHeader>
      <CardContent>
        {careSheets.length > 0 ? (
          <div className="space-y-4">
            {careSheets.map((sheet) => (
              <div key={sheet.id} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">{sheet.title}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    <div>Date: {sheet.date}</div>
                    <div>Type: {sheet.careType}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(sheet.id)}>
                    <Download size={16} className="mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePrint(sheet.id)}>
                    <Printer size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucune feuille de soins enregistrée
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareSheetsTab;
