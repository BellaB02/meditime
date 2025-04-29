
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCareProtocolsService } from '@/hooks/useCareProtocolsService';
import { ChevronLeft, Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CareProtocolEditor = () => {
  const navigate = useNavigate();
  const { protocolId } = useParams();
  const { useCareProtocol, useUpdateCareProtocol } = useCareProtocolsService();
  
  const { data: protocol, isLoading } = useCareProtocol(protocolId || '');
  const updateProtocolMutation = useUpdateCareProtocol();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    steps: [] as { title: string; description: string; required: boolean }[]
  });
  
  // Initialiser le formulaire avec les données du protocole
  useEffect(() => {
    if (protocol) {
      setFormData({
        name: protocol.name,
        description: protocol.description || '',
        steps: protocol.steps as any || []
      });
    }
  }, [protocol]);
  
  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { title: '', description: '', required: true }]
    }));
  };
  
  const handleUpdateStep = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? { ...step, [field]: value } : step)
    }));
  };
  
  const handleRemoveStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };
  
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formData.steps.length - 1)
    ) {
      return;
    }
    
    const newSteps = [...formData.steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    
    setFormData(prev => ({
      ...prev,
      steps: newSteps
    }));
  };
  
  const handleDragEnd = (result: any) => {
    // Si l'élément a été déposé en dehors de la zone
    if (!result.destination) return;
    
    // Si l'élément n'a pas changé de position
    if (result.destination.index === result.source.index) return;
    
    // Copie des étapes
    const newSteps = [...formData.steps];
    
    // Retrait de l'élément de sa position initiale
    const [movedStep] = newSteps.splice(result.source.index, 1);
    
    // Insertion de l'élément à sa nouvelle position
    newSteps.splice(result.destination.index, 0, movedStep);
    
    // Mise à jour de l'état
    setFormData(prev => ({
      ...prev,
      steps: newSteps
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!protocolId) return;
    
    if (!formData.name.trim()) {
      toast.error("Le nom du protocole est requis");
      return;
    }
    
    updateProtocolMutation.mutate({
      protocolId,
      data: {
        name: formData.name,
        description: formData.description,
        steps: formData.steps
      }
    }, {
      onSuccess: () => {
        toast.success("Protocole mis à jour avec succès");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }
  
  if (!protocol && !isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center p-10">
          <h2 className="text-xl font-semibold mb-2">Protocole non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le protocole que vous cherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/care-protocols')}>
            Retour à la liste des protocoles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/care-protocols')} className="mr-2">
            <ChevronLeft size={16} />
          </Button>
          <h1 className="text-2xl font-bold">Édition de protocole</h1>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={updateProtocolMutation.isPending}
          className="flex items-center gap-2"
        >
          <Save size={16} /> Enregistrer
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Nom du protocole *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du protocole"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du protocole"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Étapes du protocole</h2>
            <Button type="button" variant="outline" onClick={handleAddStep} className="flex items-center gap-1">
              <Plus size={16} /> Ajouter une étape
            </Button>
          </div>
          
          {formData.steps.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Ce protocole ne contient aucune étape.
                <br />
                Cliquez sur "Ajouter une étape" pour commencer.
              </CardContent>
            </Card>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="steps">
                {(provided) => (
                  <div 
                    className="space-y-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {formData.steps.map((step, index) => (
                      <Draggable 
                        key={`step-${index}`} 
                        draggableId={`step-${index}`} 
                        index={index}
                      >
                        {(provided) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-4">
                                <div 
                                  className="flex items-center gap-2 cursor-move"
                                  {...provided.dragHandleProps}
                                >
                                  <span className="font-medium">Étape {index + 1}</span>
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => moveStep(index, 'up')}
                                    disabled={index === 0}
                                    className="h-7 w-7"
                                  >
                                    <ArrowUp size={14} />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => moveStep(index, 'down')}
                                    disabled={index === formData.steps.length - 1}
                                    className="h-7 w-7"
                                  >
                                    <ArrowDown size={14} />
                                  </Button>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleRemoveStep(index)}
                                    className="h-7 w-7 text-destructive"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid gap-3">
                                <div>
                                  <Label htmlFor={`step-${index}-title`}>Titre</Label>
                                  <Input
                                    id={`step-${index}-title`}
                                    value={step.title}
                                    onChange={(e) => handleUpdateStep(index, 'title', e.target.value)}
                                    placeholder="Titre de l'étape"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`step-${index}-description`}>Description</Label>
                                  <Textarea
                                    id={`step-${index}-description`}
                                    value={step.description}
                                    onChange={(e) => handleUpdateStep(index, 'description', e.target.value)}
                                    placeholder="Description détaillée"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`step-${index}-required`}
                                    checked={step.required}
                                    onChange={(e) => handleUpdateStep(index, 'required', e.target.checked)}
                                  />
                                  <Label htmlFor={`step-${index}-required`}>Étape requise</Label>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </form>
    </div>
  );
};

export default CareProtocolEditor;
