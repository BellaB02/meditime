
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PatientService, VitalSign } from "@/services/PatientService";

// Schéma de validation du formulaire
const vitalSignFormSchema = z.object({
  temperature: z.string().regex(/^\d{2}(\.\d)?°C$/, {
    message: "Format invalide (ex: 37.2°C)"
  }),
  heartRate: z.string().regex(/^\d{2,3}\s?bpm$/, {
    message: "Format invalide (ex: 72 bpm)"
  }),
  bloodPressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, {
    message: "Format invalide (ex: 120/80)"
  }),
  notes: z.string().optional(),
});

type VitalSignFormValues = z.infer<typeof vitalSignFormSchema>;

interface VitalSignsFormProps {
  patientId: string;
  onSuccess: () => void;
}

const VitalSignsForm = ({ patientId, onSuccess }: VitalSignsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<VitalSignFormValues>({
    resolver: zodResolver(vitalSignFormSchema),
    defaultValues: {
      temperature: "37.0°C",
      heartRate: "72 bpm",
      bloodPressure: "120/80",
      notes: "",
    },
  });
  
  // Gestion de la soumission du formulaire
  const onSubmit = (data: VitalSignFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Créer un nouvel enregistrement de signes vitaux
      const newVitalSign: VitalSign = {
        date: "Aujourd'hui",
        temperature: data.temperature,
        heartRate: data.heartRate,
        bloodPressure: data.bloodPressure,
        notes: data.notes || "",
      };
      
      // Ajouter l'enregistrement au service
      PatientService.addVitalSign(patientId, newVitalSign);
      
      // Réinitialiser le formulaire et afficher un message de succès
      form.reset({
        temperature: "37.0°C",
        heartRate: "72 bpm",
        bloodPressure: "120/80",
        notes: "",
      });
      toast.success("Constantes enregistrées avec succès");
      
      // Appeler le callback de succès
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des constantes:", error);
      toast.error("Une erreur s'est produite lors de l'enregistrement des constantes");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Température</FormLabel>
                <FormControl>
                  <Input placeholder="37.2°C" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="heartRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pouls</FormLabel>
                <FormControl>
                  <Input placeholder="72 bpm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bloodPressure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tension artérielle</FormLabel>
                <FormControl>
                  <Input placeholder="120/80" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observations supplémentaires..."
                  className="min-h-[80px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les constantes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VitalSignsForm;
