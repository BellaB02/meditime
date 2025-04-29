
import { motion } from "framer-motion";
import { Clock, MapPin, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoundStop as RoundStopType } from "@/types/rounds";

interface RoundStopProps {
  stop: RoundStopType;
  roundId: string;
  roundStarted: boolean;
  roundCompleted: boolean;
  onCompleteStop: (roundId: string, stopId: string) => void;
  onReactivateStop: (roundId: string, stopId: string) => void;
  onNavigateToAddress: (address: string) => void;
}

export const RoundStop = ({
  stop,
  roundId,
  roundStarted,
  roundCompleted,
  onCompleteStop,
  onReactivateStop,
  onNavigateToAddress
}: RoundStopProps) => {
  return (
    <motion.div 
      key={stop.id}
      className={`border rounded-lg p-4 ${stop.completed ? "border-green-200 bg-green-50/50" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="font-medium">{stop.time}</span>
          </div>
          <h3 className="font-semibold text-lg">{stop.patient.name}</h3>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
            <p className="text-sm text-muted-foreground">{stop.patient.address}</p>
          </div>
          <div className="rounded-full bg-primary/10 text-primary px-2 py-1 text-xs inline-block mt-1">
            {stop.care}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onNavigateToAddress(stop.patient.address)}
          >
            <MapPin className="mr-2 h-3 w-3" />
            Itinéraire
          </Button>
          {stop.completed ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-amber-600"
              onClick={() => onReactivateStop(roundId, stop.id)}
              disabled={!roundStarted || roundCompleted}
            >
              <RotateCcw className="mr-2 h-3 w-3" />
              Remettre en cours
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onCompleteStop(roundId, stop.id)}
              disabled={!roundStarted}
            >
              <CheckCircle className="mr-2 h-3 w-3" />
              Terminer
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
