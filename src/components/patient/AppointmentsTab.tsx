
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AppointmentsTabProps {
  patientId: string;
}

// Type pour les rendez-vous
interface Appointment {
  id: string;
  date: Date;
  time: string;
  duration: number;
  careType: string;
  status: string;
  notes?: string;
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ patientId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("08:00");
  const [duration, setDuration] = useState("30");
  const [careType, setCareType] = useState("");
  const [notes, setNotes] = useState("");
  
  // Simuler des rendez-vous existants
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "apt-1",
      date: new Date(),
      time: "10:30",
      duration: 30,
      careType: "Pansement",
      status: "scheduled"
    },
    {
      id: "apt-2",
      date: new Date(Date.now() + 86400000 * 2), // Dans 2 jours
      time: "14:15",
      duration: 45,
      careType: "Prise de sang",
      status: "scheduled"
    }
  ]);
  
  // Types de soins disponibles
  const careTypes = [
    "Pansement",
    "Injection insuline",
    "Prise de sang",
    "Surveillance tension",
    "Toilette complète"
  ];
  
  // Durées disponibles en minutes
  const durations = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 heure" }
  ];
  
  const handleAddAppointment = () => {
    if (!date || !time || !careType) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Créer un nouveau rendez-vous
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      date: date,
      time: time,
      duration: parseInt(duration),
      careType: careType,
      status: "scheduled",
      notes: notes
    };
    
    // Ajouter le rendez-vous à la liste
    setAppointments([...appointments, newAppointment]);
    
    // Réinitialiser le formulaire et fermer le dialog
    toast.success("Rendez-vous ajouté avec succès");
    setIsDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setDate(new Date());
    setTime("08:00");
    setDuration("30");
    setCareType("");
    setNotes("");
  };
  
  const formatAppointmentDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Rendez-vous</CardTitle>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Type de soin</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {formatAppointmentDate(appointment.date)}
                    </TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.duration} min</TableCell>
                    <TableCell>{appointment.careType}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={cn(
                          "h-2 w-2 rounded-full mr-2",
                          appointment.status === "scheduled" ? "bg-blue-500" :
                          appointment.status === "completed" ? "bg-green-500" :
                          "bg-gray-500"
                        )} />
                        {appointment.status === "scheduled" ? "Programmé" :
                          appointment.status === "completed" ? "Terminé" : "Annulé"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Aucun rendez-vous programmé pour ce patient
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'ajout de rendez-vous */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un rendez-vous</DialogTitle>
            <DialogDescription>
              Planifiez un nouveau rendez-vous pour ce patient
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Heure</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="careType">Type de soin</Label>
              <Select value={careType} onValueChange={setCareType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de soin" />
                </SelectTrigger>
                <SelectContent>
                  {careTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Informations complémentaires..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddAppointment}>
              Ajouter rendez-vous
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsTab;
