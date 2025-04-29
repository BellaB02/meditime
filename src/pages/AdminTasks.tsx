
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Check,
  AlertTriangle,
  Clock,
  ChevronDown,
  Search,
  Receipt,
  FilePlus,
  Printer,
  Euro
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Types
interface BillingItem {
  id: string;
  patient: string;
  date: string;
  amount: string;
  care: string;
  status: "pending" | "submitted" | "paid" | "rejected";
  comment?: string;
}

// Données fictives
const billingData: BillingItem[] = [
  {
    id: "INV-001",
    patient: "Jean Dupont",
    date: "15/04/2025",
    amount: "32.50€",
    care: "Prise de sang",
    status: "pending"
  },
  {
    id: "INV-002",
    patient: "Marie Martin",
    date: "14/04/2025",
    amount: "45.00€",
    care: "Changement pansement",
    status: "submitted"
  },
  {
    id: "INV-003",
    patient: "Robert Petit",
    date: "14/04/2025",
    amount: "22.00€",
    care: "Injection insuline",
    status: "paid"
  },
  {
    id: "INV-004",
    patient: "Sophie Leroy",
    date: "10/04/2025",
    amount: "65.25€",
    care: "Soins post-opératoires",
    status: "rejected",
    comment: "Cotation incorrecte"
  },
  {
    id: "INV-005",
    patient: "Pierre Bernard",
    date: "08/04/2025",
    amount: "28.50€",
    care: "Perfusion",
    status: "pending"
  }
];

// Données des actes infirmiers avec cotation NGAP
const nursingActsData = [
  { code: "AMI 1", description: "Prélèvement sanguin", rate: "3.15€" },
  { code: "AMI 1.5", description: "Injection intraveineuse", rate: "4.73€" },
  { code: "AMI 2", description: "Pansement simple", rate: "6.30€" },
  { code: "AMI 3", description: "Pansement complexe", rate: "9.45€" },
  { code: "AMI 4", description: "Perfusion", rate: "12.60€" },
  { code: "AMI 5.8", description: "Séance de soins infirmiers", rate: "18.27€" },
  { code: "BSI", description: "Bilan de soins infirmiers", rate: "25.20€" },
  { code: "DSI", description: "Démarche de soins infirmiers", rate: "15.00€" }
];

// Données fictives pour les documents administratifs essentiels
const adminDocuments = [
  {
    title: "Bordereau de facturation CPAM",
    description: "Formulaire à remplir pour les facturations à la CPAM",
    icon: Receipt,
    category: "facturation"
  },
  {
    title: "Feuille de soins",
    description: "Modèle de feuille de soins à remplir pour chaque patient",
    icon: FileText,
    category: "facturation"
  },
  {
    title: "Bilan de soins infirmiers (BSI)",
    description: "Formulaire obligatoire pour la prise en charge des patients dépendants",
    icon: FileText,
    category: "facturation"
  },
  {
    title: "Guide de cotation NGAP",
    description: "Référentiel officiel des actes et cotations infirmiers",
    icon: FileText,
    category: "reference"
  },
  {
    title: "Formulaire d'entente préalable",
    description: "Demande d'accord préalable pour certains soins",
    icon: FileText,
    category: "facturation"
  },
  {
    title: "Bordereau de télétransmission",
    description: "Modèle pour suivre les lots télétransmis à l'Assurance Maladie",
    icon: Receipt,
    category: "facturation"
  }
];

const AdminTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState("billing");
  
  // Filtrer les factures
  const filteredBillings = billingData.filter(item => 
    (item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.id.toLowerCase().includes(searchTerm.toLowerCase())) && 
    (statusFilter === null || item.status === statusFilter)
  );
  
  // Obtenir les statistiques
  const stats = {
    pending: billingData.filter(item => item.status === "pending").length,
    submitted: billingData.filter(item => item.status === "submitted").length,
    paid: billingData.filter(item => item.status === "paid").length,
    rejected: billingData.filter(item => item.status === "rejected").length,
    total: billingData.reduce((acc, item) => acc + parseFloat(item.amount.replace('€', '')), 0).toFixed(2)
  };
  
  // Fonction pour obtenir le style du badge selon le statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock size={12} /> En attente</Badge>;
      case "submitted":
        return <Badge variant="default" className="flex items-center gap-1"><Check size={12} /> Soumis</Badge>;
      case "paid":
        return <Badge variant="default" className="bg-green-500 flex items-center gap-1"><Check size={12} /> Payé</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle size={12} /> Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filtrer les documents par catégorie
  const filterDocumentsByCategory = (category: string) => {
    return adminDocuments.filter(doc => doc.category === category);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion Administrative</h1>
          <p className="text-muted-foreground">Gérez vos facturations et documents administratifs</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              Nouvelle facturation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle facturation</DialogTitle>
              <DialogDescription>
                Complétez les informations pour générer une nouvelle facturation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="patient" className="text-right">
                  Patient
                </label>
                <div className="col-span-3">
                  <select 
                    id="patient" 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner un patient</option>
                    <option value="jean">Jean Dupont</option>
                    <option value="marie">Marie Martin</option>
                    <option value="robert">Robert Petit</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="acts" className="text-right">
                  Actes effectués
                </label>
                <div className="col-span-3">
                  <select 
                    id="acts" 
                    multiple 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-32"
                  >
                    {nursingActsData.map((act) => (
                      <option key={act.code} value={act.code}>
                        {act.code} - {act.description} ({act.rate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="majoration" className="text-right">
                  Majorations
                </label>
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="nuit" className="rounded border-input" />
                    <label htmlFor="nuit">Nuit (+9.15€)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="dimanche" className="rounded border-input" />
                    <label htmlFor="dimanche">Dimanche/Férié (+8.50€)</label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="date" className="text-right">
                  Date des soins
                </label>
                <div className="col-span-3">
                  <Input type="date" id="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Générer la facturation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="stats-card">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <h3 className="text-2xl font-bold mt-1">{stats.pending}</h3>
            </div>
            <div className="bg-secondary/50 text-secondary-foreground p-2 rounded-full">
              <Clock size={20} />
            </div>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Soumis</p>
              <h3 className="text-2xl font-bold mt-1">{stats.submitted}</h3>
            </div>
            <div className="bg-primary/10 text-primary p-2 rounded-full">
              <Check size={20} />
            </div>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Payé</p>
              <h3 className="text-2xl font-bold mt-1">{stats.paid}</h3>
            </div>
            <div className="bg-green-100 text-green-600 p-2 rounded-full">
              <Check size={20} />
            </div>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rejeté</p>
              <h3 className="text-2xl font-bold mt-1">{stats.rejected}</h3>
            </div>
            <div className="bg-destructive/10 text-destructive p-2 rounded-full">
              <AlertTriangle size={20} />
            </div>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total à percevoir</p>
              <h3 className="text-2xl font-bold mt-1">{stats.total}€</h3>
            </div>
            <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
              <Euro size={20} />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue={tabValue} onValueChange={setTabValue}>
        <TabsList>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="cotation">Guide de cotation</TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Liste des facturations</CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center">
                        Filtrer
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                        Tous
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                        En attente
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("submitted")}>
                        Soumis
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("paid")}>
                        Payé
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                        Rejeté
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Soin</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBillings.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.patient}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.care}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Download size={16} className="mr-2" />
                            Télécharger
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Printer size={16} />
                          </Button>
                        </div>
                        {item.comment && (
                          <div className="text-xs text-destructive mt-1">
                            {item.comment}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredBillings.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun résultat ne correspond à votre recherche
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents administratifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminDocuments.map((doc) => (
                  <Card key={doc.title} className="p-4 card-hover">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <doc.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-grow">
                        {doc.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cotation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guide de cotation NGAP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Actes infirmiers</h3>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Rechercher un acte..."
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Tarif</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nursingActsData.map((act) => (
                      <TableRow key={act.code}>
                        <TableCell className="font-medium">{act.code}</TableCell>
                        <TableCell>{act.description}</TableCell>
                        <TableCell>{act.rate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Plus d'informations
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Aide à la cotation</h4>
                <p className="text-sm text-muted-foreground">
                  Les majorations suivantes peuvent s'appliquer à vos actes :
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Majoration de nuit (20h-8h) : +9.15€</li>
                  <li>• Majoration dimanche et jours fériés : +8.50€</li>
                  <li>• Indemnité de déplacement : 2.50€</li>
                  <li>• Indemnité kilométrique : 0.35€/km (plaine), 0.50€/km (montagne)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTasks;
