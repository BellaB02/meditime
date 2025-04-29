
import { useState } from "react";

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Practice {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const usePractice = () => {
  const [practice, setPractice] = useState<Practice>({
    id: "practice-1",
    name: "Cabinet Infirmier Parisien",
    address: "123 Avenue des Soins, 75001 Paris",
    phone: "01 23 45 67 89",
    email: "contact@cabinet-infirmier.fr"
  });

  const [members, setMembers] = useState<Member[]>([
    {
      id: "member-1",
      name: "Thomas Dubois",
      role: "admin",
      email: "thomas.dubois@cabinet-infirmier.fr",
      phone: "06 12 34 56 78",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas"
    },
    {
      id: "member-2",
      name: "Sophie Laurent",
      role: "nurse",
      email: "sophie.laurent@cabinet-infirmier.fr",
      phone: "06 23 45 67 89",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie"
    },
    {
      id: "member-3",
      name: "Marc Petit",
      role: "secretary",
      email: "marc.petit@cabinet-infirmier.fr",
      phone: "06 34 56 78 90",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc"
    }
  ]);

  // Add currentMember state
  const [currentMember, setCurrentMember] = useState<Member | null>(members[0]);

  // Mettre à jour les informations du cabinet
  const updatePractice = (updatedPractice: Partial<Practice>) => {
    setPractice(prev => ({ ...prev, ...updatedPractice }));
  };

  // Ajouter un nouveau membre
  const addMember = (member: Omit<Member, "id" | "avatar">) => {
    const newMember: Member = {
      ...member,
      id: `member-${Date.now()}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name.split(' ')[0]}`
    };
    setMembers(prev => [...prev, newMember]);
  };

  // Supprimer un membre
  const removeMember = (memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
  };

  // Modifier un membre
  const updateMember = (memberId: string, updatedMember: Partial<Member>) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, ...updatedMember } 
          : member
      )
    );
  };

  // Set current member
  const setCurrentMemberById = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setCurrentMember(member);
    }
  };

  return {
    practice,
    members,
    currentMember,
    updatePractice,
    addMember,
    removeMember,
    updateMember,
    setCurrentMember,
    setCurrentMemberById
  };
};
