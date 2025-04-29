
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Send, Search, ArrowLeft, Info } from "lucide-react";
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MessagingService, PatientMessage } from '@/services/MessagingService';
import { PatientService } from '@/services/PatientService';
import { useProfile } from '@/hooks/useProfile';

const PatientMessages = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Charger la liste des patients
  useEffect(() => {
    const loadPatients = async () => {
      setIsLoading(true);
      try {
        const patientsData = await PatientService.getAllPatients();
        setPatients(patientsData);
        setFilteredPatients(patientsData);
        
        // Charger le nombre de messages non lus pour chaque patient
        const counts: Record<string, number> = {};
        for (const patient of patientsData) {
          if (patient.id) {
            const count = await MessagingService.getUnreadMessagesCount(patient.id);
            if (count > 0) {
              counts[patient.id] = count;
            }
          }
        }
        setUnreadCounts(counts);
      } catch (error) {
        console.error("Erreur lors du chargement des patients:", error);
        toast.error("Erreur lors du chargement des patients");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPatients();
  }, []);

  // Filtrer les patients en fonction de la recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPatients(
        patients.filter(patient => 
          `${patient.firstName} ${patient.name}`.toLowerCase().includes(query) ||
          patient.phoneNumber?.toLowerCase().includes(query) ||
          patient.email?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, patients]);

  // Charger les messages pour un patient sélectionné
  useEffect(() => {
    if (currentPatientId) {
      const loadMessages = async () => {
        setIsLoading(true);
        try {
          const messagesData = await MessagingService.getPatientMessages(currentPatientId);
          setMessages(messagesData);
          
          // Marquer les messages comme lus
          for (const message of messagesData) {
            if (message.is_from_patient && !message.read_at) {
              await MessagingService.markMessageAsRead(message.id);
            }
          }
          
          // Mettre à jour le compteur de messages non lus
          const newUnreadCounts = { ...unreadCounts };
          if (newUnreadCounts[currentPatientId]) {
            newUnreadCounts[currentPatientId] = 0;
            setUnreadCounts(newUnreadCounts);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des messages:", error);
          toast.error("Erreur lors du chargement des messages");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadMessages();
    }
  }, [currentPatientId]);

  // Faire défiler vers le bas quand de nouveaux messages sont chargés
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentPatientId || !newMessage.trim() || !profile?.id) {
      return;
    }
    
    try {
      const sentMessage = await MessagingService.sendMessageToPatient(
        currentPatientId,
        profile.id,
        newMessage.trim()
      );
      
      if (sentMessage) {
        setMessages(prevMessages => [sentMessage, ...prevMessages]);
        setNewMessage('');
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const formatMessageDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        return format(date, 'HH:mm', { locale: fr });
      } else {
        return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
      }
    } catch (error) {
      return dateStr;
    }
  };

  const getPatientInitials = (patient: any) => {
    if (!patient) return '??';
    return `${patient.firstName?.[0] || ''}${patient.name?.[0] || ''}`.toUpperCase();
  };
  
  const currentPatient = patients.find(p => p.id === currentPatientId);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messagerie Patients</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Liste des patients */}
        <div className="md:col-span-1 space-y-4">
          <Card className="h-[calc(100vh-180px)] flex flex-col">
            <CardHeader className="px-4 py-3">
              <CardTitle className="text-lg">Patients</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un patient..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <div className="px-2">
                {isLoading && !currentPatientId ? (
                  <div className="flex justify-center p-4">
                    <div>Chargement...</div>
                  </div>
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`flex items-center p-3 rounded-md cursor-pointer mb-1 ${
                        currentPatientId === patient.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setCurrentPatientId(patient.id)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getPatientInitials(patient)}</AvatarFallback>
                        </Avatar>
                        {unreadCounts[patient.id] && unreadCounts[patient.id] > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {unreadCounts[patient.id]}
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="font-medium">{patient.firstName} {patient.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {patient.phoneNumber || patient.email || "Pas de contact"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun patient trouvé
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Zone de messagerie */}
        <Card className="md:col-span-2 h-[calc(100vh-180px)] flex flex-col">
          {currentPatientId && currentPatient ? (
            <>
              <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 md:hidden"
                    onClick={() => setCurrentPatientId(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-lg">{currentPatient.firstName} {currentPatient.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {currentPatient.phoneNumber || currentPatient.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/patients/${currentPatientId}`}>
                    <Info className="h-4 w-4 mr-1" />
                    Fiche patient
                  </Link>
                </Button>
              </CardHeader>
              
              <Separator />
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-auto p-4">
                <div className="flex flex-col-reverse">
                  <div ref={messagesEndRef} />
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 max-w-[80%] ${
                          message.is_from_patient
                            ? 'self-start'
                            : 'self-end ml-auto'
                        }`}
                      >
                        <div
                          className={`rounded-lg p-3 ${
                            message.is_from_patient
                              ? 'bg-accent'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatMessageDate(message.created_at)}
                          {message.is_from_patient && message.read_at && " • Lu"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Aucun message avec ce patient</p>
                      <p className="text-sm">Envoyez un premier message pour démarrer la conversation</p>
                    </div>
                  )}
                </div>
              </CardContent>
              
              {/* Zone de saisie */}
              <div className="p-4 border-t bg-card">
                <div className="flex gap-2">
                  <Input
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <Send className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium mb-2">Messagerie Patient</h3>
                <p>Sélectionnez un patient pour commencer une conversation</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PatientMessages;
