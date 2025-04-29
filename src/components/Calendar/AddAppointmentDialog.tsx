
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { PatientService, PatientInfo } from "@/services/PatientService";
import { Appointment } from "./AppointmentCard";

interface AddAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  patientId?: string;
}

export const AddAppointmentDialog = ({ isOpen, onClose, onAddAppointment, patientId }: AddAppointmentDialogProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("08:00");
  const [selectedPatientId, setSelectedPatientId] = useState(patientId || "");
  const [careType, setCareType] = useState("Pansement");
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger la liste des patients
  useEffect(() => {
    if (isOpen) {
      // Utilisation de la version synchrone pour la rétrocompatibilité immédiate
      const patientsSync = PatientService.getAllPatientsSync();
      setPatients(patientsSync);
      
      if (patientId) {
        setSelectedPatientId(patientId);
      } else {
        setSelectedPatientId(patientsSync.length > 0 ? patientsSync[0].id : "");
      }
      
      // Ensuite charger depuis Supabase de manière asynchrone
      const loadPatients = async () => {
        try {
          const patientList = await PatientService.getAllPatients();
          setPatients(patientList);
          
          if (!patientId && patientList.length > 0) {
            setSelectedPatientId(patientList[0].id);
          }
        } catch (error) {
          console.error("Error loading patients:", error);
        }
      };
      
      loadPatients();
    }
  }, [isOpen, patientId]);
  
  // Réinitialiser le formulaire lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setDate(new Date());
      setTime("08:00");
      setCareType("Pansement");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    
    if (!selectedPatient) {
      toast.error("Veuillez sélectionner un patient valide");
      setIsLoading(false);
      return;
    }
    
    // Create new appointment
    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      date: date,
      time: time,
      patient: {
        id: selectedPatient.id,
        name: `${selectedPatient.firstName || ''} ${selectedPatient.name}`.trim(),
        address: selectedPatient.address || "Adresse non renseignée",
        care: careType
      }
    };
    
    // Simulate API call
    setTimeout(() => {
      onAddAppointment(newAppointment);
      onClose();
      setIsLoading(false);
    }, 500);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const [year, month, day] = dateValue.split('-').map(Number);
    setDate(new Date(year, month - 1, day));
  };
  
  const careOptions = [
    "Pansement",
    "Prise de sang",
    "Injection",
    "Perfusion",
    "Toilette",
    "Soins post-opératoires",
    "Autre"
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un rendez-vous</DialogTitle>
          <DialogDescription>
            Saisissez les détails du rendez-vous ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select 
              value={selectedPatientId} 
              onValueChange={setSelectedPatientId}
              disabled={!!patientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {`${patient.firstName || ''} ${patient.name}`.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date.toISOString().split('T')[0]}
                onChange={handleDateChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <Input 
                id="time" 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="care">Type de soin</Label>
            <Select value={careType} onValueChange={setCareType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un type de soin" />
              </SelectTrigger>
              <SelectContent>
                {careOptions.map(care => (
                  <SelectItem key={care} value={care}>{care}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin mr-2">◌</span>
              ) : (
                <Calendar className="mr-2 h-4 w-4" />
              )}
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
