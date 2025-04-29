
import { useState, useEffect } from "react";
import { PatientInfo, PatientService, VitalSign, Prescription } from "@/services/PatientService";
import { Visit } from "@/components/patient/VisitsTab";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormValues } from "@/components/patient/PatientInfo";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { usePatientsService } from "@/hooks/usePatientsService";

export const usePatientData = (patientId?: string) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isEditModeDialogOpen, setIsEditModeDialogOpen] = useState(false);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalNotes, setMedicalNotes] = useState("");
  const { user } = useAuth();
  const { usePatient, usePatientVitalSigns, useUpdatePatient } = usePatientsService();
  
  const { data: supabasePatient, isLoading: isLoadingPatient } = usePatient(patientId || "");
  const { data: supabaseVitalSigns, isLoading: isLoadingVitalSigns } = usePatientVitalSigns(patientId || "");
  const updatePatientMutation = useUpdatePatient();
  
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
  
  // Fetch patient data - using both Supabase and legacy data for compatibility
  useEffect(() => {
    if (patientId) {
      // Fetch from legacy service for backward compatibility
      const patient = PatientService.getPatientInfo(patientId);
      if (patient) {
        setPatientInfo(patient);
        setMedicalNotes(patient.medicalNotes || "");
        setVitalSigns(PatientService.getVitalSigns(patientId));
        setPrescriptions(PatientService.getPrescriptions(patientId));
      }
    }
  }, [patientId]);
  
  // Update with Supabase data when available
  useEffect(() => {
    if (supabasePatient) {
      // Convert Supabase patient format to legacy format
      const patientData: PatientInfo = {
        id: supabasePatient.id,
        name: supabasePatient.last_name,
        firstName: supabasePatient.first_name,
        address: supabasePatient.address,
        phoneNumber: supabasePatient.phone,
        email: supabasePatient.email,
        dateOfBirth: supabasePatient.date_of_birth,
        doctor: supabasePatient.doctor,
        insurance: supabasePatient.insurance,
        medicalNotes: supabasePatient.medical_notes,
        status: supabasePatient.status as "active" | "inactive" | "urgent",
        socialSecurityNumber: supabasePatient.social_security_number
      };
      
      setPatientInfo(patientData);
      setMedicalNotes(patientData.medicalNotes || "");
    }
  }, [supabasePatient]);
  
  // Update vital signs from Supabase
  useEffect(() => {
    if (supabaseVitalSigns && supabaseVitalSigns.length > 0) {
      // Convert Supabase vital signs to legacy format
      const convertedVitalSigns: VitalSign[] = supabaseVitalSigns.map(sign => ({
        date: new Date(sign.recorded_at).toLocaleDateString('fr-FR'),
        temperature: `${sign.temperature}°C`,
        heartRate: `${sign.heart_rate} bpm`,
        bloodPressure: sign.blood_pressure,
        notes: sign.notes || ""
      }));
      
      setVitalSigns(convertedVitalSigns);
    }
  }, [supabaseVitalSigns]);
  
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
  
  const handleSavePatientInfo = async (data: PatientFormValues) => {
    if (patientId && patientInfo) {
      // Mise à jour des informations patient dans Supabase
      try {
        await updatePatientMutation.mutateAsync({
          patientId,
          data: {
            last_name: data.name,
            first_name: data.firstName,
            phone: data.phone,
            email: data.email,
            address: data.address,
            date_of_birth: data.birthdate,
            insurance: data.insurance,
            doctor: data.doctor,
            medical_notes: data.notes
          }
        });
        
        // Mise à jour du state local
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
      } catch (error) {
        console.error("Error updating patient:", error);
        toast.error("Erreur lors de la mise à jour des informations patient");
      }
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
        doctor: patientInfo.doctor || "",
        notes: patientInfo.medicalNotes || ""
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
    isLoading: isLoadingPatient || isLoadingVitalSigns,
    handleCallPatient,
    handleNavigateToAddress,
    handleSavePatientInfo,
    handleCancelEdit
  };
};
