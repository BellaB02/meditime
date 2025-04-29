
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Clock, Download, File, Image, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { usePatientsService } from "@/hooks/usePatientsService";

interface PhotosTabProps {
  patientId: string;
}

// Type pour les photos de soins
interface CarePhoto {
  id: string;
  date: string;
  category: string;
  bodyLocation?: string;
  imageUrl: string;
  notes?: string;
}

const PhotosTab: React.FC<PhotosTabProps> = ({ patientId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [bodyLocation, setBodyLocation] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Simuler des photos existantes
  const [photos, setPhotos] = useState<CarePhoto[]>([
    {
      id: "photo-1",
      date: "15/04/2025",
      category: "Plaie",
      bodyLocation: "Jambe droite",
      imageUrl: "/placeholder.svg",
      notes: "Plaie en cours de cicatrisation"
    },
    {
      id: "photo-2",
      date: "10/04/2025",
      category: "Escarre",
      bodyLocation: "Région sacrée",
      imageUrl: "/placeholder.svg",
      notes: "Stade 2, début de traitement"
    }
  ]);

  // Catégories de photos disponibles
  const photoCategories = [
    "Plaie",
    "Escarre",
    "Œdème",
    "Érythème",
    "Cicatrice",
    "Pansement",
    "Autre"
  ];

  // Régions du corps disponibles
  const bodyLocations = [
    "Tête/Visage",
    "Cou",
    "Bras droit",
    "Bras gauche",
    "Thorax",
    "Abdomen",
    "Dos",
    "Région sacrée",
    "Jambe droite",
    "Jambe gauche",
    "Pied droit",
    "Pied gauche"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Créer une URL pour la prévisualisation
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner une photo");
      return;
    }
    
    if (!category) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }
    
    // Simuler l'ajout de la photo
    const newPhoto: CarePhoto = {
      id: `photo-${Date.now()}`,
      date: format(new Date(), "dd/MM/yyyy"),
      category,
      bodyLocation,
      imageUrl: previewUrl || "/placeholder.svg",
      notes
    };
    
    setPhotos([newPhoto, ...photos]);
    
    // Réinitialiser le formulaire et fermer le dialog
    toast.success("Photo ajoutée avec succès");
    resetForm();
    setIsDialogOpen(false);
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCategory("");
    setBodyLocation("");
    setNotes("");
  };

  const handleComparePhotos = (category: string, bodyLocation?: string) => {
    const filteredPhotos = photos.filter(
      photo => photo.category === category && 
      (bodyLocation ? photo.bodyLocation === bodyLocation : true)
    );
    
    if (filteredPhotos.length < 2) {
      toast.info("Pas assez de photos pour une comparaison");
      return;
    }
    
    // Implémenter la comparaison de photos ici
    toast.success("Comparaison de photos en développement");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Photothèque du patient</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            <Camera size={16} className="mr-2" />
            Ajouter une photo
          </Button>
        </CardHeader>
        <CardContent>
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border rounded-md p-4 space-y-2">
                  <div className="aspect-square relative rounded-md overflow-hidden bg-muted">
                    <img 
                      src={photo.imageUrl} 
                      alt={`Photo de ${photo.category}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">{photo.category}</div>
                    {photo.bodyLocation && (
                      <div className="text-sm text-muted-foreground">Localisation: {photo.bodyLocation}</div>
                    )}
                    <div className="text-sm text-muted-foreground">Date: {photo.date}</div>
                    {photo.notes && (
                      <div className="text-sm mt-1">{photo.notes}</div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleComparePhotos(photo.category, photo.bodyLocation)}
                    >
                      Comparer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Image className="mx-auto h-8 w-8 mb-2" />
              <p>Aucune photo enregistrée pour ce patient</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog d'ajout de photo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une photo</DialogTitle>
            <DialogDescription>
              Prenez ou téléversez une photo pour le suivi des soins
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {previewUrl ? (
              <div className="aspect-square relative rounded-md overflow-hidden bg-muted mx-auto max-w-xs">
                <img 
                  src={previewUrl} 
                  alt="Prévisualisation"
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Image className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Prenez une photo ou téléversez une image existante
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleTakePhoto}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Prendre une photo
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleSelectFile}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Téléverser
                  </Button>
                </div>
              </div>
            )}
            
            <Input 
              id="photoCamera"
              type="file" 
              accept="image/*"
              capture="environment"
              className="hidden" 
              ref={cameraInputRef}
              onChange={handleFileChange}
            />
            
            <Input 
              id="photoFile" 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {photoCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bodyLocation">Localisation corporelle</Label>
              <Select value={bodyLocation} onValueChange={setBodyLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une localisation" />
                </SelectTrigger>
                <SelectContent>
                  {bodyLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Input 
                id="notes"
                placeholder="Ajoutez des informations complémentaires..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || !category}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotosTab;
