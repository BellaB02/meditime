import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Document } from "@/services/DocumentService";
import { CareSheetList } from "@/components/CareSheets/CareSheetList";
import { CareSheetHeader } from "@/components/CareSheets/CareSheetHeader";
import { NewCareSheetForm } from "@/components/CareSheets/NewCareSheetForm";
import { UsefulDocumentsCard } from "@/components/CareSheets/UsefulDocumentsCard";

// Données fictives pour les feuilles de soins
const dummyCareSheets: Document[] = [
  {
    id: "cs-001",
    name: "Feuille de soins - Jean Dupont",
    type: "careSheet",
    date: "29/04/2025",
    patientId: "p1",
    patientName: "Jean Dupont",
    patientInfo: {
      name: "Jean Dupont",
      address: "15 Rue de Paris, 75001 Paris",
      phoneNumber: "06 12 34 56 78",
      socialSecurityNumber: "1 88 05 75 123 456 78",
      dateOfBirth: "05/08/1988"
    },
    careInfo: {
      type: "Pansement",
      date: "29/04/2025",
      time: "10:00",
      code: "AMI 2"
    }
  },
  {
    id: "cs-002",
    name: "Feuille de soins - Marie Martin",
    type: "careSheet",
    date: "28/04/2025",
    patientId: "p2",
    patientName: "Marie Martin",
    patientInfo: {
      name: "Marie Martin",
      address: "8 Avenue Victor Hugo, 75016 Paris",
      phoneNumber: "06 23 45 67 89",
      socialSecurityNumber: "2 90 12 75 234 567 89",
      dateOfBirth: "12/10/1990"
    },
    careInfo: {
      type: "Injection insuline",
      date: "28/04/2025",
      time: "11:30",
      code: "AMI 1"
    }
  },
  {
    id: "cs-003",
    name: "Feuille de soins - Robert Petit",
    type: "careSheet",
    date: "27/04/2025",
    patientId: "p3",
    patientName: "Robert Petit",
    patientInfo: {
      name: "Robert Petit",
      address: "8 rue du Commerce, 75015 Paris",
      phoneNumber: "06 34 56 78 90",
      socialSecurityNumber: "1 85 07 75 345 678 90",
      dateOfBirth: "07/07/1985"
    },
    careInfo: {
      type: "Prise de sang",
      date: "27/04/2025",
      time: "09:00",
      code: "AMI 1.5"
    }
  },
  {
    id: "cs-004",
    name: "Feuille de soins - Jean Dupont",
    type: "careSheet",
    date: "26/04/2025",
    patientId: "p1",
    patientName: "Jean Dupont",
    patientInfo: {
      name: "Jean Dupont",
      address: "15 Rue de Paris, 75001 Paris",
      phoneNumber: "06 12 34 56 78",
      socialSecurityNumber: "1 88 05 75 123 456 78",
      dateOfBirth: "05/08/1988"
    },
    careInfo: {
      type: "Injection insuline",
      date: "26/04/2025",
      time: "18:30",
      code: "AMI 1"
    }
  }
];

export default function CareSheets() {
  const [isNewSheetDialogOpen, setIsNewSheetDialogOpen] = useState(false);
  const [careSheets] = useState<Document[]>(dummyCareSheets);
  
  return (
    <div className="animate-fade-in space-y-6">
      <CareSheetHeader openDialog={() => setIsNewSheetDialogOpen(true)} />

      <div className="grid gap-6">
        <CareSheetList careSheets={careSheets} />
        <UsefulDocumentsCard />
      </div>
      
      <Dialog open={isNewSheetDialogOpen} onOpenChange={setIsNewSheetDialogOpen}>
        <NewCareSheetForm onClose={() => setIsNewSheetDialogOpen(false)} />
      </Dialog>
    </div>
  );
}
