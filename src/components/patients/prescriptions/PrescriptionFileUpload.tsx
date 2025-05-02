
import React from "react";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PrescriptionFormValues } from "./PrescriptionFormSchema";

interface PrescriptionFileUploadProps {
  form: UseFormReturn<PrescriptionFormValues>;
  selectedFile: File | null;
  onFileChange: (file: File) => void;
}

export const PrescriptionFileUpload: React.FC<PrescriptionFileUploadProps> = ({
  form,
  selectedFile,
  onFileChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
      form.setValue("file", file);
    }
  };

  return (
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
  );
};
