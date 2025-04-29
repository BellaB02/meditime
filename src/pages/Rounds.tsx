
import { RoundCard } from "@/components/Rounds/RoundCard";
import { RoundDialog } from "@/components/Rounds/RoundDialog";
import { CompleteRoundAnimation } from "@/components/Rounds/CompleteRoundAnimation";
import { StartRoundAnimation } from "@/components/Rounds/StartRoundAnimation";
import { CarParkingAnimation } from "@/components/Rounds/CarParkingAnimation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRounds } from "@/hooks/useRounds";

export default function Rounds() {
  const {
    rounds,
    currentRound,
    showCompleteAnimation,
    showStartAnimation,
    showCarParkingAnimation,
    isCreateRoundDialogOpen,
    isEditRoundDialogOpen,
    setShowCompleteAnimation,
    setShowStartAnimation,
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
  } = useRounds();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tournées</h1>
        <Button onClick={() => setIsCreateRoundDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle tournée
        </Button>
      </div>

      <div className="space-y-6">
        {rounds.map((round) => (
          <RoundCard
            key={round.id}
            round={round}
            onStartRound={handleStartRound}
            onCompleteRound={handleCompleteRound}
            onCompleteStop={handleCompleteStop}
            onReactivateStop={handleReactivateStop}
            onNavigateToAddress={handleNavigateToAddress}
            onEdit={handleOpenEditRound}
            onDelete={handleDeleteRound}
          />
        ))}
        
        {rounds.length === 0 && (
          <div className="text-center py-10 border rounded-md bg-muted/20">
            <h2 className="text-xl font-semibold mb-2">Aucune tournée</h2>
            <p className="text-muted-foreground mb-6">Vous n'avez aucune tournée planifiée.</p>
            <Button onClick={() => setIsCreateRoundDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une tournée
            </Button>
          </div>
        )}
      </div>

      {/* Create round dialog */}
      <RoundDialog
        isOpen={isCreateRoundDialogOpen}
        onClose={() => setIsCreateRoundDialogOpen(false)}
        onSubmit={handleCreateRound}
        title="Nouvelle tournée"
        description="Créez une nouvelle tournée et ajoutez les arrêts."
        actionLabel="Créer la tournée"
      />

      {/* Edit round dialog */}
      {currentRound && (
        <RoundDialog
          isOpen={isEditRoundDialogOpen}
          onClose={() => setIsEditRoundDialogOpen(false)}
          onSubmit={handleUpdateRound}
          initialData={currentRound}
          title="Modifier la tournée"
          description="Modifiez les détails de la tournée et ses arrêts."
          actionLabel="Enregistrer les modifications"
        />
      )}

      {/* Start round animation */}
      <StartRoundAnimation
        show={showStartAnimation}
        onComplete={() => setShowStartAnimation(false)}
      />
      
      {/* Car parking animation */}
      <CarParkingAnimation 
        show={showCarParkingAnimation}
        onComplete={handleCarParkingAnimationComplete}
      />

      {/* Complete round animation */}
      <CompleteRoundAnimation
        show={showCompleteAnimation}
        onComplete={() => setShowCompleteAnimation(false)}
      />
    </div>
  );
}
