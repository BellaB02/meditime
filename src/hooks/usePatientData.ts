
import { useState, useEffect } from "react";
import { PatientInfo, PatientService, VitalSign, Prescription } from "@/services/PatientService";
import { Visit } from "@/components/patient/VisitsTab";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormValues } from "@/components/patient/PatientInfo";
import { toast } from "sonner";

export const usePatientData = (patientId?: string) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isEditModeDialogOpen, setIsEditModeDialogOpen] = useState(false);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalNotes, setMedicalNotes] = useState("");
  
  // Sample data for visits
  const [visits, setVisits] = useState<Visit[]>([
    {
      id: "v1",
      date: "21/05/2025",
      time: "09:30",
      care: "Pansement",
      notes: "Changement de pansement suite à une plaie au niveau du pied droit"
    },
    {
      id: "v2",
      date: "23/05/2025",
      time: "14:00",
      care: "Injection",
      notes: "Administration d'insuline suite à un changement de traitement"
    }
  ]);
  
  // Configuration du formulaire
  const patientForm = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      firstName: "",
      phone: "",
      email: "",
      address: "",
      birthdate: "",
      insurance: "",
      doctor: "",
      notes: ""
    },
  });
  
  // Fetch patient data
  useEffect(() => {
    if (patientId) {
      const patient = PatientService.getPatientInfo(patientId);
      if (patient) {
        setPatientInfo(patient);
        setMedicalNotes(patient.medicalNotes || "");
        setVitalSigns(PatientService.getVitalSigns(patientId));
        setPrescriptions(PatientService.getPrescriptions(patientId));
      }
    }
  }, [patientId]);
  
  // Update form values when patient info changes
  useEffect(() => {
    if (patientInfo) {
      patientForm.reset({
        name: patientInfo.name,
        firstName: patientInfo.firstName || "",
        phone: patientInfo.phoneNumber || "",
        email: patientInfo.email || "",
        address: patientInfo.address || "",
        birthdate: patientInfo.dateOfBirth || "",
        insurance: patientInfo.insurance || "",
        doctor: patientInfo.doctor || "",
        notes: patientInfo.medicalNotes || ""
      });
    }
  }, [patientInfo]);
  
  const handleCallPatient = () => {
    if (patientInfo?.phoneNumber) {
      window.location.href = `tel:${patientInfo.phoneNumber.replace(/\s/g, '')}`;
      toast.info(`Appel vers ${patientInfo.firstName} ${patientInfo.name}`);
    }
  };
  
  const handleNavigateToAddress = () => {
    if (patientInfo?.address) {
      const encodedAddress = encodeURIComponent(patientInfo.address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
      toast.info(`Navigation vers : ${patientInfo.address}`);
    }
  };
  
  const handleSavePatientInfo = (data: PatientFormValues) => {
    if (patientId && patientInfo) {
      // Mise à jour des informations patient (simulation)
      const updatedPatient: PatientInfo = {
        ...patientInfo,
        name: data.name,
        firstName: data.firstName,
        phoneNumber: data.phone,
        email: data.email,
        address: data.address,
        dateOfBirth: data.birthdate,
        insurance: data.insurance,
        doctor: data.doctor,
        medicalNotes: data.notes
      };
      
      setPatientInfo(updatedPatient);
      setMedicalNotes(data.notes || "");
      setIsEditingPatient(false);
      toast.success("Informations patient mises à jour avec succès");
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditingPatient(false);
    if (patientInfo) {
      patientForm.reset({
        name: patientInfo.name,
        firstName: patientInfo.firstName || "",
        phone: patientInfo.phoneNumber || "",
        email: patientInfo.email || "",
        address: patientInfo.address || "",
        birthdate: patientInfo.dateOfBirth || "",
        insurance: patientInfo.insurance || "",
        doctor: patientInfo.doctor || ""
      });
    }
  };

  return {
    patientInfo,
    isEditingPatient,
    setIsEditingPatient,
    isEditModeDialogOpen,
    setIsEditModeDialogOpen,
    vitalSigns,
    prescriptions,
    medicalNotes,
    visits,
    patientForm,
    handleCallPatient,
    handleNavigateToAddress,
    handleSavePatientInfo,
    handleCancelEdit
  };
};
