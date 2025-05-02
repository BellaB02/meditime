
import { z } from "zod";

// Schéma de validation du formulaire
export const prescriptionFormSchema = z.object({
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

export type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;
