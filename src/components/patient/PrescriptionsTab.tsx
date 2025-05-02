
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AddPrescriptionDialog } from "./dialogs/AddPrescriptionDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PrescriptionInfo } from "@/services/PDFTypes";

type PrescriptionsTabProps = {
  prescriptions: PrescriptionInfo[];
  patientName: string;
};

const PrescriptionsTab: React.FC<PrescriptionsTabProps> = ({ prescriptions: initialPrescriptions, patientName }) => {
  const [isAddPrescriptionDialogOpen, setIsAddPrescriptionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<PrescriptionInfo | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionInfo[]>(initialPrescriptions);
  
  const handleUploadPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simuler l'ajout d'une nouvelle prescription
    const newPrescription: PrescriptionInfo = {
      id: `pre-${Date.now()}`,
      name: "Nouveau médicament",
      dosage: "100mg",
      frequency: "1 fois par jour",
      startDate: new Date().toLocaleDateString('fr-FR'),
      title: "Nouvelle ordonnance",
      date: new Date().toLocaleDateString('fr-FR'),
      doctor: "Dr. Martin",
      file: "/documents/aide_memoire_cotation_ngap.pdf" // Utiliser un fichier existant pour simuler
    };
    
    setPrescriptions([newPrescription, ...prescriptions]);
    toast.success("Ordonnance ajoutée avec succès");
    setIsAddPrescriptionDialogOpen(false);
  };
  
  const handleDeletePrescription = (prescription: PrescriptionInfo) => {
    setPrescriptionToDelete(prescription);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeletePrescription = () => {
    if (prescriptionToDelete) {
      setPrescriptions(prescriptions.filter(p => p.id !== prescriptionToDelete.id));
      toast.success("Ordonnance supprimée avec succès");
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleDownload = (prescription: PrescriptionInfo) => {
    try {
      // Créer un lien pour télécharger le fichier PDF
      const link = document.createElement('a');
      
      // Utiliser le fichier existant ou une alternative
      const fileUrl = prescription.file || '/documents/aide_memoire_cotation_ngap.pdf';
      link.href = fileUrl;
      
      // Définir un nom de fichier basé sur le titre de la prescription
      const title = prescription.title || prescription.name;
      const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}.pdf`;
      link.setAttribute('download', fileName);
      
      // Ajouter le lien au document, cliquer dessus, puis le supprimer
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Téléchargement de l'ordonnance: ${title}`);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement de l'ordonnance");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Ordonnances</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsAddPrescriptionDialogOpen(true)}>
          <Upload size={16} className="mr-2" />
          Ajouter une ordonnance
        </Button>
        <AddPrescriptionDialog
          isOpen={isAddPrescriptionDialogOpen}
          onOpenChange={setIsAddPrescriptionDialogOpen}
          onUploadPrescription={handleUploadPrescription}
        />
      </CardHeader>
      <CardContent>
        {prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">{prescription.title || prescription.name}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    <div>Date: {prescription.date || prescription.startDate}</div>
                    <div>Médecin: {prescription.doctor}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(prescription)}>
                    <Download size={16} className="mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleDeletePrescription(prescription)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucune ordonnance enregistrée pour ce patient
          </div>
        )}
      </CardContent>
      
      {/* Dialog de confirmation pour la suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'ordonnance</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette ordonnance ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDeletePrescription}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PrescriptionsTab;
