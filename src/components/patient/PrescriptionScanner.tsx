
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Camera, Check, File, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { OCRService, OCRResult } from "@/services/OCRService";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.includes('image/')) {
        toast.error("Veuillez sélectionner une image valide");
        return;
      }
      
      setFile(selectedFile);
      
      // Generate preview
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImagePreview(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleCaptureImage = () => {
    fileInputRef.current?.click();
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
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        {!imagePreview ? (
          <div className="border-2 border-dashed rounded-md p-8 text-center space-y-4">
            <div className="flex justify-center">
              <Camera size={48} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Prenez en photo ou téléversez une ordonnance pour l'analyser
              </p>
              <div className="flex justify-center mt-4 gap-4">
                <Button onClick={handleCaptureImage} variant="outline">
                  <Camera size={16} className="mr-2" />
                  Prendre une photo
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <Upload size={16} className="mr-2" />
                  Téléverser
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Ordonnance" 
                  className="max-h-64 mx-auto object-contain rounded-md border" 
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={handleReset}
                >
                  <X size={16} />
                </Button>
              </div>
              
              {!scanResult ? (
                <Button 
                  onClick={handleScanImage} 
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? "Analyse en cours..." : "Analyser l'ordonnance"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Résultat de l'analyse</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={scanResult.confidence > 70 ? "default" : "destructive"}>
                        Confiance: {Math.round(scanResult.confidence)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Texte détecté (modifiable)</p>
                    <Textarea 
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  {scanResult.medicationData?.medications.length ? (
                    <div>
                      <p className="text-sm font-medium mb-1">Médicaments détectés</p>
                      <div className="flex flex-wrap gap-2">
                        {scanResult.medicationData.medications.map((med, i) => (
                          <Badge key={i} variant="outline">{med}</Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
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
