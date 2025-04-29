
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Clock, CheckCircle, User, ChevronDown, Plus, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: "patient" | "caregiver";
  read: boolean;
}

interface Conversation {
  id: string;
  patientName: string;
  avatar?: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  messages: Message[];
}

const MessagingTab: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      patientName: "Jean Dupont",
      unreadCount: 2,
      lastMessage: "Bonjour, j'ai besoin de changer mon rendez-vous de demain...",
      lastMessageTime: new Date(2025, 3, 15, 10, 30),
      messages: [
        { 
          id: "msg-1", 
          content: "Bonjour, j'ai besoin de changer mon rendez-vous de demain car j'ai un empêchement. Serait-il possible de le déplacer à la semaine prochaine ?", 
          timestamp: new Date(2025, 3, 15, 10, 30), 
          sender: "patient", 
          read: true 
        },
        { 
          id: "msg-2", 
          content: "Bien sûr, je peux vous proposer mardi ou jeudi prochain à la même heure. Quelle date vous conviendrait le mieux ?", 
          timestamp: new Date(2025, 3, 15, 11, 15), 
          sender: "caregiver", 
          read: true 
        },
        { 
          id: "msg-3", 
          content: "Mardi serait parfait. Merci beaucoup pour votre flexibilité !", 
          timestamp: new Date(2025, 3, 15, 11, 45), 
          sender: "patient", 
          read: false 
        },
        { 
          id: "msg-4", 
          content: "J'aurais aussi besoin de savoir si je dois être à jeun pour le prochain rendez-vous?", 
          timestamp: new Date(2025, 3, 15, 11, 50), 
          sender: "patient", 
          read: false 
        }
      ]
    },
    {
      id: "conv-2",
      patientName: "Marie Martin",
      unreadCount: 0,
      lastMessage: "Je confirme avoir bien pris mes médicaments aujourd'hui.",
      lastMessageTime: new Date(2025, 3, 14, 15, 20),
      messages: [
        { 
          id: "msg-5", 
          content: "Bonjour, comment vous sentez-vous aujourd'hui?", 
          timestamp: new Date(2025, 3, 14, 15, 0), 
          sender: "caregiver", 
          read: true 
        },
        { 
          id: "msg-6", 
          content: "Je me sens beaucoup mieux, merci. Je confirme avoir bien pris mes médicaments aujourd'hui.", 
          timestamp: new Date(2025, 3, 14, 15, 20), 
          sender: "patient", 
          read: true 
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversations[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation, conversations]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation) {
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          content: newMessage.trim(),
          timestamp: new Date(),
          sender: "caregiver",
          read: true
        };
        return {
          ...conv,
          lastMessage: newMessage.trim(),
          lastMessageTime: new Date(),
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setNewMessage("");
    toast.success("Message envoyé");
  };

  const handleConversationSelect = (convId: string) => {
    // Marquer tous les messages comme lus
    const updatedConversations = conversations.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setSelectedConversation(convId);
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (date: Date) => {
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                   date.getMonth() === today.getMonth() && 
                   date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNewConversation = () => {
    toast.info("Fonctionnalité nouvelle conversation à implémenter");
  };

  return (
    <div className="flex h-[calc(100vh-220px)] overflow-hidden border rounded-md">
      {/* Liste des conversations */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Messages</h3>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleNewConversation} aria-label="Nouvelle conversation">
            <Plus size={16} />
          </Button>
        </div>
        <div className="divide-y">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedConversation === conv.id ? 'bg-muted' : ''}`}
              onClick={() => handleConversationSelect(conv.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conv.avatar} alt={conv.patientName} />
                  <AvatarFallback>
                    {conv.patientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-medium truncate">{conv.patientName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatConversationTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="ml-auto flex-shrink-0">{conv.unreadCount}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* En-tête de conversation */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {conversations.find(c => c.id === selectedConversation)?.patientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">
                  {conversations.find(c => c.id === selectedConversation)?.patientName}
                </h3>
              </div>
              <Button variant="ghost" size="icon" aria-label="Plus d'options">
                <ChevronDown size={18} />
              </Button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversations
                .find(c => c.id === selectedConversation)
                ?.messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'caregiver' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] p-3 rounded-lg ${
                        msg.sender === 'caregiver' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                        msg.sender === 'caregiver' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {formatMessageTime(msg.timestamp)}
                        {msg.sender === 'caregiver' && (
                          msg.read 
                            ? <CheckCircle size={12} className="ml-1" aria-label="Lu" />
                            : <Clock size={12} className="ml-1" aria-label="Envoyé" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Zone de saisie */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="h-10 w-10 p-0" 
                  onClick={() => toast.info("Fonctionnalité pièce jointe à implémenter")}
                  aria-label="Ajouter une pièce jointe"
                >
                  <Paperclip size={18} />
                </Button>
                <Input 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)} 
                  placeholder="Écrivez votre message..." 
                  className="flex-1"
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                  aria-label="Envoyer le message"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <User size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucune conversation sélectionnée</h3>
              <p className="text-muted-foreground mt-1">
                Sélectionnez une conversation ou créez-en une nouvelle
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingTab;
