
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Plus, Save, Edit, Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Types pour les actes de soins
interface NursingAct {
  id: string;
  code: string;
  description: string;
  rate: number;
  active: boolean;
}

// Types pour les majorations
interface Majoration {
  id: string;
  code: string;
  description: string;
  rate: number;
  active: boolean;
}

export const PricingTab = () => {
  // États pour les actes et majorations
  const [nursingActs, setNursingActs] = useState<NursingAct[]>([
    { id: "1", code: "AMI 1", description: "Acte médico-infirmier", rate: 3.15, active: true },
    { id: "2", code: "AMI 1.5", description: "Acte médico-infirmier complexe", rate: 4.73, active: true },
    { id: "3", code: "AMI 2", description: "Acte médico-infirmier très complexe", rate: 6.30, active: true },
    { id: "4", code: "DI", description: "Démarche de soins infirmiers", rate: 10.00, active: true },
  ]);
  
  const [majorations, setMajorations] = useState<Majoration[]>([
    { id: "1", code: "MD", description: "Majoration dimanche", rate: 8.50, active: true },
    { id: "2", code: "MN", description: "Majoration nuit (20h à 6h)", rate: 9.50, active: true },
    { id: "3", code: "MAU", description: "Majoration acte unique", rate: 1.35, active: true },
  ]);

  // État pour les dialogues
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<NursingAct | Majoration | null>(null);
  const [isActType, setIsActType] = useState(true);
  const [editedValue, setEditedValue] = useState("");
  
  // États pour l'ajout d'un nouvel acte/majoration
  const [newCode, setNewCode] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newRate, setNewRate] = useState("");

  // Fonction pour ouvrir le dialogue d'édition
  const handleEdit = (item: NursingAct | Majoration, isAct: boolean) => {
    setCurrentItem(item);
    setIsActType(isAct);
    setEditedValue(item.rate.toString());
    setIsEditDialogOpen(true);
  };

  // Fonction pour sauvegarder les modifications
  const handleSave = () => {
    if (!currentItem) return;
    
    const newRate = parseFloat(editedValue);
    if (isNaN(newRate)) {
      toast.error("Veuillez entrer un tarif valide");
      return;
    }
    
    if (isActType) {
      setNursingActs(nursingActs.map(act => 
        act.id === currentItem.id ? { ...act, rate: newRate } : act
      ));
    } else {
      setMajorations(majorations.map(maj => 
        maj.id === currentItem.id ? { ...maj, rate: newRate } : maj
      ));
    }
    
    toast.success("Tarif mis à jour avec succès");
    setIsEditDialogOpen(false);
  };

  // Fonction pour ajouter un nouvel acte/majoration
  const handleAdd = (isAct: boolean) => {
    setIsActType(isAct);
    setNewCode("");
    setNewDescription("");
    setNewRate("");
    setIsAddDialogOpen(true);
  };

  // Fonction pour sauvegarder un nouvel acte/majoration
  const handleSaveNew = () => {
    if (!newCode || !newDescription || !newRate) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    const rateValue = parseFloat(newRate);
    if (isNaN(rateValue)) {
      toast.error("Veuillez entrer un tarif valide");
      return;
    }
    
    const newItem = {
      id: Date.now().toString(),
      code: newCode,
      description: newDescription,
      rate: rateValue,
      active: true
    };
    
    if (isActType) {
      setNursingActs([...nursingActs, newItem]);
      toast.success(`Acte "${newCode}" ajouté avec succès`);
    } else {
      setMajorations([...majorations, newItem]);
      toast.success(`Majoration "${newCode}" ajoutée avec succès`);
    }
    
    setIsAddDialogOpen(false);
  };

  // Fonction pour basculer l'état actif/inactif
  const toggleActive = (id: string, isAct: boolean) => {
    if (isAct) {
      setNursingActs(nursingActs.map(act => 
        act.id === id ? { ...act, active: !act.active } : act
      ));
      
      const act = nursingActs.find(a => a.id === id);
      if (act) {
        toast.success(`Acte "${act.code}" ${!act.active ? "activé" : "désactivé"}`);
      }
    } else {
      setMajorations(majorations.map(maj => 
        maj.id === id ? { ...maj, active: !maj.active } : maj
      ));
      
      const maj = majorations.find(m => m.id === id);
      if (maj) {
        toast.success(`Majoration "${maj.code}" ${!maj.active ? "activée" : "désactivée"}`);
      }
    }
  };

  // Fonction pour sauvegarder tous les changements
  const handleSaveAll = () => {
    toast.success("Tous les tarifs ont été sauvegardés");
  };
  
  // Fonction pour exporter les tarifs en PDF
  const handleExportPrices = () => {
    toast.success("Exportation des tarifs en PDF");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-1">Gestion des tarifs</h2>
          <p className="text-sm text-muted-foreground">
            Configurez les tarifs des actes de soins et majorations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPrices}>
            <FileText className="mr-2 h-4 w-4" />
            Exporter les tarifs
          </Button>
          <Button onClick={handleSaveAll}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Actes de soins</CardTitle>
            <CardDescription>
              Tarification des actes de soins selon la nomenclature NGAP
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => handleAdd(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un acte
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nursingActs.map((act) => (
                <TableRow key={act.id} className={!act.active ? "opacity-50" : ""}>
                  <TableCell className="font-medium">{act.code}</TableCell>
                  <TableCell>{act.description}</TableCell>
                  <TableCell>{act.rate.toFixed(2)} €</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={act.active} 
                        onCheckedChange={() => toggleActive(act.id, true)}
                        aria-label={`Activer/Désactiver ${act.code}`}
                      />
                      <span>{act.active ? "Actif" : "Inactif"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(act, true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Majorations</CardTitle>
            <CardDescription>
              Tarification des majorations applicables
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => handleAdd(false)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une majoration
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {majorations.map((maj) => (
                <TableRow key={maj.id} className={!maj.active ? "opacity-50" : ""}>
                  <TableCell className="font-medium">{maj.code}</TableCell>
                  <TableCell>{maj.description}</TableCell>
                  <TableCell>{maj.rate.toFixed(2)} €</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={maj.active} 
                        onCheckedChange={() => toggleActive(maj.id, false)}
                        aria-label={`Activer/Désactiver ${maj.code}`}
                      />
                      <span>{maj.active ? "Actif" : "Inactif"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(maj, false)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for editing a care act or majoration */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le tarif</DialogTitle>
            <DialogDescription>
              Modifiez le tarif pour {currentItem?.code} - {currentItem?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rate">Tarif (€)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding a new care act or majoration */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isActType ? "Ajouter un acte de soin" : "Ajouter une majoration"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="mt-1"
                placeholder="AMI 1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mt-1"
                placeholder="Acte médico-infirmier"
              />
            </div>
            <div>
              <Label htmlFor="newRate">Tarif (€)</Label>
              <Input
                id="newRate"
                type="number"
                step="0.01"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                className="mt-1"
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveNew}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingTab;
