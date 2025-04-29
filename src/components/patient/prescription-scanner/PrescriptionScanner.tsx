
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { OCRService, OCRResult } from "@/services/OCRService";

import { FileUploader } from "./FileUploader";
import { ImagePreview } from "./ImagePreview";
import { ScanResult } from "./ScanResult";

interface PrescriptionScannerProps {
  onScanComplete: (result: OCRResult) => void;
  onCancel: () => void;
}

const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({
  onScanComplete,
  onCancel
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<OCRResult | null>(null);
  const [editedText, setEditedText] = useState("");
  
  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setImagePreview(loadEvent.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const handleScanImage = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await OCRService.scanPrescription(file);
      setScanResult(result);
      setEditedText(result.text);
      toast.success("Ordonnance analysée avec succès");
    } catch (error) {
      console.error("OCR error:", error);
      toast.error("Erreur lors de l'analyse de l'ordonnance");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleConfirm = () => {
    if (scanResult) {
      // Update the result with edited text
      const updatedResult = {
        ...scanResult,
        text: editedText,
        // Recalculate medication data based on edited text
        medicationData: OCRService.extractMedicationData(editedText)
      };
      
      onScanComplete(updatedResult);
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setImagePreview(null);
    setScanResult(null);
    setEditedText("");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyser une ordonnance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!imagePreview ? (
          <FileUploader onFileSelected={handleFileChange} />
        ) : (
          <>
            {!scanResult ? (
              <ImagePreview 
                imageUrl={imagePreview}
                isAnalyzing={isAnalyzing}
                onReset={handleReset}
                onScanImage={handleScanImage}
              />
            ) : (
              <ScanResult 
                result={scanResult}
                editedText={editedText}
                onEditText={setEditedText}
              />
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        
        {scanResult && (
          <Button onClick={handleConfirm}>
            <Check size={16} className="mr-2" />
            Confirmer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PrescriptionScanner;
