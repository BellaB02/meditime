
export interface CareInfo {
  type: string;
  date: string;
  time: string;
  code?: string;
  description?: string;
}

export interface PrescriptionInfo {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  doctor: string;
  notes?: string;
  scan?: string;
}

export interface InvoiceInfo {
  id: string;
  invoiceNumber?: string;
  date: string;
  patient?: {
    name?: string;
    firstName?: string;
    address?: string;
  };
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  patientId?: string;
  patientDetails?: {
    first_name?: string;
    last_name?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    social_security_number?: string;
    insurance?: string;
    phone?: string;
    email?: string;
    doctor?: string;
  };
  paid?: boolean;
  totalAmount?: number;
  majorations?: any[];
  careCode?: string;
  details: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  amount: number;
}
