
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  Clock,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  History,
  Calendar,
  Tag,
  Edit,
  Trash2
} from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { InventoryService, InventoryItem, InventoryTransaction } from '@/services/InventoryService';

type SortField = 'name' | 'category' | 'current_quantity' | 'min_quantity' | 'expiry_date';
type SortOrder = 'asc' | 'desc';

const Inventory = () => {
  // États pour les données
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [expiringItems, setExpiringItems] = useState<InventoryItem[]>([]);
  
  // État pour les filtres et tri
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // États pour les dialogues
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  
  // État pour l'article sélectionné
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  
  // États pour le formulaire d'article
  const [formValues, setFormValues] = useState<Partial<InventoryItem>>({
    name: '',
    category: '',
    current_quantity: 0,
    min_quantity: 0,
    unit: '',
    expiry_date: '',
    notes: ''
  });
  
  // États pour le formulaire de transaction
  const [transactionValues, setTransactionValues] = useState({
    quantity: 1,
    transaction_type: 'stock_in',
    reason: '',
    batch_number: '',
    expiry_date: ''
  });
  
  // État pour le chargement
  const [isLoading, setIsLoading] = useState(true);
  
  // Catégories disponibles (à calculer à partir des articles)
  const [categories, setCategories] = useState<string[]>([]);
  
  // Charger les données
  useEffect(() => {
    const loadInventoryData = async () => {
      setIsLoading(true);
      try {
        const itemsData = await InventoryService.getAllItems();
        setItems(itemsData);
        
        // Extraire les catégories uniques
        const uniqueCategories = Array.from(
          new Set(itemsData.map(item => item.category).filter(Boolean) as string[])
        );
        setCategories(uniqueCategories);
        
        // Charger les articles à faible stock
        const lowStock = await InventoryService.getLowStockItems();
        setLowStockItems(lowStock);
        
        // Charger les articles bientôt périmés
        const expiring = await InventoryService.getExpiringItems(30);
        setExpiringItems(expiring);
      } catch (error) {
        console.error("Erreur lors du chargement de l'inventaire:", error);
        toast.error("Erreur lors du chargement de l'inventaire");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInventoryData();
  }, []);
  
  // Appliquer les filtres et le tri
  useEffect(() => {
    let result = [...items];
    
    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.category?.toLowerCase().includes(query) ||
          item.notes?.toLowerCase().includes(query)
      );
    }
    
    // Filtrer par catégorie
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Trier
    result.sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'category') {
        const categoryA = a.category || '';
        const categoryB = b.category || '';
        return sortOrder === 'asc'
          ? categoryA.localeCompare(categoryB)
          : categoryB.localeCompare(categoryA);
      } else if (sortField === 'current_quantity' || sortField === 'min_quantity') {
        return sortOrder === 'asc'
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      } else if (sortField === 'expiry_date') {
        const dateA = a.expiry_date || '9999-12-31';
        const dateB = b.expiry_date || '9999-12-31';
        return sortOrder === 'asc'
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      }
      return 0;
    });
    
    setFilteredItems(result);
  }, [items, searchQuery, categoryFilter, sortField, sortOrder]);
  
  // Gestion du tri
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  // Formatage de la date d'expiration
  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  // Gestion des formulaires
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormValues({
        ...formValues,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value
      });
    }
  };
  
  const handleTransactionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setTransactionValues({
        ...transactionValues,
        [name]: parseFloat(value) || 0
      });
    } else {
      setTransactionValues({
        ...transactionValues,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  const handleTransactionTypeChange = (value: string) => {
    setTransactionValues({
      ...transactionValues,
      transaction_type: value
    });
  };
  
  // Gestion des actions sur les articles
  const handleAddItem = async () => {
    if (!formValues.name) {
      toast.error("Le nom de l'article est requis");
      return;
    }
    
    try {
      const newItem = await InventoryService.createItem({
        name: formValues.name || '',
        category: formValues.category,
        current_quantity: formValues.current_quantity || 0,
        min_quantity: formValues.min_quantity || 0,
        unit: formValues.unit,
        expiry_date: formValues.expiry_date,
        notes: formValues.notes
      });
      
      if (newItem) {
        setItems([...items, newItem]);
        setIsAddDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article:", error);
    }
  };
  
  const handleEditItem = async () => {
    if (!selectedItem || !formValues.name) {
      toast.error("Impossible de mettre à jour l'article");
      return;
    }
    
    try {
      const updatedItem = await InventoryService.updateItem(selectedItem.id, {
        name: formValues.name,
        category: formValues.category,
        current_quantity: formValues.current_quantity,
        min_quantity: formValues.min_quantity,
        unit: formValues.unit,
        expiry_date: formValues.expiry_date,
        notes: formValues.notes
      });
      
      if (updatedItem) {
        setItems(items.map(item => (item.id === selectedItem.id ? updatedItem : item)));
        setIsEditDialogOpen(false);
        setSelectedItem(null);
        resetForm();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article:", error);
    }
  };
  
  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        const success = await InventoryService.deleteItem(itemId);
        
        if (success) {
          setItems(items.filter(item => item.id !== itemId));
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article:", error);
      }
    }
  };
  
  const handleRecordTransaction = async () => {
    if (!selectedItem) {
      toast.error("Aucun article sélectionné");
      return;
    }
    
    // Vérifier que la quantité est positive
    if (transactionValues.quantity <= 0) {
      toast.error("La quantité doit être supérieure à zéro");
      return;
    }
    
    // Vérifier qu'il y a assez de stock pour les sorties
    if (
      (transactionValues.transaction_type === 'stock_out' || transactionValues.transaction_type === 'expired') && 
      transactionValues.quantity > selectedItem.current_quantity
    ) {
      toast.error("Quantité insuffisante en stock");
      return;
    }
    
    try {
      const success = await InventoryService.recordTransaction({
        item_id: selectedItem.id,
        quantity: transactionValues.quantity,
        transaction_type: transactionValues.transaction_type as any,
        reason: transactionValues.reason,
        batch_number: transactionValues.batch_number,
        expiry_date: transactionValues.expiry_date,
        recorded_by: 'current-user-id' // À remplacer par l'ID de l'utilisateur connecté
      });
      
      if (success) {
        // Mettre à jour les articles après la transaction
        const updatedItems = await InventoryService.getAllItems();
        setItems(updatedItems);
        
        setIsTransactionDialogOpen(false);
        resetTransactionForm();
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la transaction:", error);
    }
  };
  
  const handleShowHistory = async (item: InventoryItem) => {
    setSelectedItem(item);
    
    try {
      const transactionHistory = await InventoryService.getItemTransactions(item.id);
      setTransactions(transactionHistory);
      setIsHistoryDialogOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      toast.error("Erreur lors du chargement de l'historique");
    }
  };
  
  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormValues({
      name: item.name,
      category: item.category || '',
      current_quantity: item.current_quantity,
      min_quantity: item.min_quantity,
      unit: item.unit || '',
      expiry_date: item.expiry_date || '',
      notes: item.notes || ''
    });
    setIsEditDialogOpen(true);
  };
  
  const handleAddTransaction = (item: InventoryItem) => {
    setSelectedItem(item);
    resetTransactionForm();
    setIsTransactionDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormValues({
      name: '',
      category: '',
      current_quantity: 0,
      min_quantity: 0,
      unit: '',
      expiry_date: '',
      notes: ''
    });
  };
  
  const resetTransactionForm = () => {
    setTransactionValues({
      quantity: 1,
      transaction_type: 'stock_in',
      reason: '',
      batch_number: '',
      expiry_date: ''
    });
  };
  
  // Obtenir le badge de statut pour un article
  const getItemStatusBadge = (item: InventoryItem) => {
    if (item.current_quantity <= 0) {
      return <Badge variant="destructive">Rupture</Badge>;
    } else if (item.current_quantity < item.min_quantity) {
      return <Badge variant="warning">Stock bas</Badge>;
    }
    
    const expiry = item.expiry_date ? new Date(item.expiry_date) : null;
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    if (expiry && expiry < now) {
      return <Badge variant="destructive">Périmé</Badge>;
    } else if (expiry && expiry < thirtyDaysFromNow) {
      return <Badge variant="warning">Exp. proche</Badge>;
    }
    
    return <Badge variant="success">En stock</Badge>;
  };
  
  // Rendu de l'historique des transactions
  const renderTransactionHistory = () => {
    return (
      <div className="max-h-96 overflow-auto">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune transaction enregistrée pour cet article
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>N° lot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {transaction.created_at 
                      ? format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }) 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {transaction.transaction_type === 'stock_in' && 
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Entrée</Badge>}
                    {transaction.transaction_type === 'stock_out' && 
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sortie</Badge>}
                    {transaction.transaction_type === 'adjustment' && 
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Ajustement</Badge>}
                    {transaction.transaction_type === 'expired' && 
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Périmé</Badge>}
                  </TableCell>
                  <TableCell>
                    {transaction.transaction_type === 'stock_in' || transaction.transaction_type === 'adjustment'
                      ? <span className="text-green-600">+{transaction.quantity}</span>
                      : <span className="text-red-600">-{transaction.quantity}</span>}
                  </TableCell>
                  <TableCell>{transaction.reason || '-'}</TableCell>
                  <TableCell>{transaction.batch_number || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestion de l'inventaire</h1>
        <p className="text-muted-foreground">Gérez votre stock de matériel médical et produits</p>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Package className="h-4 w-4" /> Tous les articles
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" /> Stock bas
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> Bientôt périmés
          </TabsTrigger>
        </TabsList>
        
        <div className="my-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un article..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Ajouter
          </Button>
        </div>
        
        <TabsContent value="all" className="p-0 border-0">
          <Card>
            <CardHeader>
              <CardTitle>Inventaire</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Chargement de l'inventaire...</div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun article trouvé
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('name')}
                        >
                          Nom
                          {sortField === 'name' && (
                            sortOrder === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                            <ArrowDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('category')}
                        >
                          Catégorie
                          {sortField === 'category' && (
                            sortOrder === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                            <ArrowDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('current_quantity')}
                        >
                          Stock
                          {sortField === 'current_quantity' && (
                            sortOrder === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                            <ArrowDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('expiry_date')}
                        >
                          Date exp.
                          {sortField === 'expiry_date' && (
                            sortOrder === 'asc' ? <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                            <ArrowDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            {item.category ? (
                              <div className="flex items-center">
                                <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                                {item.category}
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {item.current_quantity} {item.unit || ''}
                              {item.current_quantity < item.min_quantity && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.expiry_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {formatExpiryDate(item.expiry_date)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{getItemStatusBadge(item)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleAddTransaction(item)}
                              >
                                <ArrowUpDown className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleShowHistory(item)}
                              >
                                <History className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="low-stock" className="p-0 border-0">
          <Card>
            <CardHeader>
              <CardTitle>Articles à faible stock</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun article à faible stock
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Stock actuel</TableHead>
                      <TableHead>Stock minimal</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-red-600">
                          {item.current_quantity} {item.unit || ''}
                        </TableCell>
                        <TableCell>
                          {item.min_quantity} {item.unit || ''}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddTransaction(item)}
                          >
                            <ArrowUp className="h-4 w-4 mr-1" />
                            Approvisionner
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expiring" className="p-0 border-0">
          <Card>
            <CardHeader>
              <CardTitle>Articles bientôt périmés</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : expiringItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun article bientôt périmé
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Date d'expiration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          {item.current_quantity} {item.unit || ''}
                        </TableCell>
                        <TableCell className="text-amber-600">
                          {formatExpiryDate(item.expiry_date)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddTransaction(item)}
                            >
                              Gérer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogue pour ajouter un article */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un article</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Nom*
              </label>
              <Input
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right">
                Catégorie
              </label>
              <Select
                value={formValues.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Nouvelle catégorie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formValues.category === 'new' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="newCategory" className="text-right">
                  Nouvelle catégorie
                </label>
                <Input
                  id="newCategory"
                  name="newCategory"
                  value={formValues.newCategory || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="current_quantity" className="text-right">
                Quantité initiale
              </label>
              <Input
                id="current_quantity"
                name="current_quantity"
                type="number"
                value={formValues.current_quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="min_quantity" className="text-right">
                Quantité minimale
              </label>
              <Input
                id="min_quantity"
                name="min_quantity"
                type="number"
                value={formValues.min_quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="unit" className="text-right">
                Unité
              </label>
              <Input
                id="unit"
                name="unit"
                value={formValues.unit || ''}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Ex: unités, boîtes, ml, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="expiry_date" className="text-right">
                Date d'expiration
              </label>
              <Input
                id="expiry_date"
                name="expiry_date"
                type="date"
                value={formValues.expiry_date || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right">
                Notes
              </label>
              <Input
                id="notes"
                name="notes"
                value={formValues.notes || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddItem}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue pour éditer un article */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier un article</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Nom*
              </label>
              <Input
                id="edit-name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-category" className="text-right">
                Catégorie
              </label>
              <Select
                value={formValues.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Nouvelle catégorie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-min_quantity" className="text-right">
                Quantité minimale
              </label>
              <Input
                id="edit-min_quantity"
                name="min_quantity"
                type="number"
                value={formValues.min_quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-unit" className="text-right">
                Unité
              </label>
              <Input
                id="edit-unit"
                name="unit"
                value={formValues.unit || ''}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Ex: unités, boîtes, ml, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-expiry_date" className="text-right">
                Date d'expiration
              </label>
              <Input
                id="edit-expiry_date"
                name="expiry_date"
                type="date"
                value={formValues.expiry_date || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-notes" className="text-right">
                Notes
              </label>
              <Input
                id="edit-notes"
                name="notes"
                value={formValues.notes || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditItem}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue pour ajouter une transaction */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? (
                <>Transaction pour {selectedItem.name}</>
              ) : (
                <>Nouvelle transaction</>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="transaction_type" className="text-right">
                Type*
              </label>
              <Select
                value={transactionValues.transaction_type}
                onValueChange={handleTransactionTypeChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock_in">Entrée en stock</SelectItem>
                  <SelectItem value="stock_out">Sortie de stock</SelectItem>
                  <SelectItem value="adjustment">Ajustement</SelectItem>
                  <SelectItem value="expired">Périmé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right">
                Quantité*
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={transactionValues.quantity}
                onChange={handleTransactionInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="reason" className="text-right">
                Motif
              </label>
              <Input
                id="reason"
                name="reason"
                value={transactionValues.reason}
                onChange={handleTransactionInputChange}
                className="col-span-3"
                placeholder="Ex: Réapprovisionnement, Utilisation patient, etc."
              />
            </div>
            
            {(transactionValues.transaction_type === 'stock_in') && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="batch_number" className="text-right">
                    N° de lot
                  </label>
                  <Input
                    id="batch_number"
                    name="batch_number"
                    value={transactionValues.batch_number}
                    onChange={handleTransactionInputChange}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="transaction_expiry_date" className="text-right">
                    Date d'expiration
                  </label>
                  <Input
                    id="transaction_expiry_date"
                    name="expiry_date"
                    type="date"
                    value={transactionValues.expiry_date}
                    onChange={handleTransactionInputChange}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            
            {selectedItem && (
              <div className="mt-4 p-3 bg-accent rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Stock actuel :</p>
                <p className="font-medium">{selectedItem.current_quantity} {selectedItem.unit || ''}</p>
                
                <p className="text-sm text-muted-foreground mt-3 mb-1">Stock après transaction :</p>
                <p className="font-medium">
                  {transactionValues.transaction_type === 'stock_in' || transactionValues.transaction_type === 'adjustment'
                    ? selectedItem.current_quantity + transactionValues.quantity
                    : selectedItem.current_quantity - transactionValues.quantity} {selectedItem.unit || ''}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleRecordTransaction}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue pour l'historique des transactions */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? (
                <>Historique des transactions - {selectedItem.name}</>
              ) : (
                <>Historique des transactions</>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {renderTransactionHistory()}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
