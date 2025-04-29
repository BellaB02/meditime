
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Appointment } from "@/components/Calendar/AppointmentCard";

interface AddAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
}

export const AddAppointmentDialog = ({
  isOpen,
  onClose,
  onAddAppointment
}: AddAppointmentDialogProps) => {
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState("09:00");
  const [patientName, setPatientName] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [care, setCare] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientName || !date || !time || !care) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      date: new Date(date),
      time,
      patient: {
        id: `p-${Date.now()}`,
        name: patientName,
        address: patientAddress,
        care
      }
    };
    
    onAddAppointment(newAppointment);
    toast.success("Rendez-vous ajouté avec succès");
    
    // Réinitialiser le formulaire
    setPatientName("");
    setPatientAddress("");
    setCare("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau rendez-vous</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patientName">Nom du patient</Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Jean Dupont"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patientAddress">Adresse</Label>
            <Input
              id="patientAddress"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              placeholder="15 Rue de Paris, 75001 Paris"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="care">Type de soin</Label>
            <select
              id="care"
              value={care}
              onChange={(e) => setCare(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Sélectionner un soin</option>
              <option value="Prise de sang">Prise de sang</option>
              <option value="Changement pansement">Changement pansement</option>
              <option value="Injection insuline">Injection insuline</option>
              <option value="Soins post-opératoires">Soins post-opératoires</option>
              <option value="Perfusion">Perfusion</option>
            </select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
