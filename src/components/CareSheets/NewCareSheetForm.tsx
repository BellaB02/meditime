
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PatientService, PatientInfo } from "@/services/PatientService";
import { DocumentService } from "@/services/DocumentService";

interface NewCareSheetFormProps {
  onClose: () => void;
}

export const NewCareSheetForm: React.FC<NewCareSheetFormProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [careType, setCareType] = useState("");
  const [careCode, setCareCode] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState<PatientInfo[]>([]);

  // Chargement initial des patients
  useEffect(() => {
    // Utiliser la version synchrone pour la rétrocompatibilité immédiate
    const patientsSync = PatientService.getAllPatientsSync();
    setPatients(patientsSync);
    
    // Puis charger depuis Supabase
    const loadPatients = async () => {
      try {
        const patientList = await PatientService.getAllPatients();
        setPatients(patientList);
      } catch (error) {
        console.error("Error loading patients:", error);
      }
    };
    
    loadPatients();
  }, []);

  // Patients filtrés selon la recherche
  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.name}`.toLowerCase().includes(patientSearch.toLowerCase())
  );

  // Liste des types de soins disponibles (à compléter selon vos besoins)
  const careTypes = [
    { label: "Pansement", value: "Pansement", code: "AMI 2" },
    { label: "Injection insuline", value: "Injection insuline", code: "AMI 1" },
    { label: "Prise de sang", value: "Prise de sang", code: "AMI 1.5" },
    { label: "Toilette complète", value: "Toilette complète", code: "AIS 4" }
  ];

  const handleSelectPatient = (id: string) => {
    setPatientId(id);
    const patient = patients.find(p => p.id === id);
    if (patient) {
      setPatientSearch(`${patient.firstName} ${patient.name}`);
    }
  };

  const handleSelectCareType = (value: string) => {
    setCareType(value);
    const selectedType = careTypes.find(t => t.value === value);
    if (selectedType) {
      setCareCode(selectedType.code);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !careType) {
      toast.error("Veuillez sélectionner un patient et un type de soin");
      return;
    }

    setLoading(true);

    try {
      // Récupérer les informations du patient
      const patientInfo = patients.find(p => p.id === patientId);
      
      if (patientInfo) {
        // Générer la feuille de soins
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR');
        
        // Ajouter une feuille de soins à notre service (simulation)
        DocumentService.generateCareSheet(
          `apt-${Date.now()}`,
          patientInfo.firstName + " " + patientInfo.name, 
          patientId
        );
        
        toast.success("Feuille de soins créée avec succès");
        onClose();
      } else {
        toast.error("Patient non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la feuille de soins:", error);
      toast.error("Erreur lors de la création de la feuille de soins");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Nouvelle feuille de soins</DialogTitle>
        <DialogDescription>
          Créez une nouvelle feuille de soins pour un patient
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patientSearch">Patient</Label>
          <Input
            id="patientSearch"
            placeholder="Rechercher un patient"
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
          />
          {patientSearch && (
            <div className="bg-background border rounded-md mt-1 max-h-40 overflow-y-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <Button
                    key={patient.id}
                    type="button"
                    variant="ghost"
                    className="w-full justify-start text-left px-2 py-1 h-auto"
                    onClick={() => handleSelectPatient(patient.id)}
                  >
                    {patient.firstName} {patient.name}
                  </Button>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">Aucun patient trouvé</div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="careType">Type de soin</Label>
          <Select value={careType} onValueChange={handleSelectCareType}>
            <SelectTrigger id="careType">
              <SelectValue placeholder="Sélectionner un type de soin" />
            </SelectTrigger>
            <SelectContent>
              {careTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label} ({type.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="code">Code NGAP</Label>
          <Input
            id="code"
            value={careCode}
            onChange={(e) => setCareCode(e.target.value)}
            placeholder="Code NGAP"
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
