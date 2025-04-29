
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MessageSquare, 
  FileText, 
  Activity, 
  PlusCircle, 
  Heart,
  Clock,
  User,
  ChevronRight
} from "lucide-react";
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

const PatientPortal = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [vitalSigns, setVitalSigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler la récupération des données du patient connecté
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // En production, nous utiliserions la session de l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }
        
        // Trouver le patient associé à cet utilisateur
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (patientError || !patientData) {
          throw new Error("Patient non trouvé");
        }
        
        setPatient(patientData);
        
        // Récupérer les rendez-vous
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', patientData.id)
          .order('date', { ascending: true })
          .limit(5);
          
        setAppointments(appointmentsData || []);
        
        // Récupérer les messages
        const { data: messagesData } = await supabase
          .from('patient_messages')
          .select('*')
          .eq('patient_id', patientData.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        setMessages(messagesData || []);
        
        // Récupérer les documents
        const { data: documentsData } = await supabase
          .from('care_documents')
          .select('*')
          .eq('patient_id', patientData.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        setDocuments(documentsData || []);
        
        // Récupérer les signes vitaux
        const { data: vitalSignsData } = await supabase
          .from('vital_signs')
          .select('*')
          .eq('patient_id', patientData.id)
          .order('recorded_at', { ascending: false })
          .limit(5);
          
        setVitalSigns(vitalSignsData || []);
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Erreur lors du chargement de vos données");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const formatRelativeDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    
    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return "Hier";
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE', { locale: fr });
    } else if (isThisMonth(date)) {
      return format(date, 'dd MMMM', { locale: fr });
    } else {
      return format(date, 'dd/MM/yyyy', { locale: fr });
    }
  };
  
  const getAppointmentStatus = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Planifié</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Terminé</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        
        <Skeleton className="h-10 w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
        
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Bienvenue, {patient?.first_name}
            </h1>
            <p className="text-muted-foreground">
              Voici votre espace patient personnel
            </p>
          </div>
        </div>
        <Button className="flex items-center gap-2" onClick={() => navigate('/patient-messages')}>
          <MessageSquare size={16} /> Contacter mon soignant
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <Activity size={14} /> Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-1">
            <Calendar size={14} /> Rendez-vous
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText size={14} /> Documents
          </TabsTrigger>
          <TabsTrigger value="measurements" className="flex items-center gap-1">
            <Heart size={14} /> Mesures
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={18} /> Prochains rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucun rendez-vous à venir
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-start justify-between pb-3 border-b last:border-0">
                        <div>
                          <div className="font-medium">{appointment.care_type}</div>
                          <div className="text-muted-foreground text-sm flex items-center gap-1">
                            <Clock size={14} />
                            {format(parseISO(appointment.date), 'EEEE d MMMM', { locale: fr })} à {appointment.time}
                          </div>
                        </div>
                        <div>
                          {getAppointmentStatus(appointment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="ghost" className="flex items-center gap-1" size="sm">
                  Voir tout <ChevronRight size={14} />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare size={18} /> Messages récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucun message récent
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.slice(0, 3).map((message) => (
                      <div key={message.id} className="pb-3 border-b last:border-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{message.is_from_patient ? 'Vous' : 'Soignant'}</div>
                          <div className="text-muted-foreground text-xs">
                            {formatRelativeDate(message.created_at)}
                          </div>
                        </div>
                        <p className="text-sm line-clamp-2 mt-1">{message.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="ghost" className="flex items-center gap-1" size="sm">
                  Voir tout <ChevronRight size={14} />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart size={18} /> Dernières mesures
                </CardTitle>
                <CardDescription>
                  Vos constantes vitales récentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {vitalSigns.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucune mesure récente
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Température</th>
                          <th className="px-4 py-2">Rythme cardiaque</th>
                          <th className="px-4 py-2">Pression artérielle</th>
                          <th className="px-4 py-2">Saturation O₂</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vitalSigns.map((vitalSign) => (
                          <tr key={vitalSign.id} className="border-t">
                            <td className="px-4 py-3">
                              {format(parseISO(vitalSign.recorded_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                            </td>
                            <td className="px-4 py-3">
                              {vitalSign.temperature ? `${vitalSign.temperature}°C` : '-'}
                            </td>
                            <td className="px-4 py-3">
                              {vitalSign.heart_rate ? `${vitalSign.heart_rate} bpm` : '-'}
                            </td>
                            <td className="px-4 py-3">
                              {vitalSign.blood_pressure || '-'}
                            </td>
                            <td className="px-4 py-3">
                              {vitalSign.oxygen_saturation ? `${vitalSign.oxygen_saturation}%` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" className="flex items-center gap-1">
                  <PlusCircle size={14} /> Ajouter une mesure
                </Button>
                <Button variant="ghost" className="flex items-center gap-1" size="sm">
                  Historique complet <ChevronRight size={14} />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Vos rendez-vous</CardTitle>
              <CardDescription>
                Consultez et gérez vos rendez-vous avec votre soignant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                Contenu détaillé des rendez-vous à implémenter
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Vos documents</CardTitle>
              <CardDescription>
                Accédez à vos documents médicaux et prescriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                Contenu détaillé des documents à implémenter
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="measurements">
          <Card>
            <CardHeader>
              <CardTitle>Vos mesures</CardTitle>
              <CardDescription>
                Suivez l'évolution de vos constantes vitales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                Contenu détaillé des mesures à implémenter
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientPortal;
