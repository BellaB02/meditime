
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Document, DocumentService } from "@/services/DocumentService";
import { Search, Calendar, Download, Printer, FileText } from "lucide-react";
import { toast } from "sonner";

interface CareSheetListProps {
  careSheets: Document[];
}

export const CareSheetList = ({ careSheets }: CareSheetListProps) => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  const filteredCareSheets = careSheets.filter(sheet => {
    const matchSearch = sheet.patientName?.toLowerCase().includes(search.toLowerCase()) || 
                       sheet.name.toLowerCase().includes(search.toLowerCase());
    const matchDate = dateFilter ? sheet.date.includes(dateFilter) : true;
    return matchSearch && matchDate;
  });
  
  const handleDownload = (sheet: Document) => {
    try {
      // Vérifier que toutes les informations nécessaires sont disponibles
      if (!sheet.patientId || !sheet.careInfo) {
        toast.error("Informations patient insuffisantes pour pré-remplir la feuille de soins");
        return;
      }
      
      // Récupérer toutes les données du patient
      const patientData = {
        patientId: sheet.patientId,
        patientName: sheet.patientName || "",
        patientInfo: sheet.patientInfo || {},
        careInfo: {
          ...sheet.careInfo,
          code: sheet.careInfo.code || "AMI",
          description: sheet.careInfo.description || sheet.careInfo.type || "Soin infirmier"
        }
      };
      
      // Passer toutes les données au service pour générer un PDF pré-rempli
      DocumentService.downloadDocument(
        "feuille_de_soins", 
        sheet.patientId,
        patientData.careInfo,
        true // Flag pour indiquer que nous voulons une feuille pré-remplie
      );
      
      toast.success(`Téléchargement de la feuille de soins pré-remplie pour ${sheet.patientName}`);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement de la feuille de soins");
    }
  };
  
  const handlePrint = (sheet: Document) => {
    try {
      // Passer toutes les informations disponibles pour pré-remplir la feuille de soins
      DocumentService.printDocument(
        "feuille_de_soins", 
        sheet.patientId,
        sheet.careInfo,
        true // Flag pour indiquer que nous voulons une feuille pré-remplie
      );
      
      toast.success(`Impression de la feuille de soins pré-remplie pour ${sheet.patientName}`);
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast.error("Erreur lors de l'impression de la feuille de soins");
    }
  };

  return (
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
  );
};
