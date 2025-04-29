
import { toast } from "sonner";
import Tesseract from "tesseract.js";

export interface OCRResult {
  text: string;
  confidence: number;
  wordConfidences: number[];
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  medicationData?: {
    medications: string[];
    potentialDosages: string[];
  };
}

export const OCRService = {
  /**
   * Perform OCR on an image of a prescription
   */
  scanPrescription: async (file: File): Promise<OCRResult> => {
    try {
      toast.info("Analyse de l'ordonnance en cours...", { duration: 3000 });
      
      // Use Tesseract.js for OCR
      const result = await Tesseract.recognize(
        file,
        'fra', // French language
        {
          logger: (info) => {
            if (info.status === 'recognizing text') {
              // Update progress toast
              toast.info(`Analyse en cours: ${Math.floor(info.progress * 100)}%`, { id: 'ocr-progress' });
            }
          }
        }
      );

      // Extract medications and dosages using regex patterns
      const medicationRegex = /(\b[A-Z][a-zA-Z]*([ -][A-Z][a-zA-Z]*)*\b)\s+(\d+(\.\d+)?)\s*(mg|ml|g|mcg|μg)/gi;
      const dosageRegex = /(\d+(\.\d+)?)\s*(mg|ml|g|mcg|μg|cp|comprimés?|gélules?|sachets?|ampoules?)/gi;
      
      const medications: string[] = [];
      const potentialDosages: string[] = [];
      
      // Extract medications
      let match;
      while ((match = medicationRegex.exec(result.data.text)) !== null) {
        medications.push(match[0]);
      }
      
      // Extract potential dosages
      while ((match = dosageRegex.exec(result.data.text)) !== null) {
        potentialDosages.push(match[0]);
      }

      // Create the result object with proper typing
      const ocrResult: OCRResult = {
        text: result.data.text,
        confidence: result.data.confidence,
        wordConfidences: result.data.words.map(w => w.confidence),
        bbox: {
          // Correctly extract bounding box coordinates
          // Handle the case where box might be missing or have different structure
          x0: typeof result.data.box === 'object' ? (result.data.box.x0 || 0) : 0,
          y0: typeof result.data.box === 'object' ? (result.data.box.y0 || 0) : 0,
          x1: typeof result.data.box === 'object' ? (result.data.box.x1 || 0) : 0,
          y1: typeof result.data.box === 'object' ? (result.data.box.y1 || 0) : 0
        },
        medicationData: {
          medications,
          potentialDosages
        }
      };
      
      toast.success("Analyse terminée", { id: 'ocr-progress' });
      return ocrResult;
    } catch (error) {
      console.error("OCR scanning error:", error);
      toast.error("Erreur lors de l'analyse de l'ordonnance");
      throw error;
    }
  },
  
  /**
   * Extract structured data from OCR text
   */
  extractMedicationData: (ocrText: string): { medications: string[], potentialDosages: string[] } => {
    // More sophisticated extraction logic could be implemented here
    // This is a simplified version
    const medicationRegex = /(\b[A-Z][a-zA-Z]*([ -][A-Z][a-zA-Z]*)*\b)\s+(\d+(\.\d+)?)\s*(mg|ml|g|mcg|μg)/gi;
    const dosageRegex = /(\d+(\.\d+)?)\s*(mg|ml|g|mcg|μg|cp|comprimés?|gélules?|sachets?|ampoules?)/gi;
    
    const medications: string[] = [];
    const potentialDosages: string[] = [];
    
    let match;
    while ((match = medicationRegex.exec(ocrText)) !== null) {
      medications.push(match[0]);
    }
    
    while ((match = dosageRegex.exec(ocrText)) !== null) {
      potentialDosages.push(match[0]);
    }
    
    return { medications, potentialDosages };
  }
};
