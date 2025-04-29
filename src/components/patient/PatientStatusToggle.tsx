
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle, AlertCircle, XCircle, ChevronDown } from "lucide-react";

interface PatientStatusToggleProps {
  patientId: string;
  initialStatus: "active" | "inactive" | "urgent";
  onStatusChange: (newStatus: "active" | "inactive" | "urgent") => void;
}

export function PatientStatusToggle({ patientId, initialStatus, onStatusChange }: PatientStatusToggleProps) {
  const [currentStatus, setCurrentStatus] = useState<"active" | "inactive" | "urgent">(initialStatus);
  
  const getStatusConfig = (status: "active" | "inactive" | "urgent") => {
    switch (status) {
      case "active":
        return { 
          label: "Actif", 
          icon: CheckCircle, 
          variant: "outline" as const,
          color: "text-green-500"
        };
      case "urgent":
        return { 
          label: "Urgent", 
          icon: AlertCircle, 
          variant: "destructive" as const,
          color: "text-red-500"
        };
      case "inactive":
        return { 
          label: "Inactif", 
          icon: XCircle, 
          variant: "secondary" as const,
          color: "text-gray-500"
        };
    }
  };
  
  const handleChangeStatus = (newStatus: "active" | "inactive" | "urgent") => {
    setCurrentStatus(newStatus);
    onStatusChange(newStatus);
  };
  
  const statusConfig = getStatusConfig(currentStatus);
  const Icon = statusConfig.icon;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={statusConfig.variant} className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${statusConfig.color}`} />
          {statusConfig.label}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleChangeStatus("active")}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4 text-green-500" />
          Actif
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleChangeStatus("urgent")}
          className="flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4 text-red-500" />
          Urgent
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleChangeStatus("inactive")}
          className="flex items-center gap-2"
        >
          <XCircle className="h-4 w-4 text-gray-500" />
          Inactif
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
