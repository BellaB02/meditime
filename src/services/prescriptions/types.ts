
import { PrescriptionInfo } from "@/services/PDFTypes";

// Type for storing prescriptions by patient ID
export type PrescriptionsByPatient = Record<string, PrescriptionInfo[]>;

// Type for prescription service response
export interface PrescriptionServiceResponse {
  success: boolean;
  id?: string;
  message?: string;
}
