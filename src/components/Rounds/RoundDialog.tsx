
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Round, RoundStop } from "@/types/rounds";

interface RoundDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (round: Omit<Round, 'id'> | Round) => void;
  initialData?: Round;
  title: string;
  description: string;
  actionLabel: string;
}

export const RoundDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  description,
  actionLabel
}: RoundDialogProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    date: string;
    stops: RoundStop[];
  }>({
    name: initialData?.name || "",
    date: initialData?.date || new Date().toLocaleDateString('fr-FR'),
    stops: initialData?.stops || []
  });
  
  const [stopData, setStopData] = useState({
    patientName: "",
    patientAddress: "",
    time: "",
    care: ""
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleStopChange = (field: string, value: string) => {
    setStopData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const addStop = () => {
    const newStop: RoundStop = {
      id: `stop-${Date.now()}`,
      patient: {
        name: stopData.patientName,
        address: stopData.patientAddress
      },
      time: stopData.time,
      care: stopData.care,
      completed: false
    };
    
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, newStop]
    }));
    
    // Reset stop form
    setStopData({
      patientName: "",
      patientAddress: "",
      time: "",
      care: ""
    });
  };
  
  const removeStop = (stopId: string) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter(stop => stop.id !== stopId)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      return;
    }
    
    if (initialData) {
      onSubmit({
        ...initialData,
        name: formData.name,
        date: formData.date,
        stops: formData.stops
      });
    } else {
      onSubmit({
        name: formData.name,
        date: formData.date,
        stops: formData.stops
      });
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="roundName">Nom de la tournée</Label>
                <Input
                  id="roundName"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Ex: Tournée du matin"
                  required
                />
              </div>
              <div>
                <Label htmlFor="roundDate">Date</Label>
                <Input
                  id="roundDate"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  placeholder="JJ/MM/AAAA"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Arrêts</h3>
              {formData.stops.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun arrêt ajouté. Ajoutez des arrêts ci-dessous.</p>
              ) : (
                <div className="space-y-3">
                  {formData.stops.map((stop) => (
                    <div key={stop.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{stop.patient.name}</p>
                        <p className="text-sm text-muted-foreground">{stop.time} • {stop.care}</p>
                        <p className="text-xs text-muted-foreground">{stop.patient.address}</p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeStop(stop.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="text-md font-medium">Ajouter un arrêt</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="patientName">Nom du patient</Label>
                  <Input
                    id="patientName"
                    value={stopData.patientName}
                    onChange={(e) => handleStopChange("patientName", e.target.value)}
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    value={stopData.time}
                    onChange={(e) => handleStopChange("time", e.target.value)}
                    placeholder="Ex: 09:30"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={stopData.patientAddress}
                    onChange={(e) => handleStopChange("patientAddress", e.target.value)}
                    placeholder="Ex: 15 Rue de Paris, 75001 Paris"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="care">Soin</Label>
                  <Input
                    id="care"
                    value={stopData.care}
                    onChange={(e) => handleStopChange("care", e.target.value)}
                    placeholder="Ex: Prise de sang"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={addStop}
                    disabled={!stopData.patientName || !stopData.patientAddress || !stopData.time || !stopData.care}
                  >
                    Ajouter cet arrêt
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={formData.name.trim() === "" || formData.stops.length === 0}>
              {actionLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
