
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareProtocolsService } from '@/hooks/useCareProtocolsService';
import { CareProtocol } from '@/integrations/supabase/services/types';
import { Plus, Edit, Trash2, Copy, FileDown, Search } from "lucide-react";
import { FormEvent } from 'react';

const CareProtocols = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProtocol, setNewProtocol] = useState({
    name: '',
    description: '',
    steps: [] as { title: string; description: string; required: boolean }[]
  });
  
  const { useCareProtocols, useCreateCareProtocol, useDeleteCareProtocol } = useCareProtocolsService();
  
  const { data: protocols, isLoading } = useCareProtocols();
  const createProtocolMutation = useCreateCareProtocol();
  const deleteProtocolMutation = useDeleteCareProtocol();
  
  const handleCreateProtocol = (e: FormEvent) => {
    e.preventDefault();
    
    if (!newProtocol.name.trim()) {
      toast.error("Le nom du protocole est requis");
      return;
    }
    
    createProtocolMutation.mutate({
      name: newProtocol.name,
      description: newProtocol.description,
      steps: newProtocol.steps.length > 0 ? newProtocol.steps : undefined
    }, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewProtocol({ name: '', description: '', steps: [] });
      }
    });
  };
  
  const handleDeleteProtocol = (protocolId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce protocole ?")) {
      deleteProtocolMutation.mutate(protocolId);
    }
  };
  
  const handleDuplicateProtocol = (protocol: CareProtocol) => {
    setNewProtocol({
      name: `Copie de ${protocol.name}`,
      description: protocol.description || '',
      steps: protocol.steps as any || []
    });
    setIsCreateDialogOpen(true);
  };
  
  const handleEditProtocol = (protocolId: string) => {
    navigate(`/care-protocols/${protocolId}`);
  };
  
  const filteredProtocols = protocols?.filter(protocol => 
    protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (protocol.description && protocol.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleAddStep = () => {
    setNewProtocol(prev => ({
      ...prev,
      steps: [...prev.steps, { title: '', description: '', required: true }]
    }));
  };
  
  const handleUpdateStep = (index: number, field: string, value: any) => {
    setNewProtocol(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? { ...step, [field]: value } : step)
    }));
  };
  
  const handleRemoveStep = (index: number) => {
    setNewProtocol(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Protocoles de Soins</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Nouveau Protocole
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Rechercher un protocole..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tous les protocoles</TabsTrigger>
          <TabsTrigger value="my">Mes protocoles</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredProtocols?.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchQuery ? "Aucun protocole ne correspond à votre recherche" : "Aucun protocole disponible"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProtocols?.map(protocol => (
                <Card key={protocol.id}>
                  <CardHeader>
                    <CardTitle>{protocol.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {protocol.created_at && new Date(protocol.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">
                      {protocol.description || "Aucune description"}
                    </p>
                    <div className="mt-2 text-sm">
                      {(protocol.steps as any)?.length || 0} étape(s)
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditProtocol(protocol.id)}>
                      <Edit size={16} className="mr-1" /> Modifier
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicateProtocol(protocol)}>
                        <Copy size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileDown size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProtocol(protocol.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my">
          <div className="text-center py-10 text-muted-foreground">
            Mes protocoles personnalisés
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="text-center py-10 text-muted-foreground">
            Vos protocoles favoris s'afficheront ici
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog de création de protocole */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau protocole de soins</DialogTitle>
            <DialogDescription>
              Définissez les détails et les étapes du protocole.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateProtocol} className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Nom du protocole *</Label>
                <Input
                  id="name"
                  value={newProtocol.name}
                  onChange={(e) => setNewProtocol(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du protocole"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProtocol.description}
                  onChange={(e) => setNewProtocol(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du protocole"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Étapes du protocole</Label>
                  <Button type="button" variant="outline" onClick={handleAddStep} className="flex items-center gap-1">
                    <Plus size={16} /> Ajouter une étape
                  </Button>
                </div>
                
                {newProtocol.steps.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-md">
                    Aucune étape définie. Cliquez sur "Ajouter une étape" pour commencer.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {newProtocol.steps.map((step, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Étape {index + 1}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveStep(index)}
                            className="h-6 w-6 text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createProtocolMutation.isPending}>
                {createProtocolMutation.isPending ? "Création en cours..." : "Créer le protocole"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareProtocols;
