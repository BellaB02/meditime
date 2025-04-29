
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export type DocumentType = 
  | "invoice" 
  | "careSheet" 
  | "ngapGuide" 
  | "prescription";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  date: string;
  url?: string;
  patientId?: string;
  patientName?: string;
  patientInfo?: {
    name: string;
    address?: string;
    phoneNumber?: string;
    socialSecurityNumber?: string;
    dateOfBirth?: string;
  };
  careInfo?: {
    type: string;
    date: string;
    time: string;
    code?: string;
    description?: string;
  };
}

// Simulation de documents téléchargeables
const documents: Record<string, string> = {
  "feuille_de_soins": "/documents/feuille_de_soins_vierge.pdf",
  "aide_memoire_ngap": "/documents/aide_memoire_cotation_ngap.pdf",
  "guide_incompatibilites": "/documents/guide_incompatibilites.pdf"
};

// Fonction d'aide pour formater la date actuelle
const formatDate = () => {
  const now = new Date();
  return format(now, "dd/MM/yyyy", { locale: fr });
};

// Fonction pour obtenir les informations du patient (simulation)
const getPatientInfo = (patientId?: string) => {
  // Dans une vraie application, ces données seraient récupérées depuis la base de données
  const patientsData: Record<string, any> = {
    "p1": {
      name: "Jean Dupont",
      address: "15 Rue de Paris, 75001 Paris",
      phoneNumber: "06 12 34 56 78",
      socialSecurityNumber: "1 88 05 75 123 456 78",
      dateOfBirth: "05/08/1988"
    },
    "p2": {
      name: "Marie Martin",
      address: "8 Avenue Victor Hugo, 75016 Paris",
      phoneNumber: "06 23 45 67 89",
      socialSecurityNumber: "2 90 12 75 234 567 89",
      dateOfBirth: "12/10/1990"
    },
    "p3": {
      name: "Robert Petit",
      address: "8 rue du Commerce, 75015 Paris",
      phoneNumber: "06 34 56 78 90",
      socialSecurityNumber: "1 85 07 75 345 678 90",
      dateOfBirth: "07/07/1985"
    }
  };

  return patientId && patientsData[patientId] ? patientsData[patientId] : undefined;
};

// Fonction pour générer un PDF pré-rempli
const generatePrefilledPDF = (patientId?: string, careInfo?: any) => {
  try {
    const patientInfo = patientId ? getPatientInfo(patientId) : undefined;
    
    if (!patientInfo) {
      toast.error("Informations patient non trouvées");
      return null;
    }
    
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(18);
    doc.text("FEUILLE DE SOINS", 105, 15, { align: "center" });
    
    // Informations patient
    doc.setFontSize(12);
    doc.text("INFORMATIONS PATIENT", 15, 30);
    doc.setFontSize(10);
    doc.text(`Nom et Prénom: ${patientInfo.name}`, 15, 40);
    doc.text(`Adresse: ${patientInfo.address || "Non renseignée"}`, 15, 47);
    doc.text(`N° Sécurité Sociale: ${patientInfo.socialSecurityNumber || "Non renseigné"}`, 15, 54);
    doc.text(`Date de naissance: ${patientInfo.dateOfBirth || "Non renseignée"}`, 15, 61);
    doc.text(`Téléphone: ${patientInfo.phoneNumber || "Non renseigné"}`, 15, 68);
    
    // Informations du soin
    doc.setFontSize(12);
    doc.text("INFORMATIONS DU SOIN", 15, 85);
    doc.setFontSize(10);
    doc.text(`Type de soin: ${careInfo?.type || "Non renseigné"}`, 15, 95);
    doc.text(`Code NGAP: ${careInfo?.code || "Non renseigné"}`, 15, 102);
    doc.text(`Date: ${careInfo?.date || formatDate()}`, 15, 109);
    doc.text(`Heure: ${careInfo?.time || format(new Date(), "HH:mm")}`, 15, 116);
    doc.text(`Description: ${careInfo?.description || "Non renseignée"}`, 15, 123);
    
    // Signature
    doc.setFontSize(12);
    doc.text("SIGNATURE DU PRATICIEN", 15, 150);
    doc.line(15, 165, 80, 165);
    
    return doc;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    toast.error("Erreur lors de la génération du PDF");
    return null;
  }
};

export const DocumentService = {
  downloadDocument: (documentKey: string, patientId?: string, careInfo?: any, preFilled: boolean = false) => {
    // Si preFilled est true, générer un PDF pré-rempli personnalisé
    if (preFilled && patientId) {
      const doc = generatePrefilledPDF(patientId, careInfo);
      
      if (doc) {
        // Télécharger le PDF généré
        const fileName = `feuille_de_soins_${patientId}_${formatDate().replace(/\//g, '-')}.pdf`;
        doc.save(fileName);
        
        const patientInfo = getPatientInfo(patientId);
        
        if (patientInfo) {
          // Notification détaillée
          toast.success(`Feuille de soins générée et téléchargée pour ${patientInfo.name}`, {
            description: `Le document a été pré-rempli avec toutes les informations patient et soins`,
            duration: 5000
          });
        }
        
        return true;
      }
      return false;
    }
    
    // Comportement par défaut pour les documents non personnalisés
    const documentUrl = documents[documentKey];
    
    if (!documentUrl) {
      toast.error("Document non trouvé");
      return false;
    }

    // Dans une vraie application, cela génèrerait un PDF dynamique avec les informations du patient
    // Pour la simulation, nous affichons simplement un message pour indiquer quelles informations seraient incluses
    
    let infoMessage = "Téléchargement du document";
    let patientInfo: any = null;
    
    if (patientId) {
      patientInfo = getPatientInfo(patientId);
      
      if (patientInfo) {
        infoMessage = `Document pré-rempli pour ${patientInfo.name}`;
        
        // Affiche les informations qui seraient incluses dans le document
        console.log("Informations pré-remplies:", {
          patient: patientInfo,
          care: careInfo,
          date: formatDate()
        });

        // Notification explicite des informations pré-remplies
        toast.info(`Feuille de soins pré-remplie avec les données suivantes:`, {
          description: `
            Patient: ${patientInfo.name}
            Adresse: ${patientInfo.address}
            Numéro SS: ${patientInfo.socialSecurityNumber}
            Type de soin: ${careInfo?.type || 'Non spécifié'}
            Date: ${careInfo?.date || formatDate()}
          `,
          duration: 5000
        });
      }
    }
    
    // Simulation de téléchargement (dans une application réelle, cela pointerait vers un fichier réel)
    const link = document.createElement('a');
    link.href = documentUrl;
    link.setAttribute('download', `${documentKey}${patientId ? `_${patientId}` : ''}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Téléchargement démarré");

    // Si dans une application réelle, on voudrait retourner toutes les infos utilisées pour pré-remplir
    return {
      success: true, 
      patientInfo,
      careInfo
    };
  },
  
  printDocument: (documentKey: string, patientId?: string, careInfo?: any, preFilled: boolean = false) => {
    // Si preFilled est true, générer un PDF pré-rempli pour impression
    if (preFilled && patientId) {
      const doc = generatePrefilledPDF(patientId, careInfo);
      
      if (doc) {
        // Ouvrir le PDF dans une nouvelle fenêtre pour impression
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        
        if (printWindow) {
          printWindow.addEventListener('load', () => {
            printWindow.print();
            URL.revokeObjectURL(url);
          });
        } else {
          toast.error("Impossible d'ouvrir la fenêtre d'impression. Vérifiez les paramètres de votre navigateur.");
        }
        
        const patientInfo = getPatientInfo(patientId);
        
        if (patientInfo) {
          toast.success(`Feuille de soins pré-remplie prête pour impression pour ${patientInfo.name}`);
        }
        
        return true;
      }
      return false;
    }
    
    // Comportement par défaut pour les impressions non personnalisées
    if (patientId) {
      const patientInfo = getPatientInfo(patientId);
      if (patientInfo) {
        // Notification détaillée des informations utilisées
        toast.info(`Document pré-rempli pour impression avec les données de ${patientInfo.name}`, {
          description: `
            Adresse: ${patientInfo.address}
            Numéro SS: ${patientInfo.socialSecurityNumber}
            Type de soin: ${careInfo?.type || 'Non spécifié'}
            Date: ${careInfo?.date || formatDate()}
          `,
          duration: 5000
        });
      }
    }
    
    window.print();
    toast.success("Impression en cours");
    return true;
  },
  
  generateCareSheet: (careId: string, patientName: string, patientId?: string) => {
    // Dans une vraie application, cela générerait une feuille de soins réelle
    
    // Récupérer les informations du patient si l'ID est fourni
    const patientInfo = patientId ? getPatientInfo(patientId) : undefined;
    
    // Notification plus détaillée des informations utilisées pour la feuille de soins
    if (patientInfo) {
      toast.success(`Feuille de soins générée pour ${patientName}`, {
        description: `Avec informations complètes: adresse, n° sécurité sociale, etc.`,
        duration: 4000
      });
    } else {
      toast.success(`Feuille de soins générée pour ${patientName}`);
    }
    
    return {
      id: `CS-${Date.now().toString(36)}`,
      name: `Feuille de soins - ${patientName}`,
      type: "careSheet" as DocumentType,
      date: formatDate(),
      patientName,
      patientId,
      patientInfo: patientInfo || { name: patientName },
      careInfo: {
        type: "Soin infirmier",
        date: formatDate(),
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      }
    };
  },
  
  generateInvoice: (data: any) => {
    // Dans une vraie application, cela générerait une facture réelle
    toast.success("Facture générée avec succès");
    
    return {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `Facture ${data.patient}`,
      type: "invoice" as DocumentType,
      date: formatDate(),
      patientName: data.patient
    };
  }
};
