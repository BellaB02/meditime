import { useState } from "react";
import { Round, RoundStop } from "@/types/rounds";
import { toast } from "sonner";

// Initial mock data
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

export const useRounds = () => {
  const [rounds, setRounds] = useState<Round[]>(initialRounds);
  const [showCompleteAnimation, setShowCompleteAnimation] = useState(false);
  const [showStartAnimation, setShowStartAnimation] = useState(false);
  const [showCarParkingAnimation, setShowCarParkingAnimation] = useState(false);
  const [isCreateRoundDialogOpen, setIsCreateRoundDialogOpen] = useState(false);
  const [isEditRoundDialogOpen, setIsEditRoundDialogOpen] = useState(false);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  
  // Start a round
  const handleStartRound = (roundId: string) => {
    setShowStartAnimation(true);
    
    setTimeout(() => {
      setRounds(prev => 
        prev.map(round => 
          round.id === roundId 
            ? { ...round, started: true } 
            : round
        )
      );
      
      toast.success("Tournée démarrée");
    }, 2000);
  };
  
  // Mark a stop as completed
  const handleCompleteStop = (roundId: string, stopId: string) => {
    setRounds(prev => 
      prev.map(round => {
        if (round.id === roundId) {
          const updatedStops = round.stops.map(stop => 
            stop.id === stopId ? { ...stop, completed: true } : stop
          );
          
          // Check if all stops are completed
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
  
  // Reactivate a stop
  const handleReactivateStop = (roundId: string, stopId: string) => {
    setRounds(prev => 
      prev.map(round => {
        if (round.id === roundId) {
          const updatedStops = round.stops.map(stop => 
            stop.id === stopId ? { ...stop, completed: false } : stop
          );
          
          // Update round status
          return {
            ...round,
            stops: updatedStops,
            completed: false // Round is no longer completed
          };
        }
        return round;
      })
    );
    
    toast.success("Soin remis en cours");
  };
  
  // Complete an entire round
  const handleCompleteRound = (roundId: string) => {
    setRounds(prev => 
      prev.map(round => 
        round.id === roundId 
          ? { 
              ...round, 
              completed: true, 
              started: false,
              stops: round.stops.map(stop => ({ ...stop, completed: true })) 
            } 
          : round
      )
    );
    
    // Show the car parking animation
    setShowCarParkingAnimation(true);
    
    toast.success("Tournée terminée avec succès");
  };
  
  // Handle car parking animation completion
  const handleCarParkingAnimationComplete = () => {
    setShowCarParkingAnimation(false);
    setShowCompleteAnimation(true);
    
    setTimeout(() => {
      setShowCompleteAnimation(false);
    }, 5000);
  };
  
  // Navigate to a patient's address
  const handleNavigateToAddress = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast.info(`Navigation vers : ${address}`);
  };
  
  // Create a new round
  const handleCreateRound = (round: Omit<Round, 'id'>) => {
    const newRound: Round = {
      ...round,
      id: `round-${Date.now()}`,
      completed: false,
      started: false
    };
    
    setRounds(prev => [...prev, newRound]);
    setIsCreateRoundDialogOpen(false);
    toast.success(`Tournée "${round.name}" créée avec succès`);
  };
  
  // Update an existing round
  const handleUpdateRound = (updatedRound: Round) => {
    setRounds(prev => 
      prev.map(round => 
        round.id === updatedRound.id ? updatedRound : round
      )
    );
    
    setIsEditRoundDialogOpen(false);
    toast.success(`Tournée "${updatedRound.name}" mise à jour`);
  };
  
  // Delete a round
  const handleDeleteRound = (roundId: string) => {
    setRounds(prev => prev.filter(round => round.id !== roundId));
    toast.success("Tournée supprimée");
  };
  
  // Open the edit round dialog
  const handleOpenEditRound = (round: Round) => {
    setCurrentRound(round);
    setIsEditRoundDialogOpen(true);
  };

  return {
    rounds,
    currentRound,
    showCompleteAnimation,
    showStartAnimation,
    showCarParkingAnimation,
    isCreateRoundDialogOpen,
    isEditRoundDialogOpen,
    setShowCompleteAnimation,
    setShowStartAnimation,
    setShowCarParkingAnimation,
    setIsCreateRoundDialogOpen,
    setIsEditRoundDialogOpen,
    handleStartRound,
    handleCompleteStop,
    handleReactivateStop,
    handleCompleteRound,
    handleCarParkingAnimationComplete,
    handleNavigateToAddress,
    handleCreateRound,
    handleUpdateRound,
    handleDeleteRound,
    handleOpenEditRound
  };
};
