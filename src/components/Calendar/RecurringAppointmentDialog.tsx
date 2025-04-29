
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface RecurringAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recurrenceData: RecurrenceData) => void;
  initialAppointmentDate?: Date;
}

export interface RecurrenceData {
  frequency: "daily" | "weekly" | "monthly";
  interval: number;
  endDate: Date | null;
  daysOfWeek?: number[];
  excludeDates?: Date[];
  totalOccurrences?: number;
}

const RecurringAppointmentDialog: React.FC<RecurringAppointmentDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAppointmentDate = new Date()
}) => {
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [interval, setInterval] = useState(1);
  const [endType, setEndType] = useState<"date" | "occurrences">("date");
  const [endDate, setEndDate] = useState<Date | undefined>(addMonths(initialAppointmentDate, 3));
  const [occurrences, setOccurrences] = useState(10);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([initialAppointmentDate.getDay()]);
  
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 30) {
      setInterval(value);
    }
  };
  
  const handleOccurrencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 100) {
      setOccurrences(value);
    }
  };
  
  const toggleDaySelection = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };
  
  const getPreviewDates = () => {
    const dates: Date[] = [];
    let currentDate = new Date(initialAppointmentDate);
    let count = 0;
    const maxPreview = 5;
    
    while (count < maxPreview) {
      if (frequency === "daily") {
        currentDate = addDays(currentDate, interval);
        dates.push(new Date(currentDate));
        count++;
      } else if (frequency === "weekly") {
        currentDate = addWeeks(currentDate, interval);
        dates.push(new Date(currentDate));
        count++;
      } else if (frequency === "monthly") {
        currentDate = addMonths(currentDate, interval);
        dates.push(new Date(currentDate));
        count++;
      }
    }
    
    return dates;
  };
  
  const handleSave = () => {
    if (frequency === "weekly" && daysOfWeek.length === 0) {
      toast.error("Veuillez sélectionner au moins un jour de la semaine");
      return;
    }
    
    const recurrenceData: RecurrenceData = {
      frequency,
      interval,
      endDate: endType === "date" ? endDate || null : null,
      daysOfWeek: frequency === "weekly" ? daysOfWeek : undefined,
      totalOccurrences: endType === "occurrences" ? occurrences : undefined
    };
    
    onSave(recurrenceData);
    onClose();
    toast.success("Récurrence programmée");
  };
  
  const daysOfWeekLabels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Programmer une récurrence</DialogTitle>
          <DialogDescription>
            Configurez la récurrence pour ce rendez-vous
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Fréquence</Label>
            <Select
              value={frequency}
              onValueChange={(value: "daily" | "weekly" | "monthly") => setFrequency(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidienne</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuelle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Intervalle</Label>
            <div className="flex items-center gap-2">
              <p>Tous les</p>
              <Input
                type="number"
                min={1}
                max={30}
                value={interval}
                onChange={handleIntervalChange}
                className="w-16"
              />
              <p>
                {frequency === "daily" ? "jours" : 
                 frequency === "weekly" ? "semaines" : "mois"}
              </p>
            </div>
          </div>
          
          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label>Jours de la semaine</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeekLabels.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => toggleDaySelection(index)}
                    className={`
                      cursor-pointer rounded-md px-3 py-1 text-sm border
                      ${daysOfWeek.includes(index) 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background border-input"}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Fin de récurrence</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={endType === "date"} 
                  onCheckedChange={() => setEndType("date")}
                />
                <Label className="cursor-pointer">À une date spécifique</Label>
              </div>
              
              {endType === "date" && (
                <div className="pl-6 pt-2">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < initialAppointmentDate}
                    locale={fr}
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={endType === "occurrences"} 
                  onCheckedChange={() => setEndType("occurrences")}
                />
                <Label className="cursor-pointer">Après un nombre d'occurrences</Label>
              </div>
              
              {endType === "occurrences" && (
                <div className="pl-6 pt-2 flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={occurrences}
                    onChange={handleOccurrencesChange}
                    className="w-16"
                  />
                  <p>occurrences</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Aperçu des prochaines dates</Label>
            <div className="border rounded-md p-4 space-y-2">
              {getPreviewDates().map((date, index) => (
                <div key={index} className="text-sm">
                  {format(date, "EEEE d MMMM yyyy", { locale: fr })}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Confirmer la récurrence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringAppointmentDialog;
