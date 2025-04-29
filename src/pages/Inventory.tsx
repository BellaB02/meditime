import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Package, Plus, RefreshCcw, Search, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { InventoryService, InventoryItem, InventoryTransaction } from "@/services/InventoryService";
import { Textarea } from "@/components/ui/textarea"; // Add this import

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Add item form state
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Fourniture médicale");
  const [newItemCurrentQuantity, setNewItemCurrentQuantity] = useState("0");
  const [newItemMinQuantity, setNewItemMinQuantity] = useState("0");
  const [newItemUnit, setNewItemUnit] = useState("unité");
  const [newItemExpiryDate, setNewItemExpiryDate] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Transaction form state
  const [transactionType, setTransactionType] = useState<"stock_in" | "stock_out" | "adjustment" | "expired">("stock_in");
  const [transactionQuantity, setTransactionQuantity] = useState("1");
  const [transactionReason, setTransactionReason] = useState("");
  const [transactionBatchNumber, setTransactionBatchNumber] = useState("");
  const [transactionExpiryDate, setTransactionExpiryDate] = useState("");
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  
  // Edit item state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    category: string;
    current_quantity: string;
    min_quantity: string;
    unit: string;
    expiry_date: string;
    notes: string;
  }>({
    name: "",
    category: "Fourniture médicale",
    current_quantity: "0",
    min_quantity: "0",
    unit: "unité",
    expiry_date: "",
    notes: "",
  });
  
  // Transaction history state
  const [transactionHistory, setTransactionHistory] = useState<InventoryTransaction[]>([]);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const categories = [
    "Fourniture médicale",
    "Médicament",
    "Équipement",
    "Désinfectant",
    "Protection",
    "Pansement",
    "Aiguille et seringue",
    "Documentation",
    "Autre"
  ];

  // Load inventory items
  useEffect(() => {
    loadInventoryItems();
  }, []);
  
  // Filter items based on search and filters
  useEffect(() => {
    let filtered = [...items];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Apply availability filter
    if (availabilityFilter === "low") {
      filtered = filtered.filter(item => item.current_quantity <= item.min_quantity);
    } else if (availabilityFilter === "out") {
      filtered = filtered.filter(item => item.current_quantity <= 0);
    } else if (availabilityFilter === "expiring") {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      filtered = filtered.filter(item => {
        if (!item.expiry_date) return false;
        const expiryDate = new Date(item.expiry_date);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
      });
    } else if (availabilityFilter === "expired") {
      filtered = filtered.filter(item => {
        if (!item.expiry_date) return false;
        const expiryDate = new Date(item.expiry_date);
        return expiryDate < new Date();
      });
    }
    
    setFilteredItems(filtered);
  }, [items, searchTerm, categoryFilter, availabilityFilter]);
  
  const loadInventoryItems = async () => {
    setLoading(true);
    try {
      const itemsList = await InventoryService.getAllItems();
      setItems(itemsList);
    } catch (error) {
      toast.error("Erreur lors du chargement de l'inventaire");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddItem = async () => {
    if (!newItemName) {
      toast.error("Veuillez saisir un nom d'article");
      return;
    }
    
    setIsAddingItem(true);
    
    try {
      await InventoryService.createItem({
        name: newItemName,
        category: newItemCategory,
        current_quantity: parseFloat(newItemCurrentQuantity) || 0,
        min_quantity: parseFloat(newItemMinQuantity) || 0,
        unit: newItemUnit,
        expiry_date: newItemExpiryDate || undefined,
        notes: newItemNotes || undefined
      });
      
      setIsAddItemDialogOpen(false);
      loadInventoryItems();
      resetNewItemForm();
    } catch (error) {
      toast.error("Erreur lors de la création de l'article");
    } finally {
      setIsAddingItem(false);
    }
  };
  
  const handleOpenTransactionDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setTransactionType("stock_in");
    setTransactionQuantity("1");
    setTransactionReason("");
    setTransactionBatchNumber("");
    setTransactionExpiryDate("");
    setIsTransactionDialogOpen(true);
  };
  
  const handleRecordTransaction = async () => {
    if (!selectedItem) return;
    
    if (!transactionQuantity || parseFloat(transactionQuantity) <= 0) {
      toast.error("Veuillez saisir une quantité valide");
      return;
    }
    
    setIsProcessingTransaction(true);
    
    try {
      await InventoryService.recordTransaction({
        item_id: selectedItem.id,
        quantity: parseFloat(transactionQuantity),
        transaction_type: transactionType,
        reason: transactionReason,
        batch_number: transactionBatchNumber,
        expiry_date: transactionExpiryDate || undefined
      });
      
      setIsTransactionDialogOpen(false);
      loadInventoryItems();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la transaction");
    } finally {
      setIsProcessingTransaction(false);
    }
  };
  
  const handleOpenDeleteDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    
    try {
      await InventoryService.deleteItem(selectedItem.id);
      setIsDeleteDialogOpen(false);
      loadInventoryItems();
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'article");
    }
  };
  
  const handleOpenEditDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditFormData({
      name: item.name,
      category: item.category || "Fourniture médicale",
      current_quantity: item.current_quantity.toString(),
      min_quantity: item.min_quantity.toString(),
      unit: item.unit || "unité",
      expiry_date: item.expiry_date || "",
      notes: item.notes || ""
    });
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateItem = async () => {
    if (!selectedItem) return;
    
    try {
      await InventoryService.updateItem(selectedItem.id, {
        name: editFormData.name,
        category: editFormData.category,
        current_quantity: parseFloat(editFormData.current_quantity),
        min_quantity: parseFloat(editFormData.min_quantity),
        unit: editFormData.unit,
        expiry_date: editFormData.expiry_date || undefined,
        notes: editFormData.notes || undefined
      });
      
      setIsEditDialogOpen(false);
      loadInventoryItems();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'article");
    }
  };
  
  const handleViewTransactionHistory = async (item: InventoryItem) => {
    setSelectedItem(item);
    setLoadingHistory(true);
    
    try {
      const history = await InventoryService.getItemTransactions(item.id);
      setTransactionHistory(history);
      setIsViewingHistory(true);
    } catch (error) {
      toast.error("Erreur lors du chargement de l'historique des transactions");
    } finally {
      setLoadingHistory(false);
    }
  };
  
  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "stock_in":
        return "Entrée en stock";
      case "stock_out":
        return "Sortie de stock";
      case "adjustment":
        return "Ajustement";
      case "expired":
        return "Périmé";
      default:
        return type;
    }
  };
  
  const getStatusBadge = (item: InventoryItem) => {
    // Vérifier si l'article est expiré
    if (item.expiry_date) {
      const expiryDate = new Date(item.expiry_date);
      if (expiryDate < new Date()) {
        return <Badge variant="destructive">Expiré</Badge>;
      }
      
      // Vérifier si l'article expire bientôt (dans les 30 jours)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      if (expiryDate <= thirtyDaysFromNow) {
        // Utiliser "outline" au lieu de "warning" pour compatibilité
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Expire bientôt</Badge>;
      }
    }
    
    // Vérifier le niveau de stock
    if (item.current_quantity <= 0) {
      return <Badge variant="destructive">Rupture de stock</Badge>;
    }
    
    if (item.current_quantity <= item.min_quantity) {
      // Utiliser "outline" au lieu de "warning" pour compatibilité
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Stock bas</Badge>;
    }
    
    // Utiliser "outline" au lieu de "success" pour compatibilité
    return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">En stock</Badge>;
  };
  
  const resetNewItemForm = () => {
    setNewItemName("");
    setNewItemCategory("Fourniture médicale");
    setNewItemCurrentQuantity("0");
    setNewItemMinQuantity("0");
    setNewItemUnit("unité");
    setNewItemExpiryDate("");
    setNewItemNotes("");
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };
  
  // Get count for different tabs
  const getStockCount = () => {
    return {
      low: items.filter(item => item.current_quantity <= item.min_quantity && item.current_quantity > 0).length,
      out: items.filter(item => item.current_quantity <= 0).length,
      expiring: items.filter(item => {
        if (!item.expiry_date) return false;
        const expiryDate = new Date(item.expiry_date);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
      }).length,
      expired: items.filter(item => {
        if (!item.expiry_date) return false;
        return new Date(item.expiry_date) < new Date();
      }).length
    };
  };
  
  const counts = getStockCount();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion de l'inventaire</h1>
          <p className="text-muted-foreground">
            Gérez votre stock de fournitures médicales et médicaments
          </p>
        </div>
        <Button onClick={() => setIsAddItemDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un article
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => setAvailabilityFilter(value)}>
        <TabsList>
          <TabsTrigger value="all">Tous les articles</TabsTrigger>
          <TabsTrigger value="low">
            Stock bas
            {counts.low > 0 && <Badge variant="outline" className="ml-2 bg-yellow-100">{counts.low}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="out">
            Rupture de stock
            {counts.out > 0 && <Badge variant="destructive" className="ml-2">{counts.out}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="expiring">
            Bientôt périmé
            {counts.expiring > 0 && <Badge variant="outline" className="ml-2 bg-yellow-100">{counts.expiring}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expiré
            {counts.expired > 0 && <Badge variant="destructive" className="ml-2">{counts.expired}</Badge>}
          </TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un article..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadInventoryItems}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg">
              {availabilityFilter === "all" && "Tous les articles"}
              {availabilityFilter === "low" && "Articles en stock bas"}
              {availabilityFilter === "out" && "Articles en rupture de stock"}
              {availabilityFilter === "expiring" && "Articles bientôt périmés"}
              {availabilityFilter === "expired" && "Articles périmés"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead className="hidden md:table-cell">Min</TableHead>
                      <TableHead className="hidden lg:table-cell">Date d'expiration</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchTerm || categoryFilter !== "all" || availabilityFilter !== "all"
                            ? "Aucun article ne correspond à votre recherche"
                            : "Votre inventaire est vide. Ajoutez des articles pour commencer."
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{item.category || "Non catégorisé"}</TableCell>
                          <TableCell className="text-right">
                            {item.current_quantity} {item.unit || "unité(s)"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-right">
                            {item.min_quantity} {item.unit || "unité(s)"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {item.expiry_date ? formatDate(item.expiry_date) : "N/A"}
                          </TableCell>
                          <TableCell>{getStatusBadge(item)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleOpenTransactionDialog(item)}>
                                Ajuster
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleOpenEditDialog(item)}>
                                Éditer
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleViewTransactionHistory(item)}>
                                Historique
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Dialogue d'ajout d'un nouvel article */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel article</DialogTitle>
            <DialogDescription>
              Saisissez les détails de l'article à ajouter à l'inventaire
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'article *</Label>
              <Input 
                id="name" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)} 
                placeholder="Gants jetables"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentQuantity">Quantité actuelle</Label>
                <Input 
                  id="currentQuantity" 
                  type="number"
                  value={newItemCurrentQuantity}
                  onChange={(e) => setNewItemCurrentQuantity(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minQuantity">Quantité minimale</Label>
                <Input 
                  id="minQuantity" 
                  type="number"
                  value={newItemMinQuantity}
                  onChange={(e) => setNewItemMinQuantity(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unité</Label>
                <Input 
                  id="unit" 
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  placeholder="boîtes, paquets, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Date d'expiration</Label>
                <Input 
                  id="expiryDate" 
                  type="date"
                  value={newItemExpiryDate}
                  onChange={(e) => setNewItemExpiryDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
                placeholder="Informations supplémentaires..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)} disabled={isAddingItem}>
              Annuler
            </Button>
            <Button onClick={handleAddItem} disabled={isAddingItem}>
              {isAddingItem ? "Ajout en cours..." : "Ajouter l'article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'ajustement du stock */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajuster le stock</DialogTitle>
            <DialogDescription>
              {selectedItem?.name} - Stock actuel: {selectedItem?.current_quantity} {selectedItem?.unit || "unité(s)"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="transactionType">Type de transaction</Label>
              <Select value={transactionType} onValueChange={(value: "stock_in" | "stock_out" | "adjustment" | "expired") => setTransactionType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de transaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock_in">Entrée en stock</SelectItem>
                  <SelectItem value="stock_out">Sortie de stock</SelectItem>
                  <SelectItem value="adjustment">Ajustement d'inventaire</SelectItem>
                  <SelectItem value="expired">Produit périmé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionQuantity">Quantité</Label>
              <Input 
                id="transactionQuantity" 
                type="number"
                value={transactionQuantity}
                onChange={(e) => setTransactionQuantity(e.target.value)}
                min="0.1"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionReason">Motif</Label>
              <Input 
                id="transactionReason" 
                value={transactionReason}
                onChange={(e) => setTransactionReason(e.target.value)}
                placeholder="Réapprovisionnement, utilisation pour patient, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionBatchNumber">Numéro de lot</Label>
                <Input 
                  id="transactionBatchNumber" 
                  value={transactionBatchNumber}
                  onChange={(e) => setTransactionBatchNumber(e.target.value)}
                />
              </div>
              {transactionType === "stock_in" && (
                <div className="space-y-2">
                  <Label htmlFor="transactionExpiryDate">Date d'expiration</Label>
                  <Input 
                    id="transactionExpiryDate" 
                    type="date"
                    value={transactionExpiryDate}
                    onChange={(e) => setTransactionExpiryDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)} disabled={isProcessingTransaction}>
              Annuler
            </Button>
            <Button onClick={handleRecordTransaction} disabled={isProcessingTransaction}>
              {isProcessingTransaction ? "Traitement en cours..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Supprimer l'article
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet article? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-red-50 text-red-700">
            <p className="font-medium">{selectedItem?.name}</p>
            <p className="text-sm">
              Stock actuel: {selectedItem?.current_quantity} {selectedItem?.unit || "unité(s)"}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier un article</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'article sélectionné
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom de l'article *</Label>
              <Input 
                id="edit-name" 
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Catégorie</Label>
              <Select value={editFormData.category} onValueChange={(value) => setEditFormData({...editFormData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-currentQuantity">Quantité actuelle</Label>
                <Input 
                  id="edit-currentQuantity" 
                  type="number"
                  value={editFormData.current_quantity}
                  onChange={(e) => setEditFormData({...editFormData, current_quantity: e.target.value})}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-minQuantity">Quantité minimale</Label>
                <Input 
                  id="edit-minQuantity" 
                  type="number"
                  value={editFormData.min_quantity}
                  onChange={(e) => setEditFormData({...editFormData, min_quantity: e.target.value})}
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Unité</Label>
                <Input 
                  id="edit-unit" 
                  value={editFormData.unit}
                  onChange={(e) => setEditFormData({...editFormData, unit: e.target.value})}
                  placeholder="boîtes, paquets, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiryDate">Date d'expiration</Label>
                <Input 
                  id="edit-expiryDate" 
                  type="date"
                  value={editFormData.expiry_date}
                  onChange={(e) => setEditFormData({...editFormData, expiry_date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea 
                id="edit-notes" 
                value={editFormData.notes}
                onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                placeholder="Informations supplémentaires..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateItem}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'historique des transactions */}
      <Dialog open={isViewingHistory} onOpenChange={setIsViewingHistory}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Historique des transactions</DialogTitle>
            <DialogDescription>
              {selectedItem?.name} - Stock actuel: {selectedItem?.current_quantity} {selectedItem?.unit || "unité(s)"}
            </DialogDescription>
          </DialogHeader>
          {loadingHistory ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement de l'historique...</p>
            </div>
          ) : (
            <>
              {transactionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune transaction enregistrée pour cet article</p>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead className="hidden md:table-cell">Motif</TableHead>
                        <TableHead className="hidden lg:table-cell">N° de lot</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionHistory.map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {transaction.created_at ? formatDate(transaction.created_at) : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {transaction.transaction_type === "stock_in" && (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              )}
                              {transaction.transaction_type === "stock_out" && (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              {transaction.transaction_type === "adjustment" && (
                                <RefreshCcw className="h-4 w-4 text-blue-600" />
                              )}
                              {transaction.transaction_type === "expired" && (
                                <Calendar className="h-4 w-4 text-amber-600" />
                              )}
                              {getTransactionTypeText(transaction.transaction_type)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {transaction.quantity} {selectedItem?.unit || "unité(s)"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {transaction.reason || "N/A"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {transaction.batch_number || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewingHistory(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
