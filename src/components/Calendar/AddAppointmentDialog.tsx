
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Appointment } from "@/components/Calendar/AppointmentCard";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PatientInfo, PatientService } from "@/services/PatientService";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  patientId?: string;
}

const appointmentFormSchema = z.object({
  date: z.string().nonempty({ message: "La date est requise" }),
  time: z.string().nonempty({ message: "L'heure est requise" }),
  patientId: z.string().nonempty({ message: "Le patient est requis" }),
  care: z.string().nonempty({ message: "Le type de soin est requis" })
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export const AddAppointmentDialog = ({
  isOpen,
  onClose,
  onAddAppointment,
  patientId
}: AddAppointmentDialogProps) => {
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      patientId: patientId || "",
      care: ""
    }
  });
  
  // Charger les patients
  useEffect(() => {
    const allPatients = PatientService.getAllPatients();
    setPatients(allPatients);
    
    // Si un ID patient est fourni, sélectionner ce patient
    if (patientId) {
      const patient = allPatients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatient(patient);
        form.setValue("patientId", patientId);
      }
    }
  }, [patientId, form]);

  const onSubmit = (data: AppointmentFormValues) => {
    try {
      const patient = patients.find(p => p.id === data.patientId);
      
      if (!patient) {
        toast.error("Patient non trouvé");
        return;
      }
      
      const newAppointment: Appointment = {
        id: `app-${Date.now()}`,
        date: new Date(data.date),
        time: data.time,
        patient: {
          id: patient.id,
          name: `${patient.firstName || ''} ${patient.name}`.trim(),
          address: patient.address || "Adresse non spécifiée",
          care: data.care
        }
      };
      
      onAddAppointment(newAppointment);
      
      // Réinitialiser le formulaire et fermer le dialogue
      form.reset();
      onClose();
      toast.success(`Rendez-vous ajouté avec succès pour ${patient.firstName} ${patient.name}`);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du rendez-vous");
      console.error("Error adding appointment:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau rendez-vous</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Patient</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!!patientId}
                        >
                          {field.value && selectedPatient
                            ? `${selectedPatient.firstName || ''} ${selectedPatient.name}`.trim()
                            : "Sélectionner un patient"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher un patient..." />
                        <CommandEmpty>Aucun patient trouvé.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {patients.map((patient) => (
                              <CommandItem
                                key={patient.id}
                                value={`${patient.firstName || ''} ${patient.name}`.trim().toLowerCase()}
                                onSelect={() => {
                                  form.setValue("patientId", patient.id);
                                  setSelectedPatient(patient);
                                  setOpen(false);
                                }}
                              >
                                <User className="mr-2 h-4 w-4" />
                                <span>{`${patient.firstName || ''} ${patient.name}`.trim()}</span>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    field.value === patient.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="care"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de soin</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="">Sélectionner un soin</option>
                      <option value="Prise de sang">Prise de sang</option>
                      <option value="Changement pansement">Changement pansement</option>
                      <option value="Injection insuline">Injection insuline</option>
                      <option value="Soins post-opératoires">Soins post-opératoires</option>
                      <option value="Perfusion">Perfusion</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
