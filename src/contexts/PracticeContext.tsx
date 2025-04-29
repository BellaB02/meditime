
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface Member {
  id: string;
  name: string;
  role: "admin" | "nurse" | "secretary";
  avatar?: string;
  email: string;
  phone: string;
  bio?: string; // Add bio property as optional
}

interface Practice {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  members: Member[];
}

interface PracticeContextType {
  practice: Practice | null;
  members: Member[];
  currentMember: Member | null;
  isLoading: boolean;
  error: string | null;
  setPractice: (practice: Practice) => void;
  addMember: (member: Member) => void;
  removeMember: (memberId: string) => void;
  updateMember: (member: Member) => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

// Exemple de données pour le cabinet
const dummyPractice: Practice = {
  id: "practice-1",
  name: "Cabinet Infirmier Saint Louis",
  address: "123 Avenue des Soins, 75010 Paris",
  phone: "01 23 45 67 89",
  email: "contact@cabinet-infirmier.fr",
  members: [
    {
      id: "member-1",
      name: "Marie Dupont",
      role: "admin",
      avatar: "https://i.pravatar.cc/150?img=44",
      email: "marie.dupont@cabinet-infirmier.fr",
      phone: "06 12 34 56 78",
      bio: "Infirmière coordinatrice avec 15 ans d'expérience"
    },
    {
      id: "member-2",
      name: "Jean Martin",
      role: "nurse",
      avatar: "https://i.pravatar.cc/150?img=67",
      email: "jean.martin@cabinet-infirmier.fr",
      phone: "06 23 45 67 89",
      bio: "Infirmier DE spécialisé en soins palliatifs"
    },
    {
      id: "member-3",
      name: "Sophie Bernard",
      role: "secretary",
      avatar: "https://i.pravatar.cc/150?img=47",
      email: "sophie.bernard@cabinet-infirmier.fr",
      phone: "06 34 56 78 90",
      bio: "Secrétaire médicale expérimentée"
    }
  ]
};

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [practice, setPractice] = useState<Practice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);

  useEffect(() => {
    // Simuler le chargement des données du cabinet
    const loadPracticeData = async () => {
      try {
        // Dans une application réelle, ces données viendraient d'une API
        setTimeout(() => {
          setPractice(dummyPractice);
          setCurrentMember(dummyPractice.members[0]);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError("Erreur lors du chargement des données du cabinet");
        setIsLoading(false);
      }
    };

    loadPracticeData();
  }, []);

  // Ajouter un membre au cabinet
  const addMember = (member: Member) => {
    if (!practice) return;
    
    setPractice({
      ...practice,
      members: [...practice.members, member]
    });
  };

  // Supprimer un membre du cabinet
  const removeMember = (memberId: string) => {
    if (!practice) return;
    
    setPractice({
      ...practice,
      members: practice.members.filter(member => member.id !== memberId)
    });
  };

  // Mettre à jour un membre du cabinet
  const updateMember = (updatedMember: Member) => {
    if (!practice) return;
    
    setPractice({
      ...practice,
      members: practice.members.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    });
  };

  return (
    <PracticeContext.Provider
      value={{
        practice,
        members: practice?.members || [],
        currentMember,
        isLoading,
        error,
        setPractice,
        addMember,
        removeMember,
        updateMember
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

export function usePractice() {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error("usePractice must be used within a PracticeProvider");
  }
  return context;
}
