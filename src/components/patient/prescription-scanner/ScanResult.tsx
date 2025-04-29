
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OCRResult } from "@/services/OCRService";
import { Check, Save } from "lucide-react";

interface ScanResultProps {
  result: OCRResult;
  editedText: string;
  onTextChange: (text: string) => void;
  onSave: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({
  result,
  editedText,
  onTextChange,
  onSave,
}) => {
  const [saving, setSaving] = useState(false);
  
  const handleSaveClick = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Résultat de l'analyse</h3>
          <Button onClick={handleSaveClick} disabled={saving} size="sm">
            {saving ? "Enregistrement..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Texte identifié</h4>
          <Textarea 
            value={editedText} 
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        
        {result.medicationData && result.medicationData.medications.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Médicaments détectés</h4>
            <div className="space-y-2">
              {result.medicationData.medications.map((med, index) => (
                <div key={index} className="bg-muted/50 p-2 rounded-md">
                  <div className="font-medium">{med.name}</div>
                  {med.dosage && <div className="text-sm text-muted-foreground">Dosage: {med.dosage}</div>}
                  {med.instructions && <div className="text-sm text-muted-foreground">Instructions: {med.instructions}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {result.medicationData && (
          <div className="space-y-2">
            {result.medicationData.doctor && (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Médecin: {result.medicationData.doctor}</span>
              </div>
            )}
            {result.medicationData.patient && (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Patient: {result.medicationData.patient}</span>
              </div>
            )}
            {result.medicationData.date && (
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Date: {result.medicationData.date}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanResult;
