
import { usePractice } from "@/hooks/usePractice";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserWelcomeProps {
  firstName?: string;
  role?: string;
}

export const UserWelcome = ({ firstName, role }: UserWelcomeProps = {}) => {
  const { members } = usePractice();
  const isMobile = useIsMobile();
  
  // Get the current user (for now, we'll just use the first admin in the members list or the provided props)
  const currentUser = firstName ? { name: firstName, role } : members.find(member => member.role === "admin");
  
  // Get the current date in French format
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  return (
    <div className="mb-8">
      <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>
        Ravi de vous revoir{firstName || (currentUser && currentUser.name) ? `, ${firstName || (currentUser && currentUser.name)}` : ''}
      </h1>
      <p className="text-muted-foreground">{getCurrentDate()}</p>
    </div>
  );
};
