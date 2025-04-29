import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, PlusCircle, Scan } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { OCRResult } from "@/services/OCRService";
import PrescriptionScanner from "./prescription-scanner/PrescriptionScanner";

interface Prescription {
  id: string;
  title: string;
  date: string;
  doctor: string;
  file?: string;
}

interface PrescriptionsTabProps {
  prescriptions: Prescription[];
  patientName: string;
}

const PrescriptionsTabWithOCR: React.FC<PrescriptionsTabProps> = ({
  prescriptions,
  patientName
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentPrescriptions, setCurrentPrescriptions] = useState<Prescription[]>(prescriptions);
  
  // Function to add a new prescription from OCR result
  const handleScanComplete = (result: OCRResult) => {
    // Create a new prescription from the OCR result
    const newPrescription: Prescription = {
      id: `pre-${Date.now()}`,
      title: "Ordonnance scannée",
      date: new Date().toLocaleDateString('fr-FR'),
      doctor: result.medicationData?.medications.length ? 
        `Médicaments détectés: ${result.medicationData.medications.length}` : 
        "Scan d'ordonnance",
      // In a real application, we would store the OCR result in a database
      // and generate a PDF with the extracted text
    };
    
    setCurrentPrescriptions([...currentPrescriptions, newPrescription]);
    setIsScannerOpen(false);
    toast.success("Ordonnance ajoutée avec succès");
  };
  
  const handleDownload = (file?: string) => {
    if (!file) {
      toast.error("Fichier non disponible");
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = file;
      link.setAttribute('download', `ordonnance_${patientName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Téléchargement de l'ordonnance");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du document");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Ordonnances</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsScannerOpen(true)}
          >
            <Scan className="mr-2 h-4 w-4" />
            Scanner une ordonnance
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ordonnances actives</CardTitle>
        </CardHeader>
        <CardContent>
          {currentPrescriptions.length > 0 ? (
            <div className="space-y-4">
              {currentPrescriptions.map((prescription) => (
                <div key={prescription.id} className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{prescription.title}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div>Date: {prescription.date}</div>
                      <div>Prescripteur: {prescription.doctor}</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownload(prescription.file)}
                    disabled={!prescription.file}
                  >
                    <Download size={16} className="mr-2" />
                    Télécharger
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p>Aucune ordonnance enregistrée</p>
              <p className="text-sm">Ajoutez une ordonnance pour ce patient</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog for prescription scanner */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <PrescriptionScanner 
            onScanComplete={handleScanComplete}
            onCancel={() => setIsScannerOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog for manual prescription upload */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Ajouter une ordonnance</h2>
            <p className="text-sm text-muted-foreground">
              Téléversez une ordonnance au format PDF ou image
            </p>
            <div className="border-2 border-dashed rounded-md p-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Glissez-déposez un fichier ou cliquez pour parcourir
              </p>
              <Button variant="outline">Sélectionner un fichier</Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button>Téléverser</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrescriptionsTabWithOCR;
