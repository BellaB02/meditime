
import { toast } from "sonner";

export interface OCRResult {
  text: string;
  medicationData?: {
    doctor?: string;
    patient?: string;
    date?: string;
    medications: {
      name: string;
      dosage?: string;
      instructions?: string;
    }[];
  };
}

export const OCRService = {
  /**
   * Simule l'analyse OCR d'une ordonnance
   * Dans une application réelle, ceci appellerait une API comme Google Cloud Vision ou AWS Textract
   */
  scanPrescription: async (file: File): Promise<OCRResult> => {
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Dans une version réelle, nous enverrions le fichier à une API OCR
      // Pour la démo, nous simulons la réponse
      
      // Vérifier si le fichier est une image
      if (!file.type.startsWith('image/')) {
        toast.error("Le fichier doit être une image");
        throw new Error("Le fichier doit être une image");
      }
      
      console.log(`Traitement OCR simulé pour: ${file.name}`);
      
      // Texte simulé d'une ordonnance
      const extractedText = `Dr. Martin DUPONT
      Médecin généraliste
      12 rue de la Santé, 75014 Paris
      
      Patient: Jean DUBOIS
      Date: 15/04/2025
      
      ORDONNANCE
      
      - Doliprane 1000mg, 1 comprimé 3 fois par jour pendant 5 jours
      - Amoxicilline 500mg, 1 gélule matin et soir pendant 7 jours
      - Spasfon, 2 comprimés si douleurs abdominales
      
      Signature: Dr. Dupont`;
      
      // Extraction des données structurées
      const medicationData = OCRService.extractMedicationData(extractedText);
      
      return {
        text: extractedText,
        medicationData
      };
    } catch (error: any) {
      console.error("Erreur OCR:", error);
      toast.error(`Erreur lors de l'analyse de l'ordonnance: ${error.message || "Erreur inconnue"}`);
      throw error;
    }
  },
  
  /**
   * Extrait les informations structurées du texte OCR
   */
  extractMedicationData: (text: string) => {
    try {
      // Expressions régulières pour extraire les informations
      const doctorMatch = text.match(/Dr\.\s+([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
      const patientMatch = text.match(/Patient\s*:\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i);
      const dateMatch = text.match(/Date\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
      
      // Extraction des médicaments
      const medicationLines = text
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
      
      const medications = medicationLines.map(line => {
        // Nom du médicament (premier mot ou groupe avant la virgule ou les chiffres)
        const nameMatch = line.match(/([A-Za-zÀ-ÖØ-öø-ÿ\s]+)(?:\s+\d|,|$)/i);
        const name = nameMatch ? nameMatch[1].trim() : line.trim();
        
        // Dosage (chiffres suivis d'unités comme mg, g, ml)
        const dosageMatch = line.match(/(\d+\s*(?:mg|g|ml|µg|mcg))/i);
        const dosage = dosageMatch ? dosageMatch[1] : undefined;
        
        // Instructions (tout ce qui vient après le dosage)
        let instructions = line;
        if (nameMatch) instructions = instructions.replace(nameMatch[1], '');
        if (dosageMatch) instructions = instructions.replace(dosageMatch[1], '');
        instructions = instructions.replace(/^[,\s]+|[,\s]+$/g, '');
        
        return {
          name,
          dosage,
          instructions: instructions || undefined
        };
      });
      
      return {
        doctor: doctorMatch ? doctorMatch[1].trim() : undefined,
        patient: patientMatch ? patientMatch[1].trim() : undefined,
        date: dateMatch ? dateMatch[1] : undefined,
        medications
      };
    } catch (error) {
      console.error("Erreur lors de l'extraction des données:", error);
      return {
        medications: []
      };
    }
  }
};
