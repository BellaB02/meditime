
import React, { useEffect, useState } from "react";
import { AlertCircle, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OfflineService } from "@/services/OfflineService";
import { MobileService } from "@/services/MobileService";

// Type declaration pour éviter les erreurs TypeScript
interface NetworkStatus {
  connected: boolean;
}

interface NetworkPlugin {
  getStatus(): Promise<NetworkStatus>;
  addListener(eventName: string, callback: (status: NetworkStatus) => void): {
    remove: () => void;
  };
}

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const isMobileApp = MobileService.isMobileApp();
  
  useEffect(() => {
    // Different listeners depending on platform
    if (isMobileApp) {
      // Mobile app - use Capacitor Network API
      let cleanup: (() => void) | undefined;
      
      const setupNetwork = async () => {
        try {
          // Import dynamique pour éviter les erreurs au build
          const capacitorNetwork = await import('@capacitor/network');
          const Network = capacitorNetwork.Network as NetworkPlugin;
          
          // Initial status check
          const status = await Network.getStatus();
          setIsOffline(!status.connected);
          
          // Listen for changes
          const listener = Network.addListener('networkStatusChange', status => {
            setIsOffline(!status.connected);
          });
          
          cleanup = () => {
            listener.remove();
          };
        } catch (error) {
          console.error("Error setting up network monitoring:", error);
          // Fallback to browser API if Capacitor fails
          setIsOffline(!navigator.onLine);
          
          // Set up browser event listeners as fallback
          const handleOnline = () => setIsOffline(false);
          const handleOffline = () => setIsOffline(true);
          
          window.addEventListener("online", handleOnline);
          window.addEventListener("offline", handleOffline);
          
          cleanup = () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
          };
        }
      };
      
      setupNetwork();
      
      return () => {
        if (cleanup) cleanup();
      };
    } else {
      // Web app - use browser events
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [isMobileApp]);
  
  useEffect(() => {
    const checkPendingSyncs = async () => {
      try {
        const syncs = await OfflineService.getPendingSyncs();
        setPendingSyncs(syncs.length);
      } catch (error) {
        console.error("Error checking pending syncs:", error);
      }
    };
    
    // Check initial pending syncs
    checkPendingSyncs();
    
    // Set up interval to check pending syncs
    const interval = setInterval(checkPendingSyncs, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  const handleSyncNow = () => {
    OfflineService.processPendingSyncs();
  };
  
  if (!isOffline && pendingSyncs === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-20 right-4 z-50 w-80">
      <Alert className={isOffline ? "bg-destructive/15 border-destructive" : "bg-amber-500/15 border-amber-500"}>
        {isOffline ? (
          <>
            <WifiOff className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive">Mode Hors-ligne</AlertTitle>
            <AlertDescription className="text-destructive/90">
              Vous êtes actuellement hors-ligne. Certaines fonctionnalités peuvent être limitées.
            </AlertDescription>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">{pendingSyncs} modification{pendingSyncs > 1 ? 's' : ''} en attente</AlertTitle>
            <AlertDescription className="text-amber-500/90 flex items-center justify-between">
              <span>Des modifications doivent être synchronisées.</span>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-amber-500 text-amber-500 hover:text-amber-600 mt-2"
                onClick={handleSyncNow}
              >
                Synchroniser
              </Button>
            </AlertDescription>
          </>
        )}
      </Alert>
    </div>
  );
};

export default OfflineIndicator;
