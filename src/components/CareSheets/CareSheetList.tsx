
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Document } from "@/services/DocumentService";
import { PDFGenerationService } from "@/services/PDFGenerationService";
import { toast } from "sonner";

interface CareSheetListProps {
  careSheets: Document[];
}

export const CareSheetList: React.FC<CareSheetListProps> = ({ careSheets }) => {
  const handleDownload = async (careSheet: Document) => {
    try {
      // Préparer les informations de soin
      const careInfo = {
        type: careSheet.careInfo?.type || "",
        date: careSheet.careInfo?.date || format(new Date(), "dd/MM/yyyy"),
        time: format(new Date(), "HH:mm"),
        code: careSheet.careInfo?.code || "",
        description: careSheet.careInfo?.description || ""
      };

      // Générer le PDF (maintenant avec await car la fonction est asynchrone)
      const doc = await PDFGenerationService.generatePrefilledPDF(careSheet.patientId, careInfo);
      
      if (doc) {
        // Télécharger le PDF
        PDFGenerationService.savePDF(doc, careSheet.patientId || "patient");
        toast.success("Feuille de soins téléchargée avec succès");
      } else {
        toast.error("Erreur lors de la génération de la feuille de soins");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        {careSheets.length > 0 ? (
          <div className="divide-y">
            {careSheets.map((sheet) => (
              <div key={sheet.id} className="p-4 flex justify-between items-center hover:bg-accent/50">
                <div>
                  <div className="font-medium">{sheet.name}</div>
                  <div className="text-sm text-muted-foreground">
                    <div>Patient: {sheet.patientName}</div>
                    <div>Date: {sheet.date}</div>
                    <div>Type de soin: {sheet.careInfo?.type} ({sheet.careInfo?.code})</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDownload(sheet)}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="mx-auto h-8 w-8 mb-2" />
            <p>Aucune feuille de soins disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
