
import { useRounds } from "@/hooks/useRounds";
import { RoundCard } from "@/components/Rounds/RoundCard";
import { CompleteRoundAnimation } from "@/components/Rounds/CompleteRoundAnimation";
import { StartRoundAnimation } from "@/components/Rounds/StartRoundAnimation";
import { RoundDialog } from "@/components/Rounds/RoundDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Rounds = () => {
  const {
    rounds,
    currentRound,
    showCompleteAnimation,
    showStartAnimation,
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
    handleNavigateToAddress,
    handleCreateRound,
    handleUpdateRound,
    handleDeleteRound,
    handleOpenEditRound
  } = useRounds();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Planning des tournées</h1>
        <Button onClick={() => setIsCreateRoundDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle tournée
        </Button>
      </div>
      
      <div className="grid gap-6">
        {rounds.map(round => (
          <RoundCard
            key={round.id}
            round={round}
            onStartRound={handleStartRound}
            onCompleteRound={handleCompleteRound}
            onCompleteStop={handleCompleteStop}
            onReactivateStop={handleReactivateStop}
            onNavigateToAddress={handleNavigateToAddress}
          />
        ))}
      </div>
      
      {/* Pas de tournées */}
      {rounds.length === 0 && (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <h3 className="text-lg font-medium">Aucune tournée planifiée</h3>
          <p className="text-muted-foreground">Créez une nouvelle tournée pour commencer</p>
          <Button 
            onClick={() => setIsCreateRoundDialogOpen(true)}
            className="mt-4"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une tournée
          </Button>
        </div>
      )}
      
      <CompleteRoundAnimation 
        isOpen={showCompleteAnimation} 
        onClose={() => setShowCompleteAnimation(false)} 
      />
      
      <StartRoundAnimation
        isOpen={showStartAnimation}
        onClose={() => setShowStartAnimation(false)}
      />
      
      <RoundDialog
        isOpen={isCreateRoundDialogOpen}
        onClose={() => setIsCreateRoundDialogOpen(false)}
        onSubmit={handleCreateRound}
        title="Créer une nouvelle tournée"
        description="Remplissez les informations pour créer une nouvelle tournée"
        actionLabel="Créer la tournée"
      />
      
      {currentRound && (
        <RoundDialog
          isOpen={isEditRoundDialogOpen}
          onClose={() => setIsEditRoundDialogOpen(false)}
          onSubmit={handleUpdateRound}
          initialData={currentRound}
          title="Modifier la tournée"
          description="Modifiez les informations de cette tournée"
          actionLabel="Enregistrer les modifications"
        />
      )}
    </div>
  );
};

export default Rounds;
