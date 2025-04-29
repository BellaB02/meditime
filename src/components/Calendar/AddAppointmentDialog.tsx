
import { useState } from "react";
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

interface AddAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
}

const appointmentFormSchema = z.object({
  date: z.string().nonempty({ message: "La date est requise" }),
  time: z.string().nonempty({ message: "L'heure est requise" }),
  patientName: z.string().nonempty({ message: "Le nom du patient est requis" }),
  patientAddress: z.string(),
  care: z.string().nonempty({ message: "Le type de soin est requis" })
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export const AddAppointmentDialog = ({
  isOpen,
  onClose,
  onAddAppointment
}: AddAppointmentDialogProps) => {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      patientName: "",
      patientAddress: "",
      care: ""
    }
  });

  const onSubmit = (data: AppointmentFormValues) => {
    try {
      const newAppointment: Appointment = {
        id: `app-${Date.now()}`,
        date: new Date(data.date),
        time: data.time,
        patient: {
          id: `p-${Date.now()}`,
          name: data.patientName,
          address: data.patientAddress,
          care: data.care
        }
      };
      
      onAddAppointment(newAppointment);
      
      // Réinitialiser le formulaire et fermer le dialogue
      form.reset();
      onClose();
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
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du patient</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jean Dupont"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="15 Rue de Paris, 75001 Paris"
                      {...field}
                    />
                  </FormControl>
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
