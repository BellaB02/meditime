
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

interface CareType {
  id: string;
  code: string;
  description: string;
  rate: number;
  active: boolean;
}

export function CareTypesTab() {
  const [careTypes, setCareTypes] = useState<CareType[]>([
    { id: "1", code: "AMI1", description: "Injection", rate: 2.65, active: true },
    { id: "2", code: "AMI2", description: "Pansement simple", rate: 3.15, active: true },
    { id: "3", code: "AMI4", description: "Pansement complexe", rate: 4.25, active: true },
    { id: "4", code: "AMI5", description: "Perfusion", rate: 5.00, active: true }
  ]);
  const [editId, setEditId] = useState<string | null>(null);
  const [newCare, setNewCare] = useState({ code: "", description: "", rate: 0 });
  const [showNewCareForm, setShowNewCareForm] = useState(false);

  const handleEdit = (id: string) => {
    setEditId(id);
  };

  const handleSaveEdit = (id: string) => {
    setEditId(null);
    toast.success("Soin modifié avec succès");
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handleToggleActive = (id: string) => {
    setCareTypes(prevTypes => 
      prevTypes.map(care => 
        care.id === id ? { ...care, active: !care.active } : care
      )
    );
    
    const careType = careTypes.find(c => c.id === id);
    toast.success(`Le soin ${careType?.description} est maintenant ${careType?.active ? 'inactif' : 'actif'}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce soin ?")) {
      const careType = careTypes.find(c => c.id === id);
      setCareTypes(prevTypes => prevTypes.filter(care => care.id !== id));
      toast.success(`Le soin ${careType?.description} a été supprimé`);
    }
  };

  const handleAddNew = () => {
    if (!newCare.code || !newCare.description || newCare.rate <= 0) {
      toast.error("Veuillez remplir tous les champs correctement");
      return;
    }
    
    const newId = `${Date.now()}`;
    setCareTypes(prev => [...prev, {
      id: newId,
      code: newCare.code,
      description: newCare.description,
      rate: newCare.rate,
      active: true
    }]);
    
    setNewCare({ code: "", description: "", rate: 0 });
    setShowNewCareForm(false);
    toast.success("Nouveau soin ajouté avec succès");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Types de soins</CardTitle>
          <Button onClick={() => setShowNewCareForm(!showNewCareForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un soin
          </Button>
        </CardHeader>
        <CardContent>
          {showNewCareForm && (
            <Card className="mb-6 p-4 border-dashed">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="new-code">Code</Label>
                    <Input 
                      id="new-code" 
                      value={newCare.code} 
                      onChange={e => setNewCare({...newCare, code: e.target.value})}
                      placeholder="AMI1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-description">Description</Label>
                    <Input 
                      id="new-description" 
                      value={newCare.description} 
                      onChange={e => setNewCare({...newCare, description: e.target.value})}
                      placeholder="Injection"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-rate">Coût (€)</Label>
                    <Input 
                      id="new-rate" 
                      type="number" 
                      step="0.01"
                      value={newCare.rate} 
                      onChange={e => setNewCare({...newCare, rate: parseFloat(e.target.value) || 0})}
                      placeholder="2.65"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewCareForm(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddNew}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </Card>
          )}
        
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {careTypes.map(care => (
                <TableRow key={care.id}>
                  <TableCell>
                    {editId === care.id ? (
                      <Input defaultValue={care.code} className="w-full" />
                    ) : (
                      care.code
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === care.id ? (
                      <Input defaultValue={care.description} className="w-full" />
                    ) : (
                      care.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === care.id ? (
                      <Input type="number" step="0.01" defaultValue={care.rate} className="w-full" />
                    ) : (
                      `${care.rate} €`
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant={care.active ? "default" : "outline"} 
                      size="sm"
                      className={care.active ? "bg-green-500 hover:bg-green-600" : "text-red-500"}
                      onClick={() => handleToggleActive(care.id)}
                    >
                      {care.active ? 'Actif' : 'Inactif'}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    {editId === care.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(care.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(care.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(care.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
