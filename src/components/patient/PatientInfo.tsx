
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Phone, MapPin, Save } from "lucide-react";
import { toast } from "sonner";
import { PatientInfo as PatientInfoType } from "@/services/PatientService";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Schema for patient form validation
export const patientFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  firstName: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères" }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Veuillez saisir un email valide" }).optional().or(z.literal("")),
  address: z.string().optional(),
  birthdate: z.string().optional(),
  insurance: z.string().optional(),
  doctor: z.string().optional(),
  notes: z.string().optional()
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

type PatientInfoProps = {
  patientInfo: PatientInfoType | null;
  isEditingPatient: boolean;
  patientForm: UseFormReturn<PatientFormValues>;
  handleSavePatientInfo: (data: PatientFormValues) => void;
  handleCancelEdit: () => void;
  handleCallPatient: () => void;
  handleNavigateToAddress: () => void;
};

const PatientInfo: React.FC<PatientInfoProps> = ({
  patientInfo,
  isEditingPatient,
  patientForm,
  handleSavePatientInfo,
  handleCancelEdit,
  handleCallPatient,
  handleNavigateToAddress,
}) => {
  if (!patientInfo) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Informations personnelles</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...patientForm}>
          <form onSubmit={patientForm.handleSubmit(handleSavePatientInfo)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={patientForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditingPatient} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={patientForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditingPatient} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={patientForm.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditingPatient} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={patientForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <div className="flex items-center">
                      <FormControl>
                        <Input {...field} readOnly={!isEditingPatient} />
                      </FormControl>
                      {!isEditingPatient && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-2"
                          onClick={handleCallPatient}
                          type="button"
                        >
                          <Phone size={18} />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={patientForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditingPatient} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={patientForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <div className="flex items-center">
                      <FormControl>
                        <Input {...field} readOnly={!isEditingPatient} />
                      </FormControl>
                      {!isEditingPatient && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-2" 
                          onClick={handleNavigateToAddress}
                          type="button"
                        >
                          <MapPin size={18} />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={patientForm.control}
                name="insurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assurance</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditingPatient} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={patientForm.control}
                name="doctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médecin traitant</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditingPatient} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={patientForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes médicales</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="w-full min-h-[100px] p-3 border rounded-md"
                      placeholder="Ajouter des notes médicales importantes..."
                      readOnly={!isEditingPatient}
                    ></textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isEditingPatient && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={handleCancelEdit}>
                  Annuler
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PatientInfo;
