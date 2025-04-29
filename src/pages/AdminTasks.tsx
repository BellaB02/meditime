
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
  Search
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

// Types
interface BillingItem {
  id: string;
  patient: string;
  date: string;
  amount: string;
  care: string;
  status: "pending" | "submitted" | "paid" | "rejected";
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
    status: "rejected"
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

const AdminTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
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

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion Administrative</h1>
          <p className="text-muted-foreground">Gérez vos facturations et documents administratifs</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Nouvelle facturation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      </div>

      <Tabs defaultValue="billing">
        <TabsList>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
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
                    <TableHead>Action</TableHead>
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
                        <Button variant="ghost" size="sm">
                          <Download size={16} className="mr-2" />
                          Télécharger
                        </Button>
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
                <Card className="p-4 card-hover">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Bordereau de facturation CPAM
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                      Formulaire à remplir pour les facturations à la CPAM
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4 card-hover">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Feuille de soins
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                      Modèle de feuille de soins à remplir pour chaque patient
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4 card-hover">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Bilan de soins
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                      Modèle de rapport pour les bilans de soins infirmiers
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTasks;
