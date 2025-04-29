import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentService, Document } from "@/services/DocumentService";
import { FileText, PlusCircle, Search, Download, Printer, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Données fictives pour les feuilles de soins
const dummyCareSheets: Document[] = [
  {
    id: "cs-001",
    name: "Feuille de soins - Jean Dupont",
    type: "careSheet",
    date: "29/04/2025",
    patientId: "p1",
    patientName: "Jean Dupont",
    patientInfo: {
      name: "Jean Dupont",
      address: "15 Rue de Paris, 75001 Paris",
      phoneNumber: "06 12 34 56 78",
      socialSecurityNumber: "1 88 05 75 123 456 78",
      dateOfBirth: "05/08/1988"
    },
    careInfo: {
      type: "Pansement",
      date: "29/04/2025",
      time: "10:00",
      code: "AMI 2"
    }
  },
  {
    id: "cs-002",
    name: "Feuille de soins - Marie Martin",
    type: "careSheet",
    date: "28/04/2025",
    patientId: "p2",
    patientName: "Marie Martin",
    patientInfo: {
      name: "Marie Martin",
      address: "8 Avenue Victor Hugo, 75016 Paris",
      phoneNumber: "06 23 45 67 89",
      socialSecurityNumber: "2 90 12 75 234 567 89",
      dateOfBirth: "12/10/1990"
    },
    careInfo: {
      type: "Injection insuline",
      date: "28/04/2025",
      time: "11:30",
      code: "AMI 1"
    }
  },
  {
    id: "cs-003",
    name: "Feuille de soins - Robert Petit",
    type: "careSheet",
    date: "27/04/2025",
    patientId: "p3",
    patientName: "Robert Petit",
    patientInfo: {
      name: "Robert Petit",
      address: "8 rue du Commerce, 75015 Paris",
      phoneNumber: "06 34 56 78 90",
      socialSecurityNumber: "1 85 07 75 345 678 90",
      dateOfBirth: "07/07/1985"
    },
    careInfo: {
      type: "Prise de sang",
      date: "27/04/2025",
      time: "09:00",
      code: "AMI 1.5"
    }
  },
  {
    id: "cs-004",
    name: "Feuille de soins - Jean Dupont",
    type: "careSheet",
    date: "26/04/2025",
    patientId: "p1",
    patientName: "Jean Dupont",
    patientInfo: {
      name: "Jean Dupont",
      address: "15 Rue de Paris, 75001 Paris",
      phoneNumber: "06 12 34 56 78",
      socialSecurityNumber: "1 88 05 75 123 456 78",
      dateOfBirth: "05/08/1988"
    },
    careInfo: {
      type: "Injection insuline",
      date: "26/04/2025",
      time: "18:30",
      code: "AMI 1"
    }
  }
];

export default function CareSheets() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [careSheets] = useState<Document[]>(dummyCareSheets);
  const [isNewSheetDialogOpen, setIsNewSheetDialogOpen] = useState(false);
  
  const filteredCareSheets = careSheets.filter(sheet => {
    const matchSearch = sheet.patientName?.toLowerCase().includes(search.toLowerCase()) || 
                       sheet.name.toLowerCase().includes(search.toLowerCase());
    const matchDate = dateFilter ? sheet.date.includes(dateFilter) : true;
    return matchSearch && matchDate;
  });
  
  const handleDownload = (sheet: Document) => {
    // Passer toutes les informations du patient et du soin pour pré-remplir la feuille
    DocumentService.downloadDocument(
      "feuille_de_soins", 
      sheet.patientId, 
      sheet.careInfo,
      true // Flag pour indiquer que nous voulons une feuille pré-remplie
    );
    
    // Notification plus explicite du pré-remplissage
    if (sheet.patientInfo) {
      toast.success(`Téléchargement de la feuille de soins pré-remplie pour ${sheet.patientName}`, {
        description: `Avec toutes les informations patient intégrées dans le PDF`
      });
    } else {
      toast.success(`Téléchargement de la feuille de soins pour ${sheet.patientName}`);
    }
  };
  
  const handlePrint = (sheet: Document) => {
    // Passer toutes les informations disponibles pour pré-remplir la feuille avant impression
    DocumentService.printDocument(
      "feuille_de_soins", 
      sheet.patientId, 
      sheet.careInfo,
      true // Flag pour indiquer que nous voulons une feuille pré-remplie
    );
    
    toast.success(`Impression de la feuille de soins pré-remplie pour ${sheet.patientName}`);
  };
  
  const handleCreateNewSheet = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dans une vraie application, cela créerait une vraie feuille de soins
    // avec toutes les informations patient
    toast.success("Nouvelle feuille de soins créée avec les données du patient");
    setIsNewSheetDialogOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Feuilles de soins</h1>
          <p className="text-muted-foreground">Gérez et consultez vos feuilles de soins</p>
        </div>
        <Dialog open={isNewSheetDialogOpen} onOpenChange={setIsNewSheetDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle feuille de soins
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une feuille de soins</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour générer une nouvelle feuille de soins
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateNewSheet} className="space-y-4 py-4">
              <div>
                <Label htmlFor="patientSelect">Patient</Label>
                <select id="patientSelect" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                  <option value="">Sélectionner un patient</option>
                  <option value="p1">Jean Dupont</option>
                  <option value="p2">Marie Martin</option>
                  <option value="p3">Robert Petit</option>
                </select>
              </div>
              <div>
                <Label htmlFor="careDate">Date du soin</Label>
                <Input id="careDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="careType">Type de soin</Label>
                <select id="careType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                  <option value="">Sélectionner un type de soin</option>
                  <option value="AMI 1">AMI 1 - Prélèvement sanguin</option>
                  <option value="AMI 1.5">AMI 1.5 - Injection intraveineuse</option>
                  <option value="AMI 2">AMI 2 - Pansement simple</option>
                  <option value="AMI 3">AMI 3 - Pansement complexe</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">Créer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Feuilles de soins
              </CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Input
                  type="date"
                  className="w-auto"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCareSheets.length > 0 ? (
                  filteredCareSheets.map((sheet) => (
                    <TableRow key={sheet.id}>
                      <TableCell>{sheet.date}</TableCell>
                      <TableCell>{sheet.patientName}</TableCell>
                      <TableCell>{sheet.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(sheet)}>
                            <Download size={16} className="mr-2" />
                            Télécharger
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handlePrint(sheet)}>
                            <Printer size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Aucune feuille de soins trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Documents utiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Feuille de soins vierge
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Téléchargez une feuille de soins vierge à remplir manuellement
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => DocumentService.downloadDocument("feuille_de_soins")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Guide de remplissage
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    Consultez le guide pour bien remplir vos feuilles de soins
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => toast.success("Téléchargement du guide")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
