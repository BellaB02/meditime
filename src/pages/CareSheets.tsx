
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
    careInfo: {
      type: "Pansement",
      code: "AMI 2",
      description: "Pansement simple",
      date: "29/04/2025"
    }
  },
  {
    id: "cs-002",
    name: "Feuille de soins - Marie Martin",
    type: "careSheet",
    date: "28/04/2025",
    patientId: "p2",
    patientName: "Marie Martin",
    careInfo: {
      type: "Injection insuline",
      code: "AMI 1",
      description: "Injection sous-cutanée",
      date: "28/04/2025"
    }
  },
  {
    id: "cs-003",
    name: "Feuille de soins - Robert Petit",
    type: "careSheet",
    date: "27/04/2025",
    patientId: "p3",
    patientName: "Robert Petit",
    careInfo: {
      type: "Prise de sang",
      code: "AMI 1.5",
      description: "Prélèvement sanguin",
      date: "27/04/2025"
    }
  },
  {
    id: "cs-004",
    name: "Feuille de soins - Jean Dupont",
    type: "careSheet",
    date: "26/04/2025",
    patientId: "p1",
    patientName: "Jean Dupont",
    careInfo: {
      type: "Injection insuline",
      code: "AMI 1",
      description: "Injection sous-cutanée",
      date: "26/04/2025"
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
