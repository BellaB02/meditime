
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Schéma de validation du formulaire
const patientFormSchema = z.object({
  name: z.string().min(2, { 
    message: "Le nom doit contenir au moins 2 caractères" 
  }),
  firstName: z.string().min(2, { 
    message: "Le prénom doit contenir au moins 2 caractères" 
  }),
  birthDate: z.date({
    required_error: "La date de naissance est requise",
  }),
  address: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères"
  }),
  phone: z.string().min(10, {
    message: "Le numéro de téléphone doit contenir au moins 10 caractères"
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide"
  }).optional().or(z.literal("")),
  socialSecurityNumber: z.string().min(15, {
    message: "Le numéro de sécurité sociale doit contenir 15 chiffres"
  }).regex(/^\d[\s\d]{13}\d$/, {
    message: "Format invalide (ex: 1 95 05 75 123 456 78)"
  }),
  doctor: z.string().optional(),
  medicalNotes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface AddPatientFormProps {
  onSuccess: () => void;
}

const AddPatientForm = ({ onSuccess }: AddPatientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      firstName: "",
      address: "",
      phone: "",
      email: "",
      socialSecurityNumber: "",
      doctor: "",
      medicalNotes: "",
    },
  });
  
  // Gestion de la soumission du formulaire
  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Ici, nous pourrions envoyer les données à une API
      console.log("Données du patient:", data);
      
      // Simuler un délai d'enregistrement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Afficher un message de succès
      toast.success(`Patient ${data.firstName} ${data.name} ajouté avec succès`);
      
      // Réinitialiser le formulaire
      form.reset();
      
      // Appeler le callback de succès
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient:", error);
      toast.error("Une erreur s'est produite lors de l'ajout du patient");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de famille" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de naissance</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="socialSecurityNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de sécurité sociale</FormLabel>
                <FormControl>
                  <Input placeholder="1 XX XX XX XXX XXX XX" {...field} />
                </FormControl>
                <FormDescription>
                  Format: 1 95 05 75 123 456 78
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="06 XX XX XX XX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="exemple@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="Adresse complète" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="doctor"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Médecin traitant (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. Nom (Spécialité)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="medicalNotes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Notes médicales (optionnel)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informations importantes, allergies, traitements en cours..."
                    className="min-h-[100px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Réinitialiser
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Ajouter le patient"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPatientForm;
