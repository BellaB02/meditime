
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { StaticDocumentService } from "@/services/StaticDocumentService";

export const UsefulDocumentsCard = () => {
  return (
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
                onClick={() => StaticDocumentService.downloadStaticDocument("feuille_de_soins")}
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
  );
};
