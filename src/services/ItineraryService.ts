
import { RoundStop } from "@/types/rounds";
import { toast } from "sonner";

export const ItineraryService = {
  /**
   * Generate a Google Maps itinerary for a list of stops
   */
  generateItinerary: (stops: RoundStop[]): string => {
    // Check if there are enough stops
    if (!stops || stops.length < 2) {
      toast.error("Au moins 2 arrêts sont nécessaires pour générer un itinéraire");
      return "";
    }
    
    // Extract addresses
    const addresses = stops.map(stop => encodeURIComponent(stop.patient.address));
    
    // Create a Google Maps URL with waypoints
    const origin = addresses[0];
    const destination = addresses[addresses.length - 1];
    const waypoints = addresses.slice(1, -1).join('|');
    
    // Build the URL
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    
    // Add waypoints if there are intermediate stops
    const finalUrl = waypoints ? `${url}&waypoints=${waypoints}` : url;
    
    return finalUrl;
  },
  
  /**
   * Open the itinerary in a new tab
   */
  openItinerary: (stops: RoundStop[]): void => {
    const url = ItineraryService.generateItinerary(stops);
    
    if (url) {
      window.open(url, '_blank');
      toast.success("Itinéraire ouvert dans Google Maps");
    }
  }
};
