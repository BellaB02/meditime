
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type AddVisitDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  onAddVisit: (e: React.FormEvent) => void;
};

export const AddVisitDialog: React.FC<AddVisitDialogProps> = ({
  isOpen,
  onOpenChange,
  patientName,
  onAddVisit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Ajouter visite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une visite</DialogTitle>
          <DialogDescription>
            Programmez une nouvelle visite pour {patientName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onAddVisit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="visitDate">Date</Label>
                <Input id="visitDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="visitTime">Heure</Label>
                <Input id="visitTime" type="time" required />
              </div>
            </div>
            <div>
              <Label htmlFor="visitCare">Type de soin</Label>
              <select 
                id="visitCare" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
              >
                <option value="">Sélectionner un soin</option>
                <option value="Prise de sang">Prise de sang</option>
                <option value="Pansement">Pansement</option>
                <option value="Injection">Injection</option>
                <option value="Perfusion">Perfusion</option>
              </select>
            </div>
            <div>
              <Label htmlFor="visitNotes">Notes</Label>
              <textarea
                id="visitNotes"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px]"
                placeholder="Détails supplémentaires..."
              ></textarea>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
