
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Thermometer, Heart, Activity, Edit, Trash2 } from "lucide-react";
import { LegacyVitalSign } from "@/integrations/supabase/services/types"; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PatientService } from "@/services/PatientService";

export type VitalSignsTabProps = {
  vitalSigns?: LegacyVitalSign[];
  patientId?: string;
};

const VitalSignsTab: React.FC<VitalSignsTabProps> = ({ vitalSigns: initialVitalSigns = [], patientId }) => {
  const [vitalSigns, setVitalSigns] = useState<LegacyVitalSign[]>(initialVitalSigns);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  
  // Valeurs pour l'ajout/édition
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [notes, setNotes] = useState("");
  
  // Charger les signes vitaux du patient si patientId est fourni
  useEffect(() => {
    if (patientId) {
      const patientVitalSigns = PatientService.getVitalSigns(patientId);
      if (patientVitalSigns.length > 0) {
        setVitalSigns(patientVitalSigns);
      }
    }
  }, [patientId]);
  
  const resetForm = () => {
    setTemperature("");
    setHeartRate("");
    setBloodPressure("");
    setNotes("");
  };
  
  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (index: number) => {
    const sign = vitalSigns[index];
    setTemperature(sign.temperature.replace("°C", ""));
    setHeartRate(sign.heartRate.replace(" bpm", ""));
    setBloodPressure(sign.bloodPressure);
    setNotes(sign.notes);
    setEditIndex(index);
    setIsEditDialogOpen(true);
  };
  
  const handleAddVitalSign = () => {
    if (!temperature || !heartRate || !bloodPressure) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const newVitalSign: LegacyVitalSign = {
      date: "Aujourd'hui",
      temperature: `${temperature}°C`,
      heartRate: `${heartRate} bpm`,
      bloodPressure: bloodPressure,
      notes: notes
    };
    
    // Si patientId est fourni, ajouter le signe vital au service
    if (patientId) {
      PatientService.addVitalSign(patientId, newVitalSign);
    }
    
    setVitalSigns([newVitalSign, ...vitalSigns]);
    toast.success("Mesure ajoutée avec succès");
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const handleUpdateVitalSign = () => {
    if (editIndex === null) return;
    
    if (!temperature || !heartRate || !bloodPressure) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const updatedVitalSigns = [...vitalSigns];
    updatedVitalSigns[editIndex] = {
      ...updatedVitalSigns[editIndex],
      temperature: `${temperature}°C`,
      heartRate: `${heartRate} bpm`,
      bloodPressure: bloodPressure,
      notes: notes
    };
    
    setVitalSigns(updatedVitalSigns);
    toast.success("Mesure mise à jour avec succès");
    setIsEditDialogOpen(false);
    resetForm();
  };
  
  const handleDeleteVitalSign = (index: number) => {
    const updatedVitalSigns = vitalSigns.filter((_, i) => i !== index);
    setVitalSigns(updatedVitalSigns);
    toast.success("Mesure supprimée");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Suivi des constantes</CardTitle>
        <Button size="sm" onClick={handleOpenAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter mesure
        </Button>
      </CardHeader>
      <CardContent>
        {vitalSigns.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Thermometer size={14} /> Température
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Heart size={14} /> Pouls
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Activity size={14} /> Tension
                  </div>
                </TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vitalSigns.map((sign, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{sign.date}</TableCell>
                  <TableCell>{sign.temperature}</TableCell>
                  <TableCell>{sign.heartRate}</TableCell>
                  <TableCell>{sign.bloodPressure}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{sign.notes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(index)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteVitalSign(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucune constante enregistrée pour ce patient
          </div>
        )}
      </CardContent>
      
      {/* Dialog pour ajouter une nouvelle mesure */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle mesure</DialogTitle>
            <DialogDescription>
              Enregistrez les constantes vitales du patient
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Température (°C)</Label>
                <Input 
                  id="temperature" 
                  type="number" 
                  step="0.1" 
                  placeholder="37.0" 
                  value={temperature} 
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartRate">Pouls (bpm)</Label>
                <Input 
                  id="heartRate" 
                  type="number" 
                  placeholder="75" 
                  value={heartRate} 
                  onChange={(e) => setHeartRate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Tension artérielle</Label>
              <Input 
                id="bloodPressure" 
                placeholder="120/80" 
                value={bloodPressure} 
                onChange={(e) => setBloodPressure(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Observations et remarques" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddVitalSign}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour éditer une mesure existante */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la mesure</DialogTitle>
            <DialogDescription>
              Mettez à jour les constantes vitales du patient
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-temperature">Température (°C)</Label>
                <Input 
                  id="edit-temperature" 
                  type="number" 
                  step="0.1" 
                  placeholder="37.0" 
                  value={temperature} 
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-heartRate">Pouls (bpm)</Label>
                <Input 
                  id="edit-heartRate" 
                  type="number" 
                  placeholder="75" 
                  value={heartRate} 
                  onChange={(e) => setHeartRate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bloodPressure">Tension artérielle</Label>
              <Input 
                id="edit-bloodPressure" 
                placeholder="120/80" 
                value={bloodPressure} 
                onChange={(e) => setBloodPressure(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea 
                id="edit-notes" 
                placeholder="Observations et remarques" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateVitalSign}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VitalSignsTab;
