
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sentAt: Date;
  isFromPatient: boolean;
  isRead: boolean;
}

interface Conversation {
  id: string;
  title: string;
  lastMessageDate: Date;
  messages: Message[];
  unreadCount: number;
}

const MessagingTab: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "Traitement anticoagulant",
      lastMessageDate: new Date(Date.now() - 86400000), // Hier
      messages: [
        {
          id: "msg-1",
          content: "Bonjour, j'ai une question concernant mon traitement anticoagulant.",
          sentAt: new Date(Date.now() - 86400000 * 2),
          isFromPatient: true,
          isRead: true
        },
        {
          id: "msg-2",
          content: "Bonjour, bien sûr. Quelle est votre question ?",
          sentAt: new Date(Date.now() - 86400000),
          isFromPatient: false,
          isRead: true
        }
      ],
      unreadCount: 0
    }
  ]);
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const [newConversationMessage, setNewConversationMessage] = useState("");
  
  const handleSelectConversation = (conversation: Conversation) => {
    // Marquer les messages comme lus
    const updatedConversation = {
      ...conversation,
      messages: conversation.messages.map(msg => ({
        ...msg,
        isRead: true
      })),
      unreadCount: 0
    };
    
    // Mettre à jour la conversation dans la liste
    setConversations(conversations.map(conv => 
      conv.id === updatedConversation.id ? updatedConversation : conv
    ));
    
    setSelectedConversation(updatedConversation);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sentAt: new Date(),
      isFromPatient: false,
      isRead: true
    };
    
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessageDate: new Date()
    };
    
    setConversations(conversations.map(conv => 
      conv.id === updatedConversation.id ? updatedConversation : conv
    ));
    
    setSelectedConversation(updatedConversation);
    setNewMessage("");
    toast.success("Message envoyé");
  };
  
  const handleCreateNewConversation = () => {
    if (!newConversationTitle.trim() || !newConversationMessage.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: newConversationTitle,
      lastMessageDate: new Date(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          content: newConversationMessage,
          sentAt: new Date(),
          isFromPatient: false,
          isRead: true
        }
      ],
      unreadCount: 0
    };
    
    setConversations([newConversation, ...conversations]);
    setSelectedConversation(newConversation);
    setIsNewConversationOpen(false);
    setNewConversationTitle("");
    setNewConversationMessage("");
    toast.success("Nouvelle conversation créée");
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return `Aujourd'hui, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (days === 1) {
      return `Hier, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-300px)] max-h-[700px]">
      {/* Liste des conversations */}
      <Card className="md:col-span-1 flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Messages</CardTitle>
          <Button size="sm" onClick={() => setIsNewConversationOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-2">
          <div className="space-y-2">
            {conversations.map(conversation => (
              <div 
                key={conversation.id} 
                className={cn(
                  "p-3 rounded-md cursor-pointer",
                  selectedConversation?.id === conversation.id 
                    ? "bg-primary/10" 
                    : "hover:bg-accent"
                )}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{conversation.title}</h3>
                  {conversation.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center rounded-full bg-primary w-5 h-5 text-xs text-primary-foreground">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.messages.length > 0 
                    ? conversation.messages[conversation.messages.length - 1].content 
                    : "Pas de messages"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(conversation.lastMessageDate)}
                </p>
              </div>
            ))}
            
            {conversations.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                Aucune conversation
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Zone de messages */}
      <Card className="md:col-span-2 flex flex-col h-full">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b pb-3">
              <CardTitle>{selectedConversation.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map(message => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      message.isFromPatient 
                        ? "bg-accent ml-0 mr-auto" 
                        : "bg-primary text-primary-foreground ml-auto mr-0"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatDate(message.sentAt)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input 
                  placeholder="Tapez votre message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-center p-4 text-muted-foreground">
            <div>
              <h3 className="font-medium mb-2">Aucune conversation sélectionnée</h3>
              <p>Sélectionnez une conversation pour afficher les messages</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsNewConversationOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouvelle conversation
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Dialog pour créer une nouvelle conversation */}
      <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle conversation</DialogTitle>
            <DialogDescription>
              Créez une nouvelle conversation avec ce patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title">Objet</label>
              <Input
                id="title"
                placeholder="Ex: Suivi traitement, Question importante..."
                value={newConversationTitle}
                onChange={(e) => setNewConversationTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message">Message</label>
              <Textarea
                id="message"
                placeholder="Tapez votre premier message..."
                value={newConversationMessage}
                onChange={(e) => setNewConversationMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewConversationOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateNewConversation}>
              Créer conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagingTab;
