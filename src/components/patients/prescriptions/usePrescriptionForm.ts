
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PrescriptionInfo } from "@/services/PDFTypes";
import { PrescriptionsService } from "@/services/PrescriptionsService";
import { PrescriptionFormValues, prescriptionFormSchema } from "./PrescriptionFormSchema";

export const usePrescriptionForm = (patientId: string, onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Obtenir la date du jour au format dd/mm/yyyy
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      title: "",
      doctor: "",
      date: getCurrentDate(),
      name: "",
      dosage: "",
      frequency: ""
    },
  });

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  // Gestion de la soumission du formulaire
  const onSubmit = (data: PrescriptionFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Dans une véritable application, nous téléverserions le fichier vers un serveur
      // et obtiendrions une URL de fichier
      const fileUrl = URL.createObjectURL(data.file);
      
      // Créer une nouvelle ordonnance
      const newPrescription: PrescriptionInfo = {
        id: '', // This will be assigned by the service
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.date,
        title: data.title,
        doctor: data.doctor,
        date: data.date,
        file: fileUrl,
      };
      
      // Ajouter l'ordonnance au service
      const prescriptionId = PrescriptionsService.addPrescription(patientId, newPrescription);
      
      // Réinitialiser le formulaire et afficher un message de succès
      form.reset({
        title: "",
        doctor: "",
        date: getCurrentDate(),
        name: "",
        dosage: "",
        frequency: ""
      });
      setSelectedFile(null);
      
      toast.success("Ordonnance ajoutée avec succès");
      
      // Appeler le callback de succès
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ordonnance:", error);
      toast.error("Une erreur s'est produite lors de l'ajout de l'ordonnance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    selectedFile,
    handleFileChange,
    onSubmit
  };
};
