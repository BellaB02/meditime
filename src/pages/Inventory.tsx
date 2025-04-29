
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, AlertTriangle, Clock, File } from "lucide-react";
import { inventoryService } from "@/integrations/supabase/services/inventoryService";

// Type pour les articles d'inventaire
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentQuantity: number;
  minQuantity: number;
  expiryDate?: string;
  notes?: string;
}

// Type pour les transactions d'inventaire
interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  transactionType: 'in' | 'out';
  quantity: number;
  reason?: string;
  date: string;
  batchNumber?: string;
  expiryDate?: string;
}

export default function Inventory() {
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [transactionQuantity, setTransactionQuantity] = useState<number>(0);
  const [transactionReason, setTransactionReason] = useState<string>("");
  const [batchNumber, setBatchNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  
  // État pour un nouvel article
  const [newItem, setNewItem] = useState<{
    name: string;
    category: string;
    unit: string;
    currentQuantity: string;
    minQuantity: string;
    expiryDate?: string;
    notes?: string;
  }>({
    name: "",
    category: "",
    unit: "unité",
    currentQuantity: "0",
    minQuantity: "0"
  });

  // Simuler des articles d'inventaire
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Categories disponibles
  const categories = [
    "Pansements",
    "Aiguilles",
    "Seringues",
    "Gants",
    "Compresses",
    "Désinfectants",
    "Médicaments",
    "Matériel de perfusion",
    "Autre"
  ];

  // Unités disponibles
  const units = [
    "unité",
    "boîte",
    "paquet",
    "flacon",
    "ampoule",
    "litre",
    "ml",
    "gramme",
    "pièce"
  ];

  // Charger les données
  useEffect(() => {
    async function loadInventory() {
      setIsLoading(true);
      try {
        // Données simulées en attendant l'implémentation complète
        const items = [
          {
            id: "item-1",
            name: "Compresses stériles 10x10cm",
            category: "Compresses",
            unit: "boîte",
            currentQuantity: 15,
            minQuantity: 5,
            expiryDate: "2026-04-29",
            notes: "Boîtes de 10 compresses"
          },
          {
            id: "item-2",
            name: "Seringues 10ml",
            category: "Seringues",
            unit: "unité",
            currentQuantity: 50,
            minQuantity: 20,
            expiryDate: "2026-01-15"
          },
          {
            id: "item-3",
            name: "Gants d'examen taille M",
            category: "Gants",
            unit: "boîte",
            currentQuantity: 3,
            minQuantity: 5,
            notes: "Boîte de 100 gants"
          },
          {
            id: "item-4",
            name: "Pansements adhésifs",
            category: "Pansements",
            unit: "boîte",
            currentQuantity: 8,
            minQuantity: 3
          }
        ];
        
        // Simuler des transactions
        const transactionsData = [
          {
            id: "trans-1",
            itemId: "item-1",
            itemName: "Compresses stériles 10x10cm",
            transactionType: 'in' as 'in',
            quantity: 5,
            reason: "Approvisionnement",
            date: "15/04/2025",
            batchNumber: "LOT2025-234",
            expiryDate: "29/04/2026"
          },
          {
            id: "trans-2",
            itemId: "item-3",
            itemName: "Gants d'examen taille M",
            transactionType: 'out' as 'out',
            quantity: 1,
            reason: "Utilisation tournée",
            date: "14/04/2025"
          }
        ];
        
        setInventoryItems(items);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Erreur lors du chargement de l'inventaire:", error);
        toast.error("Erreur lors du chargement de l'inventaire");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadInventory();
  }, []);

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    // Vérification des champs
    if (!newItem.name || !newItem.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const item: InventoryItem = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      unit: newItem.unit,
      currentQuantity: parseFloat(newItem.currentQuantity),
      minQuantity: parseFloat(newItem.minQuantity),
      expiryDate: newItem.expiryDate,
      notes: newItem.notes
    };

    setInventoryItems([...inventoryItems, item]);
    toast.success("Article ajouté à l'inventaire");
    setIsAddItemDialogOpen(false);
    
    // Réinitialiser le formulaire
    setNewItem({
      name: "",
      category: "",
      unit: "unité",
      currentQuantity: "0",
      minQuantity: "0"
    });
  };

  const handleAddTransaction = () => {
    if (!selectedItem) {
      toast.error("Veuillez sélectionner un article");
      return;
    }

    if (isNaN(transactionQuantity) || transactionQuantity <= 0) {
      toast.error("Veuillez entrer une quantité valide");
      return;
    }

    // Créer la transaction
    const transaction: InventoryTransaction = {
      id: `trans-${Date.now()}`,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      transactionType,
      quantity: transactionQuantity,
      reason: transactionReason,
      date: new Date().toLocaleDateString('fr-FR'),
      batchNumber,
      expiryDate
    };

    // Mettre à jour la quantité de l'article
    const updatedItems = inventoryItems.map(item => {
      if (item.id === selectedItem.id) {
        const newQuantity = transactionType === 'in' 
          ? item.currentQuantity + transactionQuantity
          : item.currentQuantity - transactionQuantity;
        
        return {
          ...item,
          currentQuantity: newQuantity
        };
      }
      return item;
    });

    setTransactions([transaction, ...transactions]);
    setInventoryItems(updatedItems);
    
    toast.success(
      transactionType === 'in' 
        ? "Entrée en stock enregistrée" 
        : "Sortie de stock enregistrée"
    );
    
    // Vérifier si la quantité est sous le seuil minimum après une sortie
    if (transactionType === 'out') {
      const updatedItem = updatedItems.find(item => item.id === selectedItem.id);
      if (updatedItem && updatedItem.currentQuantity < updatedItem.minQuantity) {
        toast.warning(`Attention: ${updatedItem.name} est sous le seuil minimum!`);
      }
    }
    
    setIsTransactionDialogOpen(false);
    resetTransactionForm();
  };

  const resetTransactionForm = () => {
    setSelectedItem(null);
    setTransactionType('in');
    setTransactionQuantity(0);
    setTransactionReason("");
    setBatchNumber("");
    setExpiryDate("");
  };

  const getLowStockItems = () => {
    return inventoryItems.filter(item => item.currentQuantity < item.minQuantity);
  };

  const getExpiringItems = () => {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    
    return inventoryItems.filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= threeMonthsFromNow && expiryDate >= today;
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion de l'inventaire</h1>
          <p className="text-muted-foreground">
            Gérez votre stock de matériel médical et consommables
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setTransactionType('out');
              setIsTransactionDialogOpen(true);
            }}
          >
            Sortie de stock
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setTransactionType('in');
              setIsTransactionDialogOpen(true);
            }}
          >
            Entrée en stock
          </Button>
          <Button onClick={() => setIsAddItemDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2 w-full">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher dans l'inventaire..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="inventory">
              <TabsList className="mb-4">
                <TabsTrigger value="inventory">Inventaire</TabsTrigger>
                <TabsTrigger value="alerts">
                  Alertes
                  {getLowStockItems().length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 inline-flex items-center justify-center">
                      {getLowStockItems().length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="transactions">Historique</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory">
                {isLoading ? (
                  <div className="text-center py-8">Chargement de l'inventaire...</div>
                ) : filteredItems.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead className="text-right">Quantité</TableHead>
                          <TableHead className="text-right">Seuil Min.</TableHead>
                          <TableHead>Unité</TableHead>
                          <TableHead>Date d'expiration</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((item) => (
                          <TableRow key={item.id} className={item.currentQuantity < item.minQuantity ? "bg-red-50" : ""}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-right font-semibold">
                              <span className={item.currentQuantity < item.minQuantity ? "text-red-600" : ""}>
                                {item.currentQuantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{item.minQuantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>
                              {item.expiryDate 
                                ? new Date(item.expiryDate).toLocaleDateString('fr-FR') 
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setTransactionType('out');
                                  setIsTransactionDialogOpen(true);
                                }}
                              >
                                Sortie
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setTransactionType('in');
                                  setIsTransactionDialogOpen(true);
                                }}
                              >
                                Entrée
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun article trouvé
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="alerts">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                      Stock bas
                    </h3>
                    {getLowStockItems().length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Catégorie</TableHead>
                              <TableHead className="text-right">Quantité actuelle</TableHead>
                              <TableHead className="text-right">Seuil minimum</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getLowStockItems().map((item) => (
                              <TableRow key={item.id} className="bg-red-50">
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="text-right font-semibold text-red-600">
                                  {item.currentQuantity}
                                </TableCell>
                                <TableCell className="text-right">{item.minQuantity}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setTransactionType('in');
                                      setIsTransactionDialogOpen(true);
                                    }}
                                  >
                                    Réapprovisionner
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground border rounded-md">
                        Aucun article sous le seuil minimum
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-amber-500" />
                      Expiration proche
                    </h3>
                    {getExpiringItems().length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Catégorie</TableHead>
                              <TableHead className="text-right">Quantité</TableHead>
                              <TableHead>Date d'expiration</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getExpiringItems().map((item) => (
                              <TableRow key={item.id} className="bg-amber-50">
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="text-right">{item.currentQuantity}</TableCell>
                                <TableCell>
                                  {item.expiryDate && new Date(item.expiryDate).toLocaleDateString('fr-FR')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground border rounded-md">
                        Aucun article proche de la date d'expiration
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="transactions">
                {transactions.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Article</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Quantité</TableHead>
                          <TableHead>Motif</TableHead>
                          <TableHead>N° lot</TableHead>
                          <TableHead>Date d'expiration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell className="font-medium">{transaction.itemName}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.transactionType === 'in' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.transactionType === 'in' ? 'Entrée' : 'Sortie'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{transaction.quantity}</TableCell>
                            <TableCell>{transaction.reason || "-"}</TableCell>
                            <TableCell>{transaction.batchNumber || "-"}</TableCell>
                            <TableCell>{transaction.expiryDate || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune transaction enregistrée
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Dialog - Ajouter un article */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un article</DialogTitle>
            <DialogDescription>
              Ajoutez un nouvel article à votre inventaire
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'article *</Label>
              <Input
                id="name"
                placeholder="ex: Compresses stériles 10x10cm"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={newItem.category} 
                onValueChange={(value) => setNewItem({...newItem, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentQuantity">Quantité initiale</Label>
                <Input
                  id="currentQuantity"
                  type="number"
                  min="0"
                  step="1"
                  value={newItem.currentQuantity}
                  onChange={(e) => setNewItem({...newItem, currentQuantity: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unité</Label>
                <Select 
                  value={newItem.unit} 
                  onValueChange={(value) => setNewItem({...newItem, unit: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une unité" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minQuantity">Seuil minimum</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  min="0"
                  step="1"
                  value={newItem.minQuantity}
                  onChange={(e) => setNewItem({...newItem, minQuantity: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Alerte quand la quantité passe sous ce seuil
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Date d'expiration</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Input
                id="notes"
                placeholder="Informations complémentaires..."
                value={newItem.notes}
                onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleAddItem}>
              Ajouter à l'inventaire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog - Transaction (entrée/sortie) */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transactionType === 'in' ? "Entrée en stock" : "Sortie de stock"}
            </DialogTitle>
            <DialogDescription>
              {transactionType === 'in' 
                ? "Enregistrer l'arrivée de produits dans votre inventaire"
                : "Enregistrer l'utilisation ou la sortie de produits"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item">Article *</Label>
              <Select 
                value={selectedItem?.id} 
                onValueChange={(value) => {
                  const item = inventoryItems.find(item => item.id === value);
                  if (item) setSelectedItem(item);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un article" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                value={transactionQuantity || ''}
                onChange={(e) => setTransactionQuantity(parseFloat(e.target.value))}
              />
              {selectedItem && transactionType === 'out' && (
                <p className="text-xs text-muted-foreground">
                  Quantité disponible: {selectedItem.currentQuantity} {selectedItem.unit}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Motif (optionnel)</Label>
              <Input
                id="reason"
                placeholder={transactionType === 'in' ? "ex: Livraison fournisseur" : "ex: Soins patient"}
                value={transactionReason}
                onChange={(e) => setTransactionReason(e.target.value)}
              />
            </div>
            
            {transactionType === 'in' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Numéro de lot</Label>
                  <Input
                    id="batchNumber"
                    placeholder="ex: LOT2025-123"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDateTrans">Date d'expiration</Label>
                  <Input
                    id="expiryDateTrans"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddTransaction}
              disabled={!selectedItem || !transactionQuantity || transactionQuantity <= 0}
            >
              {transactionType === 'in' ? "Enregistrer l'entrée" : "Enregistrer la sortie"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
