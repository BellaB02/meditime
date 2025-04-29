
import { usePractice } from "@/hooks/usePractice";

export const UserWelcome = () => {
  const { members } = usePractice();
  
  // Get the current user (for now, we'll just use the first admin in the members list)
  const currentUser = members.find(member => member.role === "admin");
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };
  
  // Get the current date in French format
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  if (!currentUser) {
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bienvenue dans votre tableau de bord</h1>
        <p className="text-muted-foreground">{getCurrentDate()}</p>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">
        {getGreeting()}, {currentUser.name}
      </h1>
      <p className="text-muted-foreground">{getCurrentDate()}</p>
    </div>
  );
};
