
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PrescriptionFormFields } from "./PrescriptionFormFields";
import { PrescriptionFileUpload } from "./PrescriptionFileUpload";
import { usePrescriptionForm } from "./usePrescriptionForm";

interface PrescriptionUploadFormProps {
  patientId: string;
  onSuccess: () => void;
}

const PrescriptionUploadForm = ({ patientId, onSuccess }: PrescriptionUploadFormProps) => {
  const { form, isSubmitting, selectedFile, handleFileChange, onSubmit } = usePrescriptionForm(patientId, onSuccess);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PrescriptionFormFields form={form} />
        <PrescriptionFileUpload 
          form={form} 
          selectedFile={selectedFile} 
          onFileChange={handleFileChange} 
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
