
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Car, Play } from "lucide-react";
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
  return (
    <Card className={round.completed ? "opacity-60" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{round.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{round.date}</p>
        </div>
        
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
