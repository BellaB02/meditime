
import { RoundStop } from "@/types/rounds";
import { toast } from "sonner";

export interface OptimizationResult {
  originalStops: RoundStop[];
  optimizedStops: RoundStop[];
  totalDistanceSaved: number; // in km
  totalTimeSaved: number; // in minutes
  optimizedRoute: string; // Google Maps URL
}

export const RouteOptimizerService = {
  /**
   * Optimize a route by reordering stops to minimize total distance
   */
  optimizeRoute: async (stops: RoundStop[]): Promise<OptimizationResult> => {
    if (!stops || stops.length < 3) {
      // No optimization needed for 0, 1 or 2 stops
      return {
        originalStops: [...stops],
        optimizedStops: [...stops],
        totalDistanceSaved: 0,
        totalTimeSaved: 0,
        optimizedRoute: generateGoogleMapsUrl(stops)
      };
    }
    
    try {
      toast.info("Optimisation de l'itinéraire en cours...");
      
      // In a real application, you would use an API service like Google Directions API,
      // GraphHopper, or MapBox Optimization API to handle this calculation.
      // This is a simplified simulation of route optimization.
      
      // For demonstration, we'll use a simulated optimization
      const simulatedOptimization = await simulateRouteOptimization(stops);
      
      toast.success("Itinéraire optimisé avec succès", {
        description: `Gain estimé: ${simulatedOptimization.totalDistanceSaved.toFixed(1)} km / ${simulatedOptimization.totalTimeSaved} min`
      });
      
      return simulatedOptimization;
    } catch (error) {
      console.error("Route optimization error:", error);
      toast.error("Erreur lors de l'optimisation de l'itinéraire");
      
      // Return original route on error
      return {
        originalStops: stops,
        optimizedStops: stops,
        totalDistanceSaved: 0,
        totalTimeSaved: 0,
        optimizedRoute: generateGoogleMapsUrl(stops)
      };
    }
  },
  
  /**
   * Generate optimized Google Maps URL for multiple stops
   */
  generateOptimizedMapUrl: (stops: RoundStop[]): string => {
    return generateGoogleMapsUrl(stops);
  }
};

/**
 * Generate Google Maps URL for navigation
 */
const generateGoogleMapsUrl = (stops: RoundStop[]): string => {
  if (!stops || stops.length < 2) {
    toast.error("Au moins 2 arrêts sont nécessaires pour générer un itinéraire");
    return "";
  }
  
  // Extract addresses
  const addresses = stops.map(stop => {
    if (stop.patient && stop.patient.address) {
      return encodeURIComponent(stop.patient.address);
    }
    return "";
  }).filter(address => address !== "");
  
  // Create a Google Maps URL with waypoints
  const origin = addresses[0];
  const destination = addresses[addresses.length - 1];
  const waypoints = addresses.slice(1, -1).join('|');
  
  // Build the URL
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  
  // Add waypoints if there are intermediate stops
  const finalUrl = waypoints ? `${url}&waypoints=${waypoints}` : url;
  
  return finalUrl;
};

/**
 * Simulate route optimization for demonstration
 * In a real application, this would call an external API
 */
const simulateRouteOptimization = async (stops: RoundStop[]): Promise<OptimizationResult> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // This is a simplified algorithm that doesn't actually optimize the route
      // but simulates what a real optimization service would return
      
      // For demo purposes, we'll reorder some stops to simulate optimization
      const reorderedStops = [...stops];
      
      if (reorderedStops.length > 3) {
        // Swap some middle stops to simulate optimization
        const midIdx = Math.floor(reorderedStops.length / 2);
        const temp = reorderedStops[midIdx];
        reorderedStops[midIdx] = reorderedStops[midIdx + 1];
        reorderedStops[midIdx + 1] = temp;
      }
      
      // Re-number the stop_order after optimization
      const optimizedStops = reorderedStops.map((stop, index) => ({
        ...stop,
        stop_order: index + 1
      }));
      
      // Simulate distance and time saved
      const distanceSaved = 2 + Math.random() * 5; // Between 2-7 km
      const timeSaved = Math.floor(5 + Math.random() * 15); // Between 5-20 minutes
      
      resolve({
        originalStops: stops,
        optimizedStops,
        totalDistanceSaved: distanceSaved,
        totalTimeSaved: timeSaved,
        optimizedRoute: generateGoogleMapsUrl(optimizedStops)
      });
    }, 1500); // Simulate 1.5s API delay
  });
};
