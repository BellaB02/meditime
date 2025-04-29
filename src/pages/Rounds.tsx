
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Car, Clock, Play } from "lucide-react";
import { toast } from "sonner";
import { CompleteRoundAnimation } from "@/components/Rounds/CompleteRoundAnimation";
import { motion } from "framer-motion";

interface RoundStop {
  id: string;
  patient: {
    name: string;
    address: string;
  };
  time: string;
  care: string;
  completed: boolean;
}

interface Round {
  id: string;
  name: string;
  date: string;
  stops: RoundStop[];
  completed: boolean;
  started: boolean;
}

// Données fictives
const initialRounds: Round[] = [
  {
    id: "round-1",
    name: "Tournée du matin",
    date: "29/04/2025",
    completed: false,
    started: false,
    stops: [
      {
        id: "stop-1",
        patient: {
          name: "Jean Dupont",
          address: "15 Rue de Paris, 75001 Paris"
        },
        time: "08:30",
        care: "Prise de sang",
        completed: false
      },
      {
        id: "stop-2",
        patient: {
          name: "Marie Martin",
          address: "8 Avenue Victor Hugo, 75016 Paris"
        },
        time: "10:15",
        care: "Changement pansement",
        completed: false
      },
      {
        id: "stop-3",
        patient: {
          name: "Robert Petit",
          address: "8 rue du Commerce, 75015 Paris"
        },
        time: "11:30",
        care: "Injection insuline",
        completed: false
      }
    ]
  },
  {
    id: "round-2",
    name: "Tournée de l'après-midi",
    date: "29/04/2025",
    completed: false,
    started: false,
    stops: [
      {
        id: "stop-4",
        patient: {
          name: "Sophie Leroy",
          address: "25 rue des Martyrs, 75009 Paris"
        },
        time: "14:00",
        care: "Soins post-opératoires",
        completed: false
      },
      {
        id: "stop-5",
        patient: {
          name: "Pierre Bernard",
          address: "14 boulevard Haussmann, 75008 Paris"
        },
        time: "16:30",
        care: "Perfusion",
        completed: false
      }
    ]
  }
];

const Rounds = () => {
  const [rounds, setRounds] = useState<Round[]>(initialRounds);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Démarrer une tournée
  const handleStartRound = (roundId: string) => {
    setRounds(prev => 
      prev.map(round => 
        round.id === roundId 
          ? { ...round, started: true } 
          : round
      )
    );
    
    toast.success("Tournée démarrée");
  };
  
  // Marquer un arrêt comme complété
  const handleCompleteStop = (roundId: string, stopId: string) => {
    setRounds(prev => 
      prev.map(round => {
        if (round.id === roundId) {
          const updatedStops = round.stops.map(stop => 
            stop.id === stopId ? { ...stop, completed: true } : stop
          );
          
          // Vérifier si tous les arrêts sont complétés
          const allCompleted = updatedStops.every(stop => stop.completed);
          
          return {
            ...round,
            stops: updatedStops,
            completed: allCompleted
          };
        }
        return round;
      })
    );
    
    toast.success("Soin marqué comme terminé");
  };
  
  // Terminer une tournée complète
  const handleCompleteRound = (roundId: string) => {
    setRounds(prev => 
      prev.map(round => 
        round.id === roundId 
          ? { ...round, completed: true, stops: round.stops.map(stop => ({ ...stop, completed: true })) } 
          : round
      )
    );
    
    setShowAnimation(true);
    toast.success("Tournée terminée avec succès");
  };
  
  // Naviguer vers l'adresse d'un patient
  const handleNavigateToAddress = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast.info(`Navigation vers : ${address}`);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Planning des tournées</h1>
      </div>
      
      <div className="grid gap-6">
        {rounds.map(round => (
          <Card key={round.id} className={round.completed ? "opacity-60" : ""}>
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
                  onClick={() => handleCompleteRound(round.id)}
                  disabled={!round.stops.every(stop => stop.completed)}
                >
                  <Car className="mr-2 h-4 w-4" />
                  Terminer la tournée
                </Button>
              ) : (
                <Button 
                  onClick={() => handleStartRound(round.id)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Démarrer la tournée
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {round.stops.map((stop) => (
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
                          onClick={() => handleNavigateToAddress(stop.patient.address)}
                        >
                          <MapPin className="mr-2 h-3 w-3" />
                          Itinéraire
                        </Button>
                        {stop.completed ? (
                          <Button variant="ghost" size="sm" className="text-green-600" disabled>
                            <CheckCircle className="mr-2 h-3 w-3" />
                            Terminé
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleCompleteStop(round.id, stop.id)}
                            disabled={!round.started}
                          >
                            <CheckCircle className="mr-2 h-3 w-3" />
                            Terminer
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <CompleteRoundAnimation 
        isOpen={showAnimation} 
        onClose={() => setShowAnimation(false)} 
      />
    </div>
  );
};

export default Rounds;
