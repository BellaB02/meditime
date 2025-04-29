
import { useRounds } from "@/hooks/useRounds";
import { RoundCard } from "@/components/Rounds/RoundCard";
import { CompleteRoundAnimation } from "@/components/Rounds/CompleteRoundAnimation";
import { StartRoundAnimation } from "@/components/Rounds/StartRoundAnimation";

const Rounds = () => {
  const {
    rounds,
    showCompleteAnimation,
    showStartAnimation,
    setShowCompleteAnimation,
    setShowStartAnimation,
    handleStartRound,
    handleCompleteStop,
    handleReactivateStop,
    handleCompleteRound,
    handleNavigateToAddress
  } = useRounds();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Planning des tournées</h1>
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
      
      <CompleteRoundAnimation 
        isOpen={showCompleteAnimation} 
        onClose={() => setShowCompleteAnimation(false)} 
      />
      
      <StartRoundAnimation
        isOpen={showStartAnimation}
        onClose={() => setShowStartAnimation(false)}
      />
    </div>
  );
};

export default Rounds;
