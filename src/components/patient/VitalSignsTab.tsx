
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { VitalSign } from "@/hooks/usePatientVitalSigns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VitalSignsTabProps {
  patientId: string;
  vitalSigns: VitalSign[];
}

const VitalSignsTab: React.FC<VitalSignsTabProps> = ({ patientId, vitalSigns }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    temperature: "",
    heartRate: "",
    bloodPressure: "",
    bloodSugar: "",
    oxygenSaturation: "",
    painLevel: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      temperature: "",
      heartRate: "",
      bloodPressure: "",
      bloodSugar: "",
      oxygenSaturation: "",
      painLevel: "",
      notes: ""
    });
  };

  const handleAddVitalSigns = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!formData.temperature && !formData.heartRate && !formData.bloodPressure && 
          !formData.bloodSugar && !formData.oxygenSaturation && !formData.painLevel) {
        toast.error("Veuillez saisir au moins une mesure");
        return;
      }
      
      // Create the vital sign record
      const newVitalSign = {
        patient_id: patientId,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        heart_rate: formData.heartRate ? parseInt(formData.heartRate) : null,
        blood_pressure: formData.bloodPressure || null,
        blood_sugar: formData.bloodSugar ? parseFloat(formData.bloodSugar) : null,
        oxygen_saturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : null,
        pain_level: formData.painLevel ? parseInt(formData.painLevel) : null,
        notes: formData.notes || null,
        recorded_at: new Date().toISOString(),
        recorded_by: (await supabase.auth.getUser()).data.user?.id || null
      };
      
      // Submit to Supabase
      const { data, error } = await supabase
        .from('vital_signs')
        .insert(newVitalSign)
        .select();
        
      if (error) throw error;
      
      toast.success("Signes vitaux enregistrés avec succès");
      setIsDialogOpen(false);
      resetForm();
      
      // Refresh the page to show the new vital signs
      window.location.reload();
      
    } catch (error) {
      console.error("Error adding vital signs:", error);
      toast.error("Erreur lors de l'enregistrement des signes vitaux");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'à' HH:mm", { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Signes vitaux</CardTitle>
            <CardDescription>
              Historique des relevés des signes vitaux du patient
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent>
          {vitalSigns.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Température</TableHead>
                  <TableHead>Pouls</TableHead>
                  <TableHead>Tension</TableHead>
                  <TableHead>Glycémie</TableHead>
                  <TableHead>Saturation</TableHead>
                  <TableHead>Douleur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vitalSigns.map((sign) => (
                  <TableRow key={sign.id}>
                    <TableCell>{formatDate(sign.recorded_at)}</TableCell>
                    <TableCell>{sign.temperature ? `${sign.temperature}°C` : "-"}</TableCell>
                    <TableCell>{sign.heart_rate ? `${sign.heart_rate} bpm` : "-"}</TableCell>
                    <TableCell>{sign.blood_pressure || "-"}</TableCell>
                    <TableCell>{sign.blood_sugar ? `${sign.blood_sugar} g/L` : "-"}</TableCell>
                    <TableCell>{sign.oxygen_saturation ? `${sign.oxygen_saturation}%` : "-"}</TableCell>
                    <TableCell>{sign.pain_level !== undefined && sign.pain_level !== null ? `${sign.pain_level}/10` : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Aucun relevé de signes vitaux enregistré
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter des signes vitaux</DialogTitle>
            <DialogDescription>
              Enregistrez les signes vitaux du patient. Remplissez uniquement les champs pertinents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">Température (°C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  placeholder="37.2"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="heartRate">Pouls (bpm)</Label>
                <Input
                  id="heartRate"
                  name="heartRate"
                  placeholder="80"
                  type="number"
                  value={formData.heartRate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodPressure">Tension artérielle</Label>
                <Input
                  id="bloodPressure"
                  name="bloodPressure"
                  placeholder="120/80"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="bloodSugar">Glycémie (g/L)</Label>
                <Input
                  id="bloodSugar"
                  name="bloodSugar"
                  placeholder="1.0"
                  type="number"
                  step="0.1"
                  value={formData.bloodSugar}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="oxygenSaturation">Saturation en O₂ (%)</Label>
                <Input
                  id="oxygenSaturation"
                  name="oxygenSaturation"
                  placeholder="98"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.oxygenSaturation}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="painLevel">Niveau de douleur (0-10)</Label>
                <Input
                  id="painLevel"
                  name="painLevel"
                  placeholder="3"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.painLevel}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Observations et commentaires"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="button"
              onClick={handleAddVitalSigns}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VitalSignsTab;
