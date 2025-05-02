
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { PrescriptionsService } from "@/services/PrescriptionsService";
import { prescriptionFormSchema, PrescriptionFormValues } from "./PrescriptionFormSchema";

export const usePrescriptionForm = (patientId: string, onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      title: "",
      doctor: "",
      date: "",
      name: "",
      dosage: "",
      frequency: "",
    },
  });
  
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      form.setValue("file", file);
    } else {
      form.resetField("file");
    }
  };
  
  const onSubmit = async (data: PrescriptionFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare the prescription data
      const prescriptionData = {
        title: data.title,
        doctor: data.doctor,
        date: data.date,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.date,
        file: data.file ? URL.createObjectURL(data.file) : undefined
      };
      
      // Add the prescription
      const result = PrescriptionsService.addPrescription(patientId, prescriptionData);
      
      if (result.success) {
        form.reset();
        setSelectedFile(null);
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
      toast.error("Erreur lors de l'ajout de l'ordonnance");
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
