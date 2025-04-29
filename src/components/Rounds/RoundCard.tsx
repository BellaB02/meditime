import { Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItineraryService } from "@/services/ItineraryService";
import { RoundStop as RoundStopType, Round } from "@/types/rounds";
import { Check, MapPin, MoreVertical, Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RoundStopProps {
  stop: RoundStopType;
  roundId: string;
  roundStarted: boolean;
  onCompleteStop: (roundId: string, stopId: string) => void;
  onReactivateStop: (roundId: string, stopId: string) => void;
  onNavigateToAddress: (address: string) => void;
}

const RoundStop = ({
  stop,
  roundId,
  roundStarted,
  onCompleteStop,
  onReactivateStop,
  onNavigateToAddress,
}: RoundStopProps) => {
  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full ${
            stop.completed
              ? "bg-green-100 text-green-600"
              : "bg-primary/10 text-primary"
          }`}
        >
          {stop.completed ? <Check size={16} /> : <MapPin size={16} />}
        </div>
        <div>
          <p className="font-medium">{stop.patient.name}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{stop.time}</span>
            <span>•</span>
            <span>{stop.care}</span>
          </div>
          <button
            onClick={() => onNavigateToAddress(stop.patient.address)}
            className="text-xs text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 mt-1"
          >
            <MapPin size={10} />
            {stop.patient.address}
          </button>
        </div>
      </div>

      <div>
        {roundStarted && !stop.completed && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCompleteStop(roundId, stop.id)}
          >
            Terminé
          </Button>
        )}
        {roundStarted && stop.completed && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReactivateStop(roundId, stop.id)}
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            Annuler
          </Button>
        )}
      </div>
    </div>
  );
};

interface RoundCardProps {
  round: Round;
  onStartRound: (roundId: string) => void;
  onCompleteRound: (roundId: string) => void;
  onCompleteStop: (roundId: string, stopId: string) => void;
  onReactivateStop: (roundId: string, stopId: string) => void;
  onNavigateToAddress: (address: string) => void;
  onEdit: (round: Round) => void;
  onDelete: (roundId: string) => void;
}

export const RoundCard = ({
  round,
  onStartRound,
  onCompleteRound,
  onCompleteStop,
  onReactivateStop,
  onNavigateToAddress,
  onEdit,
  onDelete
}: RoundCardProps) => {
  // Add a function to generate the itinerary
  const handleGenerateItinerary = () => {
    ItineraryService.openItinerary(round.stops);
  };

  // Calculate completion percentage
  const completedStops = round.stops.filter((stop) => stop.completed).length;
  const totalStops = round.stops.length;
  const completionPercentage = totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0;

  return (
    <div className="border rounded-lg overflow-hidden bg-card transition-all">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="font-medium text-lg">{round.name}</h3>
          <p className="text-sm text-muted-foreground">{round.date} • {round.stops.length} arrêts</p>
        </div>
        <div className="flex gap-2">
          {!round.completed && !round.started && (
            <Button onClick={() => onStartRound(round.id)} disabled={round.stops.length === 0}>
              <Play className="mr-2 h-4 w-4" />
              Démarrer
            </Button>
          )}
          {round.started && (
            <Button variant="outline" onClick={() => onCompleteRound(round.id)}>
              Terminer
            </Button>
          )}
          
          {/* Itinerary button */}
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleGenerateItinerary}
            title="Voir l'itinéraire"
          >
            <Route className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(round)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete(round.id)}
              >
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {round.stops.length > 0 ? (
        <>
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression</span>
              <Badge variant={round.completed ? "default" : "outline"}>
                {completedStops}/{totalStops} ({completionPercentage}%)
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {round.stops.map((stop) => (
              <RoundStop
                key={stop.id}
                stop={stop}
                roundId={round.id}
                roundStarted={round.started}
                onCompleteStop={onCompleteStop}
                onReactivateStop={onReactivateStop}
                onNavigateToAddress={onNavigateToAddress}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="p-6 text-center text-muted-foreground">
          Aucun arrêt dans cette tournée. Modifiez la tournée pour ajouter des arrêts.
        </div>
      )}
    </div>
  );
};
