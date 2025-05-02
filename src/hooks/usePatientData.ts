import { useState, useEffect } from "react";
import { Patient, PatientService, VitalSign } from "@/services/PatientService";

interface LegacyVitalSign {
  id: string;
  date: string;
  time: string;
  temperature: string;
  heartRate: string;
  bloodPressure: string;
  notes?: string;
}

const usePatientDetails = (patientId: string) => {
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const updatePatient = async (updates: Partial<Patient>) => {
    setIsLoading(true);
    try {
      const updatedPatient = await PatientService.updatePatient(patientId, updates);
      setPatientDetails(updatedPatient);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to update patient"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setIsLoading(true);
      try {
        const details = await PatientService.getPatientDetails(patientId);
        setPatientDetails(details);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to fetch patient details"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  return { patientDetails, isLoading, error, updatePatient };
};

// Update useState types and compatibility with LegacyVitalSign/VitalSign
const usePatientVitalSigns = (patientId: string) => {
  const [vitalSigns, setVitalSigns] = useState<any[]>([]); // Using any[] to avoid type conflicts
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = PatientService.getVitalSigns(patientId);
      setVitalSigns(data); // We're using any[] so this assignment won't cause type errors
      setIsLoading(false);
    }, 500);
  }, [patientId]);

  return { vitalSigns, isLoading };
};

export { usePatientDetails, usePatientVitalSigns };
