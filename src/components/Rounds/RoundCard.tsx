
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Car, Play, Navigation } from "lucide-react";
import { RoundStop } from "@/components/Rounds/RoundStop";
import { Round } from "@/types/rounds";

interface RoundCardProps {
  round: Round;
  onStartRound: (roundId: string) => void;
  onCompleteRound: (roundId: string) => void;
  onCompleteStop: (roundId: string, stopId: string) => void;
  onReactivateStop: (roundId: string, stopId: string) => void;
  onNavigateToAddress: (address: string) => void;
}

export const RoundCard = ({
  round,
  onStartRound,
  onCompleteRound,
  onCompleteStop,
  onReactivateStop,
  onNavigateToAddress
}: RoundCardProps) => {
  // Générer l'itinéraire pour tous les arrêts de la tournée
  const handleNavigateRoute = () => {
    const addresses = round.stops.map(stop => encodeURIComponent(stop.patient.address));
    // Utiliser l'API Google Maps pour créer un itinéraire avec plusieurs destinations
    const url = `https://www.google.com/maps/dir/?api=1&destination=${addresses[addresses.length - 1]}&waypoints=${addresses.slice(0, -1).join('|')}`;
    window.open(url, '_blank');
  };

  return (
    <Card className={round.completed ? "opacity-60" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{round.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{round.date}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleNavigateRoute}
            title="Voir l'itinéraire complet"
            className="text-blue-600"
          >
            <Navigation className="mr-2 h-4 w-4" />
            Itinéraire complet
          </Button>
          
          {round.completed ? (
            <div className="flex items-center text-green-500">
              <CheckCircle className="mr-2 h-5 w-5" />
              Terminée
            </div>
          ) : round.started ? (
            <Button 
              onClick={() => onCompleteRound(round.id)}
              disabled={!round.stops.every(stop => stop.completed)}
            >
              <Car className="mr-2 h-4 w-4" />
              Terminer la tournée
            </Button>
          ) : (
            <Button 
              onClick={() => onStartRound(round.id)}
            >
              <Play className="mr-2 h-4 w-4" />
              Démarrer la tournée
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {round.stops.map((stop) => (
            <RoundStop
              key={stop.id}
              stop={stop}
              roundId={round.id}
              roundStarted={round.started}
              roundCompleted={round.completed}
              onCompleteStop={onCompleteStop}
              onReactivateStop={onReactivateStop}
              onNavigateToAddress={onNavigateToAddress}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
