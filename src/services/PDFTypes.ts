
export interface CareInfo {
  type: string;
  date: string;
  time: string;
  code?: string;
  description?: string;
}

export interface PrescriptionInfo {
  id: string;
  title: string;
  date: string;
  doctor: string;
  file?: string;
  content?: string;
}

export interface InvoiceInfo {
  id: string;
  date: string;
  amount: number;
  details: {
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
}
