
import { PatientInfo } from './PatientInfoService';
import { VitalSign } from './VitalSignsService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Define adapter function to convert DB vital signs to our app structure
const adaptVitalSigns = (dbVitalSigns: any[]): VitalSign[] => {
  return dbVitalSigns.map(vs => ({
    date: vs.recorded_at ? format(new Date(vs.recorded_at), 'dd/MM/yyyy HH:mm', { locale: fr }) : '',
    temperature: vs.temperature ? `${vs.temperature}°C` : '',
    heartRate: vs.heart_rate ? `${vs.heart_rate} bpm` : '',
    bloodPressure: vs.blood_pressure || '',
    notes: vs.notes || ''
  }));
};

export const ExportService = {
  /**
   * Exporte les données patient au format CSV
   */
  exportPatientToCSV: (patient: PatientInfo, vitalSigns: VitalSign[] = []): string => {
    let csvContent = "";
    
    // Informations patient
    csvContent += `Fiche patient\n`;
    csvContent += `ID,${patient.id}\n`;
    csvContent += `Nom,${patient.name || ''}\n`;
    csvContent += `Prénom,${patient.firstName || ''}\n`;
    csvContent += `Date de naissance,${patient.dateOfBirth || ''}\n`;
    csvContent += `Adresse,${patient.address || ''}\n`;
    csvContent += `Téléphone,${patient.phoneNumber || ''}\n`;
    csvContent += `Email,${patient.email || ''}\n`;
    csvContent += `Numéro de sécurité sociale,${patient.socialSecurityNumber || ''}\n`;
    csvContent += `Médecin traitant,${patient.doctor || ''}\n`;
    csvContent += `Notes médicales,${patient.medicalNotes || ''}\n`;
    csvContent += `Assurance,${patient.insurance || ''}\n\n`;
    
    // Signes vitaux
    if (vitalSigns.length > 0) {
      csvContent += `Signes vitaux\n`;
      csvContent += `Date,Température,Rythme cardiaque,Pression artérielle,Notes\n`;
      
      vitalSigns.forEach(vs => {
        csvContent += `${vs.date || ''},`;
        csvContent += `${vs.temperature || ''},`;
        csvContent += `${vs.heartRate || ''},`;
        csvContent += `${vs.bloodPressure || ''},`;
        csvContent += `${(vs.notes || '').replace(/,/g, ' ').replace(/\n/g, ' ')}\n`;
      });
    }
    
    return csvContent;
  },
  
  /**
   * Exporte les données patient au format JSON
   */
  exportPatientToJSON: (patient: PatientInfo, vitalSigns: VitalSign[] = []): string => {
    const data = {
      patient: patient,
      vitalSigns: vitalSigns,
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  },
  
  /**
   * Télécharge un fichier
   */
  downloadFile: (content: string, filename: string, mimeType: string): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  },
  
  /**
   * Exporte les données patient dans un fichier CSV
   */
  downloadPatientAsCSV: (patient: PatientInfo, dbVitalSigns: any[] = []): void => {
    const vitalSigns = adaptVitalSigns(dbVitalSigns);
    const csvContent = ExportService.exportPatientToCSV(patient, vitalSigns);
    const filename = `patient_${patient.id}_${new Date().getTime()}.csv`;
    
    ExportService.downloadFile(csvContent, filename, 'text/csv;charset=utf-8');
  },
  
  /**
   * Exporte les données patient dans un fichier JSON
   */
  downloadPatientAsJSON: (patient: PatientInfo, dbVitalSigns: any[] = []): void => {
    const vitalSigns = adaptVitalSigns(dbVitalSigns);
    const jsonContent = ExportService.exportPatientToJSON(patient, vitalSigns);
    const filename = `patient_${patient.id}_${new Date().getTime()}.json`;
    
    ExportService.downloadFile(jsonContent, filename, 'application/json');
  }
};
