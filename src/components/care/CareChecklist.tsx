
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, ListCheck, Save, File } from "lucide-react";

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  notes?: string;
}

export interface Checklist {
  id: string;
  name: string;
  description?: string;
  isTemplate?: boolean;
  items: ChecklistItem[];
  createdAt?: string;
  lastModified?: string;
}

interface CareChecklistProps {
  checklist?: Checklist;
  appointmentId?: string;
  patientId?: string;
  isEditable?: boolean;
  onSave?: (checklist: Checklist) => void;
  onComplete?: (completedItems: ChecklistItem[]) => void;
}

export const CareChecklist: React.FC<CareChecklistProps> = ({
  checklist,
  appointmentId,
  patientId,
  isEditable = true,
  onSave,
  onComplete
}) => {
  const [currentChecklist, setCurrentChecklist] = useState<Checklist>(
    checklist || {
      id: `checklist-${Date.now()}`,
      name: "",
      items: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  // Templates simulés
  const checklistTemplates: Checklist[] = [
    {
      id: "template-1",
      name: "Pansement complexe",
      description: "Protocole pour pansements complexes",
      isTemplate: true,
      items: [
        { id: "t1-item1", text: "Vérifier le dossier patient et les antécédents", isCompleted: false },
        { id: "t1-item2", text: "Préparer le matériel stérile", isCompleted: false },
        { id: "t1-item3", text: "Retirer l'ancien pansement", isCompleted: false },
        { id: "t1-item4", text: "Nettoyer la plaie avec solution saline", isCompleted: false },
        { id: "t1-item5", text: "Évaluer l'état de la plaie", isCompleted: false },
        { id: "t1-item6", text: "Appliquer le nouveau pansement", isCompleted: false },
        { id: "t1-item7", text: "Documenter l'état de la plaie et les soins", isCompleted: false }
      ]
    },
    {
      id: "template-2",
      name: "Pose de perfusion",
      description: "Vérification pour pose de perfusion",
      isTemplate: true,
      items: [
        { id: "t2-item1", text: "Vérifier l'identité du patient", isCompleted: false },
        { id: "t2-item2", text: "Vérifier prescription et produit à injecter", isCompleted: false },
        { id: "t2-item3", text: "Réaliser l'asepsie du point de ponction", isCompleted: false },
        { id: "t2-item4", text: "Poser le cathéter et vérifier son bon fonctionnement", isCompleted: false },
        { id: "t2-item5", text: "Fixer le cathéter et le tubulure", isCompleted: false },
        { id: "t2-item6", text: "Régler le débit de la perfusion", isCompleted: false }
      ]
    }
  ];

  const handleToggleItem = (itemId: string) => {
    const updatedItems = currentChecklist.items.map(item => {
      if (item.id === itemId) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });
    
    setCurrentChecklist({
      ...currentChecklist,
      items: updatedItems,
      lastModified: new Date().toISOString()
    });
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) {
      toast.error("Veuillez entrer le texte de l'élément");
      return;
    }
    
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      text: newItemText.trim(),
      isCompleted: false
    };
    
    setCurrentChecklist({
      ...currentChecklist,
      items: [...currentChecklist.items, newItem],
      lastModified: new Date().toISOString()
    });
    
    setNewItemText("");
    setIsDialogOpen(false);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = currentChecklist.items.filter(item => item.id !== itemId);
    
    setCurrentChecklist({
      ...currentChecklist,
      items: updatedItems,
      lastModified: new Date().toISOString()
    });
  };

  const handleSaveChecklist = () => {
    if (!currentChecklist.name) {
      toast.error("Veuillez donner un nom à cette checklist");
      return;
    }
    
    if (currentChecklist.items.length === 0) {
      toast.error("Ajoutez au moins un élément à la checklist");
      return;
    }
    
    // Appeler la fonction onSave si elle est fournie
    if (onSave) {
      onSave(currentChecklist);
    }
    
    toast.success("Checklist sauvegardée avec succès");
  };

  const handleCompleteChecklist = () => {
    const completedItems = currentChecklist.items.filter(item => item.isCompleted);
    const incompleteItems = currentChecklist.items.filter(item => !item.isCompleted);
    
    if (incompleteItems.length > 0) {
      const confirmComplete = window.confirm(
        `Il reste ${incompleteItems.length} élément(s) non complété(s). Voulez-vous tout de même marquer la checklist comme terminée?`
      );
      
      if (!confirmComplete) {
        return;
      }
    }
    
    if (onComplete) {
      onComplete(completedItems);
    }
    
    toast.success("Checklist marquée comme terminée");
  };

  const handleUseTemplate = () => {
    if (!selectedTemplateId) {
      toast.error("Veuillez sélectionner un modèle");
      return;
    }
    
    const template = checklistTemplates.find(t => t.id === selectedTemplateId);
    
    if (!template) {
      toast.error("Modèle non trouvé");
      return;
    }
    
    const templateItems = template.items.map(item => ({
      ...item,
      id: `item-${Date.now()}-${item.id}`,
      isCompleted: false
    }));
    
    setCurrentChecklist({
      ...currentChecklist,
      name: template.name,
      description: template.description,
      items: templateItems,
      lastModified: new Date().toISOString()
    });
    
    setSelectedTemplateId("");
    toast.success("Modèle appliqué avec succès");
  };

  const calculateProgress = () => {
    if (currentChecklist.items.length === 0) return 0;
    const completedCount = currentChecklist.items.filter(item => item.isCompleted).length;
    return Math.round((completedCount / currentChecklist.items.length) * 100);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">
            {currentChecklist.name || "Nouvelle checklist"}
          </CardTitle>
          {currentChecklist.description && (
            <p className="text-sm text-muted-foreground">{currentChecklist.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          {isEditable && (
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Utiliser un modèle" />
              </SelectTrigger>
              <SelectContent>
                {checklistTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {selectedTemplateId && (
            <Button variant="outline" onClick={handleUseTemplate}>
              Appliquer
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Progression</span>
            <span>{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
        
        {/* Checklist items */}
        <div className="space-y-3">
          {currentChecklist.items.length > 0 ? (
            currentChecklist.items.map((item) => (
              <div key={item.id} className="flex items-start space-x-2 p-2 rounded-md bg-gray-50 hover:bg-gray-100">
                <Checkbox
                  id={item.id}
                  checked={item.isCompleted}
                  onCheckedChange={() => handleToggleItem(item.id)}
                  className="mt-1"
                />
                <Label
                  htmlFor={item.id}
                  className={`flex-1 cursor-pointer ${item.isCompleted ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.text}
                  {item.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                  )}
                </Label>
                {isEditable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveItem(item.id)}
                    className="h-8 opacity-50 hover:opacity-100"
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <ListCheck className="mx-auto h-8 w-8 mb-2" />
              <p>Cette checklist est vide</p>
              {isEditable && (
                <p className="text-sm">Ajoutez des éléments ou utilisez un modèle</p>
              )}
            </div>
          )}
          
          {/* Controls */}
          <div className="pt-4 flex justify-between">
            <div className="space-x-2">
              {isEditable && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un élément
                </Button>
              )}
            </div>
            <div className="space-x-2">
              {isEditable && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveChecklist}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              )}
              <Button 
                variant="default" 
                size="sm"
                onClick={handleCompleteChecklist}
                disabled={currentChecklist.items.length === 0}
              >
                Terminer la checklist
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Dialog pour ajouter un élément */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un élément à la checklist</DialogTitle>
            <DialogDescription>
              Créez un nouvel élément à vérifier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="itemText">Texte de l'élément</Label>
              <Textarea
                id="itemText"
                placeholder="ex: Vérifier les signes vitaux"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddItem}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CareChecklist;
