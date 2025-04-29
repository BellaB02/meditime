
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, User, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PatientService } from "@/services/PatientService";

interface PatientStatusToggleProps {
  patientId: string;
  initialStatus: "active" | "inactive" | "urgent";
  onStatusChange: (newStatus: "active" | "inactive" | "urgent") => void;
}

export const PatientStatusToggle = ({ patientId, initialStatus, onStatusChange }: PatientStatusToggleProps) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive" | "urgent">(initialStatus);

  const statusOptions = [
    {
      value: "active",
      label: "Actif",
      description: "Le patient est actif dans le cabinet",
      icon: Check,
      iconClassName: "text-green-500",
      bgClassName: "bg-green-50 border-green-100"
    },
    {
      value: "inactive",
      label: "Inactif",
      description: "Le patient est inactif (ne vient plus au cabinet)",
      icon: Clock,
      iconClassName: "text-gray-500",
      bgClassName: "bg-gray-50 border-gray-100"
    },
    {
      value: "urgent",
      label: "Urgent",
      description: "Le patient nécessite une attention particulière",
      icon: AlertCircle,
      iconClassName: "text-red-500",
      bgClassName: "bg-red-50 border-red-100"
    }
  ];

  const currentOption = statusOptions.find(option => option.value === status);

  const handleSelectStatus = (newStatus: "active" | "inactive" | "urgent") => {
    // Mettre à jour le statut dans le service
    PatientService.updatePatientStatus(patientId, newStatus);
    
    // Mettre à jour l'état local
    setStatus(newStatus);
    onStatusChange(newStatus);
    setOpen(false);
    
    // Notification
    toast.success(`Statut du patient mis à jour: ${
      newStatus === "active" ? "Actif" : 
      newStatus === "inactive" ? "Inactif" : "Urgent"
    }`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-2", 
            currentOption?.bgClassName
          )}
        >
          {currentOption && (
            <currentOption.icon className={cn("h-4 w-4", currentOption.iconClassName)} />
          )}
          {currentOption?.label || "Statut"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1">
        <div className="space-y-1">
          {statusOptions.map(option => (
            <Button
              key={option.value}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                status === option.value && "bg-accent"
              )}
              onClick={() => handleSelectStatus(option.value as "active" | "inactive" | "urgent")}
            >
              <option.icon className={cn("h-4 w-4", option.iconClassName)} />
              <div className="text-left">
                <p className="font-medium">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
