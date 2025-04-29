
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, MapPin, Route, Timer } from "lucide-react";
import { toast } from "sonner";
import { RouteOptimizerService } from "@/services/RouteOptimizerService";
import { RoundStop } from "@/types/rounds";

interface RouteOptimizerProps {
  stops: RoundStop[];
  onOptimized: (optimizedStops: RoundStop[]) => void;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ stops, onOptimized }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    distanceSaved: number;
    timeSaved: number;
  } | null>(null);
  
  const handleOptimizeRoute = async () => {
    if (stops.length < 3) {
      toast.info("L'optimisation n'est disponible qu'à partir de 3 arrêts");
      return;
    }
    
    setIsOptimizing(true);
    
    try {
      const result = await RouteOptimizerService.optimizeRoute(stops);
      
      // Update the state with the optimization results
      setOptimizationResult({
        distanceSaved: result.totalDistanceSaved,
        timeSaved: result.totalTimeSaved
      });
      
      // Send the optimized stops back to the parent component
      onOptimized(result.optimizedStops);
    } catch (error) {
      console.error("Optimization error:", error);
      toast.error("Erreur lors de l'optimisation de l'itinéraire");
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleOpenOptimizedMap = () => {
    const url = RouteOptimizerService.generateOptimizedMapUrl(stops);
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error("Impossible de générer l'itinéraire");
    }
  };
  
  return (
    <Card className="border-dashed border-primary/50 mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Route className="w-4 h-4 mr-2" />
          Optimisation d'itinéraire
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">
          Réorganisez automatiquement l'ordre des arrêts pour optimiser votre parcours et réduire le temps de trajet.
        </p>
        
        {optimizationResult && (
          <div className="mt-4 rounded-lg bg-primary/10 p-3">
            <div className="text-sm font-medium mb-1">Résultats de l'optimisation</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-primary/70" />
                <span>Distance économisée: <span className="font-medium">{optimizationResult.distanceSaved.toFixed(1)} km</span></span>
              </div>
              <div className="flex items-center">
                <Timer className="w-4 h-4 mr-1 text-primary/70" />
                <span>Temps économisé: <span className="font-medium">{optimizationResult.timeSaved} min</span></span>
              </div>
            </div>
            <div className="mt-2 text-xs flex items-center">
              <BadgeCheck className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-green-600">Itinéraire optimisé avec succès!</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenOptimizedMap}
          disabled={stops.length < 2}
          className="flex-1"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Voir l'itinéraire
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleOptimizeRoute}
          disabled={isOptimizing || stops.length < 3}
          className="flex-1"
        >
          {isOptimizing ? "Optimisation..." : "Optimiser l'itinéraire"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RouteOptimizer;
