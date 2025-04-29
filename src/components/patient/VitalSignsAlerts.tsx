
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VitalSignsAlertsProps {
  patientId: string;
}

interface VitalAlert {
  id: string;
  vitalType: string;
  minValue: number | null;
  maxValue: number | null;
  active: boolean;
}

const VitalSignsAlerts: React.FC<VitalSignsAlertsProps> = ({ patientId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alerts, setAlerts] = useState<VitalAlert[]>([
    {
      id: "alert-1",
      vitalType: "temperature",
      minValue: 36,
      maxValue: 38,
      active: true
    },
    {
      id: "alert-2",
      vitalType: "heartRate",
      minValue: 60,
      maxValue: 100,
      active: true
    },
    {
      id: "alert-3",
      vitalType: "bloodSugar",
      minValue: 0.7,
      maxValue: 1.2,
      active: true
    }
  ]);

  const [newAlert, setNewAlert] = useState<{
    vitalType: string;
    minValue: string;
    maxValue: string;
  }>({
    vitalType: "",
    minValue: "",
    maxValue: ""
  });

  const vitalTypes = [
    { value: "temperature", label: "Température (°C)" },
    { value: "heartRate", label: "Rythme cardiaque (bpm)" },
    { value: "bloodPressureSystolic", label: "Tension artérielle - Systolique" },
    { value: "bloodPressureDiastolic", label: "Tension artérielle - Diastolique" },
    { value: "bloodSugar", label: "Glycémie (g/L)" },
    { value: "oxygenSaturation", label: "Saturation en oxygène (%)" },
    { value: "painLevel", label: "Niveau de douleur (0-10)" }
  ];

  const handleAddAlert = () => {
    if (!newAlert.vitalType || (!newAlert.minValue && !newAlert.maxValue)) {
      toast.error("Veuillez remplir au moins un seuil (min ou max) et sélectionner un type");
      return;
    }

    const alert: VitalAlert = {
      id: `alert-${Date.now()}`,
      vitalType: newAlert.vitalType,
      minValue: newAlert.minValue ? parseFloat(newAlert.minValue) : null,
      maxValue: newAlert.maxValue ? parseFloat(newAlert.maxValue) : null,
      active: true
    };

    setAlerts([...alerts, alert]);
    toast.success("Alerte ajoutée avec succès");
    setIsDialogOpen(false);
    setNewAlert({ vitalType: "", minValue: "", maxValue: "" });
  };

  const handleToggleAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, active: !alert.active } 
        : alert
    ));
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    toast.success("Alerte supprimée");
  };

  const getVitalTypeLabel = (type: string) => {
    const vitalType = vitalTypes.find(vt => vt.value === type);
    return vitalType ? vitalType.label : type;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Alertes de paramètres vitaux</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une alerte
          </Button>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`flex justify-between items-center p-3 rounded-md border ${alert.active ? 'bg-red-50/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`h-5 w-5 ${alert.active ? 'text-red-500' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">{getVitalTypeLabel(alert.vitalType)}</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.minValue !== null && alert.maxValue !== null && (
                          <>Entre {alert.minValue} et {alert.maxValue}</>
                        )}
                        {alert.minValue !== null && alert.maxValue === null && (
                          <>Minimum: {alert.minValue}</>
                        )}
                        {alert.minValue === null && alert.maxValue !== null && (
                          <>Maximum: {alert.maxValue}</>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant={alert.active ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => handleToggleAlert(alert.id)}
                    >
                      {alert.active ? "Actif" : "Inactif"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
              <p>Aucune alerte configurée</p>
              <p className="text-sm">Ajoutez des alertes pour être notifié lorsque les valeurs sortent des plages normales</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une alerte</DialogTitle>
            <DialogDescription>
              Configurez les seuils d'alerte pour ce patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vitalType">Type de paramètre</Label>
              <Select 
                value={newAlert.vitalType} 
                onValueChange={(value) => setNewAlert({...newAlert, vitalType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un paramètre" />
                </SelectTrigger>
                <SelectContent>
                  {vitalTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minValue">Valeur minimale</Label>
                <Input 
                  id="minValue"
                  type="number"
                  step="0.1"
                  placeholder="Min"
                  value={newAlert.minValue}
                  onChange={(e) => setNewAlert({...newAlert, minValue: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxValue">Valeur maximale</Label>
                <Input 
                  id="maxValue"
                  type="number"
                  step="0.1"
                  placeholder="Max"
                  value={newAlert.maxValue}
                  onChange={(e) => setNewAlert({...newAlert, maxValue: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddAlert}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VitalSignsAlerts;
