
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
import { toast } from "sonner";
import { FileUp } from "lucide-react";
import { PatientService, Prescription } from "@/services/PatientService";

// Schéma de validation du formulaire
const prescriptionFormSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères"
  }),
  doctor: z.string().min(2, {
    message: "Le nom du médecin doit contenir au moins 2 caractères"
  }),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: "Format de date invalide (ex: 15/04/2025)"
  }),
  name: z.string().min(2, {
    message: "Le nom du médicament doit contenir au moins 2 caractères"
  }),
  dosage: z.string().min(2, {
    message: "Le dosage doit contenir au moins 2 caractères"
  }),
  frequency: z.string().min(2, {
    message: "La fréquence doit contenir au moins 2 caractères"
  }),
  file: z.instanceof(File, {
    message: "Veuillez sélectionner un fichier PDF"
  }).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Le fichier ne doit pas dépasser 5 Mo"
  }).refine((file) => file.type === 'application/pdf', {
    message: "Seuls les fichiers PDF sont acceptés"
  }),
});

type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;

interface PrescriptionUploadFormProps {
  patientId: string;
  onSuccess: () => void;
}

const PrescriptionUploadForm = ({ patientId, onSuccess }: PrescriptionUploadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Obtenir la date du jour au format dd/mm/yyyy
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      title: "",
      doctor: "",
      date: getCurrentDate(),
      name: "",
      dosage: "",
      frequency: ""
    },
  });
  
  // Gérer la sélection de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("file", file);
    }
  };
  
  // Gestion de la soumission du formulaire
  const onSubmit = (data: PrescriptionFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Dans une véritable application, nous téléverserions le fichier vers un serveur
      // et obtiendrions une URL de fichier
      const fileUrl = URL.createObjectURL(data.file);
      
      // Créer une nouvelle ordonnance
      const newPrescription: Omit<Prescription, 'id'> = {
        title: data.title,
        doctor: data.doctor,
        date: data.date,
        file: fileUrl,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.date,
      };
      
      // Ajouter l'ordonnance au service
      const prescriptionId = PatientService.addPrescription(patientId, newPrescription);
      
      // Réinitialiser le formulaire et afficher un message de succès
      form.reset({
        title: "",
        doctor: "",
        date: getCurrentDate(),
        name: "",
        dosage: "",
        frequency: ""
      });
      setSelectedFile(null);
      
      toast.success("Ordonnance ajoutée avec succès");
      
      // Appeler le callback de succès
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ordonnance:", error);
      toast.error("Une erreur s'est produite lors de l'ajout de l'ordonnance");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'ordonnance</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Renouvellement traitement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="doctor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médecin prescripteur</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. Nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de l'ordonnance</FormLabel>
                <FormControl>
                  <Input placeholder="JJ/MM/AAAA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du médicament</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Paracétamol" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 1000mg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fréquence</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 3 fois par jour" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Fichier PDF</FormLabel>
              <FormControl>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <FileUp size={24} className="mx-auto mb-2 text-muted-foreground" />
                  {selectedFile ? (
                    <div className="text-sm mb-2">
                      <span className="font-medium">{selectedFile.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-2">
                      Cliquez pour téléverser ou glissez-déposez
                    </p>
                  )}
                  <Input 
                    id="prescription-file" 
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      handleFileChange(e);
                    }}
                    {...fieldProps}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('prescription-file')?.click()}
                  >
                    Sélectionner un fichier PDF
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Téléversement..." : "Ajouter l'ordonnance"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PrescriptionUploadForm;
