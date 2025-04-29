// Define the Document type if it doesn't exist already
export interface Document {
  id: string;
  patientId?: string;
  patientName?: string;
  name: string;
  date: string;
  type: string; // Add missing required 'type' property
  careInfo?: {
    type: string;
    code: string;
    description: string;
  };
}

// Simulation de données pour les documents
const documentsData: Record<string, Document[]> = {
  "p1": [
    {
      id: "cs1",
      patientId: "p1",
      patientName: "Jean Dupont",
      name: "Feuille de soins - Prise de sang",
      date: "15/04/2025",
      type: "careSheet",
      careInfo: {
        type: "Prise de sang",
        code: "AMI 1.5",
        description: "Prélèvement sanguin"
      }
    }
  ],
  "p2": [
    {
      id: "cs2",
      patientId: "p2",
      patientName: "Marie Martin",
      name: "Feuille de soins - Injection",
      date: "15/04/2025",
      type: "careSheet",
      careInfo: {
        type: "Injection",
        code: "AMI 1",
        description: "Injection sous-cutanée"
      }
    }
  ]
};

export const DocumentService = {
  /**
   * Génère une feuille de soins pour un patient
   */
  generateCareSheet: (appointmentId: string, patientName: string, patientId: string): void => {
    console.log(`Feuille de soins générée pour ${patientName} (ID: ${patientId}) suite au rendez-vous ${appointmentId}`);
  },
  
  /**
   * Télécharge un document spécifique pour un patient
   */
  downloadDocument: (documentType: string, patientId: string, careInfo: { type: string; date: string; }, prefill: boolean = false): void => {
    console.log(`Téléchargement du document ${documentType} pour le patient ${patientId}`);
    if (prefill) {
      console.log("Informations de soin:", careInfo);
    }
  },
  
  /**
   * Imprime un document spécifique pour un patient
   */
  printDocument: (documentType: string, patientId: string, careInfo: { type: string; date: string; }, prefill: boolean = false): void => {
    console.log(`Impression du document ${documentType} pour le patient ${patientId}`);
    if (prefill) {
      console.log("Informations de soin:", careInfo);
    }
  },
  
  /**
   * Simule la récupération des documents d'un patient
   */
  getPatientDocuments: (patientId: string): Document[] => {
    // Simuler une réponse avec des données statiques ou une logique appropriée
    return documentsData[patientId] || [];
  }
};
