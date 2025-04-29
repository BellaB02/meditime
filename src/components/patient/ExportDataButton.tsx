
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { ExportService } from '@/services/ExportService';
import { PatientInfo } from '@/services/PatientInfoService';
import { VitalSign } from '@/integrations/supabase/services/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ExportDataButtonProps {
  patient: PatientInfo;
  className?: string;
}

const ExportDataButton = ({ patient, className }: ExportDataButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleExport = async (format: 'csv' | 'json') => {
    setIsLoading(true);
    
    try {
      // Récupérer les signes vitaux du patient
      const { data: vitalSigns, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patient.id)
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      
      // Exporter selon le format choisi
      if (format === 'csv') {
        ExportService.downloadPatientAsCSV(patient, vitalSigns as VitalSign[]);
        toast.success("Données exportées en CSV avec succès");
      } else {
        ExportService.downloadPatientAsJSON(patient, vitalSigns as VitalSign[]);
        toast.success("Données exportées en JSON avec succès");
      }
    } catch (err) {
      console.error("Erreur lors de l'exportation:", err);
      toast.error("Erreur lors de l'exportation des données");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exporter les données
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="h-4 w-4 mr-2" />
          Exporter en JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDataButton;
