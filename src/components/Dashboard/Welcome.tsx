
import { usePractice } from "@/hooks/usePractice";

export const Welcome = () => {
  const { members } = usePractice();
  
  // Get the first admin as current user (for demo purposes)
  const currentUser = members.find(member => member.role === "admin");
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">
        {getGreeting()}, {currentUser.name.split(' ')[0]} !
      </h1>
      <p className="text-muted-foreground">Voici un aperçu de votre journée</p>
    </div>
  );
};
