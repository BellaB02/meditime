
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface CareSheetHeaderProps {
  openDialog: () => void;
}

export const CareSheetHeader = ({ openDialog }: CareSheetHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Feuilles de soins</h1>
        <p className="text-muted-foreground">Gérez et consultez vos feuilles de soins</p>
      </div>
      <Dialog onOpenChange={(open) => open && openDialog()}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle feuille de soins
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};
