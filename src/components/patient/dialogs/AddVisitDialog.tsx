
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const visitFormSchema = z.object({
  date: z.string().nonempty({ message: "La date est requise" }),
  time: z.string().nonempty({ message: "L'heure est requise" }),
  care: z.string().nonempty({ message: "Le type de soin est requis" }),
  notes: z.string().optional()
});

type VisitFormValues = z.infer<typeof visitFormSchema>;

type AddVisitDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  patientId: string;
  onAddVisit: (e: React.FormEvent) => void;
};

export const AddVisitDialog: React.FC<AddVisitDialogProps> = ({
  isOpen,
  onOpenChange,
  patientName,
  patientId,
  onAddVisit
}) => {
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      care: "",
      notes: ""
    }
  });

  const handleSubmit = (data: VisitFormValues) => {
    console.log("Visite ajoutée:", data);
    // Appeler la fonction de rappel qui a été passée
    onAddVisit(new Event('submit') as any);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Ajouter visite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une visite</DialogTitle>
          <DialogDescription>
            Programmez une nouvelle visite pour {patientName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="care"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de soin</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        <option value="">Sélectionner un soin</option>
                        <option value="Prise de sang">Prise de sang</option>
                        <option value="Pansement">Pansement</option>
                        <option value="Injection">Injection</option>
                        <option value="Perfusion">Perfusion</option>
                        <option value="Soins post-opératoires">Soins post-opératoires</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px]"
                        placeholder="Détails supplémentaires..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
