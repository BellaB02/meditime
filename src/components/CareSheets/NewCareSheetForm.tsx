
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

interface NewCareSheetFormProps {
  onClose: () => void;
}

export const NewCareSheetForm = ({ onClose }: NewCareSheetFormProps) => {
  const handleCreateNewSheet = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dans une vraie application, cela créerait une vraie feuille de soins
    // avec toutes les informations patient
    toast.success("Nouvelle feuille de soins créée avec les données du patient");
    onClose();
  };

  return (
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
  );
};
