
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CalendarHeaderProps {
  view: "calendar" | "list";
  setView: (view: "calendar" | "list") => void;
}

export const CalendarHeader = ({ view, setView }: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Planning des tournées</h1>
      <div className="flex gap-2">
        <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
          <TabsList>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter RDV
        </Button>
      </div>
    </div>
  );
};
