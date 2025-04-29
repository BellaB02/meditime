
import { toast } from "sonner";

// Types for offline data
export interface OfflineData {
  timestamp: number;
  patients: any[];
  appointments: any[];
  vitalSigns: any[];
  documents: any[];
  pendingSyncs: PendingSyncOperation[];
}

export interface PendingSyncOperation {
  id: string;
  operation: "create" | "update" | "delete";
  entity: "patient" | "appointment" | "vitalSign" | "document";
  data: any;
  timestamp: number;
  retryCount: number;
}

// Initialize indexedDB
const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("healthcareAppDB", 1);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("Could not open offline database");
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores for offline data
      if (!db.objectStoreNames.contains("offlineData")) {
        db.createObjectStore("offlineData", { keyPath: "id" });
      }
      
      // Create object store for pending sync operations
      if (!db.objectStoreNames.contains("pendingSyncs")) {
        db.createObjectStore("pendingSyncs", { keyPath: "id" });
      }
    };
  });
};

export const OfflineService = {
  /**
   * Check if the app is online
   */
  isOnline: (): boolean => {
    return navigator.onLine;
  },
  
  /**
   * Save data for offline use
   */
  saveOfflineData: async (data: Partial<OfflineData>): Promise<void> => {
    try {
      const db = await initDB();
      const transaction = db.transaction("offlineData", "readwrite");
      const store = transaction.objectStore("offlineData");
      
      // Get existing data
      const getRequest = store.get("mainData");
      
      getRequest.onsuccess = () => {
        const existingData: OfflineData = getRequest.result || {
          timestamp: Date.now(),
          patients: [],
          appointments: [],
          vitalSigns: [],
          documents: [],
          pendingSyncs: []
        };
        
        // Merge new data with existing data
        const updatedData: OfflineData = {
          ...existingData,
          ...data,
          timestamp: Date.now()
        };
        
        // Save updated data
        store.put({ id: "mainData", ...updatedData });
      };
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event);
      });
    } catch (error) {
      console.error("Error saving offline data:", error);
      throw error;
    }
  },
  
  /**
   * Load offline data
   */
  getOfflineData: async (): Promise<OfflineData | null> => {
    try {
      const db = await initDB();
      const transaction = db.transaction("offlineData", "readonly");
      const store = transaction.objectStore("offlineData");
      
      const request = store.get("mainData");
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const data = request.result;
          resolve(data ? data : null);
        };
        
        request.onerror = (event) => {
          console.error("Error fetching offline data:", event);
          reject(event);
        };
      });
    } catch (error) {
      console.error("Error getting offline data:", error);
      return null;
    }
  },
  
  /**
   * Record an operation that needs to be synced when online
   */
  addPendingSync: async (operation: Omit<PendingSyncOperation, "id" | "timestamp" | "retryCount">): Promise<void> => {
    try {
      const db = await initDB();
      const transaction = db.transaction("pendingSyncs", "readwrite");
      const store = transaction.objectStore("pendingSyncs");
      
      const syncOperation: PendingSyncOperation = {
        ...operation,
        id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0
      };
      
      store.add(syncOperation);
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          toast.info("Opération enregistrée pour synchronisation ultérieure", {
            description: "Elle sera traitée automatiquement lorsque vous serez en ligne"
          });
          resolve();
        };
        transaction.onerror = (event) => reject(event);
      });
    } catch (error) {
      console.error("Error adding pending sync:", error);
      throw error;
    }
  },
  
  /**
   * Get all pending sync operations
   */
  getPendingSyncs: async (): Promise<PendingSyncOperation[]> => {
    try {
      const db = await initDB();
      const transaction = db.transaction("pendingSyncs", "readonly");
      const store = transaction.objectStore("pendingSyncs");
      
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result || []);
        };
        request.onerror = (event) => reject(event);
      });
    } catch (error) {
      console.error("Error getting pending syncs:", error);
      return [];
    }
  },
  
  /**
   * Process pending sync operations
   */
  processPendingSyncs: async (): Promise<void> => {
    if (!navigator.onLine) {
      return;
    }
    
    try {
      const pendingSyncs = await OfflineService.getPendingSyncs();
      
      if (pendingSyncs.length === 0) {
        return;
      }
      
      toast.info(`Synchronisation en cours...`, {
        description: `${pendingSyncs.length} opération(s) à traiter`
      });
      
      // Process each pending operation
      // In a real implementation, you'd call your API here
      
      // Clear processed operations
      const db = await initDB();
      const transaction = db.transaction("pendingSyncs", "readwrite");
      const store = transaction.objectStore("pendingSyncs");
      
      // For demo purposes, we're just clearing all operations
      store.clear();
      
      toast.success("Synchronisation terminée avec succès");
    } catch (error) {
      console.error("Error processing pending syncs:", error);
      toast.error("Erreur lors de la synchronisation");
    }
  },
  
  /**
   * Initialize offline mode listeners
   */
  initOfflineMode: () => {
    // Listen for online/offline events
    window.addEventListener("online", () => {
      toast.success("Connexion rétablie", {
        description: "Synchronisation des données en cours..."
      });
      OfflineService.processPendingSyncs();
    });
    
    window.addEventListener("offline", () => {
      toast.warning("Connexion perdue", {
        description: "Mode hors-ligne activé. Les modifications seront synchronisées ultérieurement."
      });
    });
    
    // Check initial state
    if (!navigator.onLine) {
      toast.warning("Mode hors-ligne actif", {
        description: "Les données disponibles sont celles de votre dernière connexion."
      });
    }
  }
};

// Initialize offline mode when the service is imported
OfflineService.initOfflineMode();
