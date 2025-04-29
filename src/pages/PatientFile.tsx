import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User, Calendar, Activity, FileText, MessageSquare, Edit, Plus, Trash2, Download } from 'lucide-react';
import { usePatientsService } from '@/hooks/usePatientsService';
import { Patient, LegacyVitalSign } from '@/integrations/supabase/services/types';
import { PatientService } from '@/services/PatientService';
import MessagingTab from '@/components/patient/MessagingTab';

// Composant pour afficher les informations du patient
const PatientInfo = ({ patient, isLoading, onEdit }: { patient: Patient | null, isLoading: boolean, onEdit: () => void }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <h3 className="text-lg font-medium">Patient non trouvé</h3>
            <p className="text-muted-foreground mt-2">
              Le patient que vous recherchez n'existe pas ou a été supprimé.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Informations du patient</CardTitle>
          <CardDescription>
            Dossier créé le {patient.created_at ? format(new Date(patient.created_at), 'PPP', { locale: fr }) : 'N/A'}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Modifier
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Nom complet</h3>
              <p>{patient.first_name} {patient.last_name}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Date de naissance</h3>
              <p>{patient.date_of_birth ? format(new Date(patient.date_of_birth), 'PPP', { locale: fr }) : 'Non renseignée'}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Numéro de sécurité sociale</h3>
              <p>{patient.social_security_number || 'Non renseigné'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Adresse</h3>
              <p>{patient.address || 'Non renseignée'}</p>
              <p>{patient.postal_code} {patient.city}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Contact</h3>
              <p>Tél: {patient.phone || 'Non renseigné'}</p>
              <p>Email: {patient.email || 'Non renseigné'}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Médecin traitant</h3>
          <p>{patient.doctor || 'Non renseigné'}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-1">Notes médicales</h3>
          <p className="whitespace-pre-wrap">{patient.medical_notes || 'Aucune note'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant pour afficher les visites du patient
const VisitsTab = ({ patientId }: { patientId: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des visites</CardTitle>
        <CardDescription>
          Consultez l'historique des visites et rendez-vous du patient
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10 text-muted-foreground">
          Fonctionnalité en cours de développement
        </div>
      </CardContent>
    </Card>
  );
};

// Composant pour afficher les signes vitaux du patient
const VitalSignsTab = ({ 
  patientId, 
  vitalSigns, 
  isLoading, 
  onAddVitalSign 
}: { 
  patientId: string, 
  vitalSigns: any[], 
  isLoading: boolean, 
  onAddVitalSign: () => void 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-60 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Signes vitaux</CardTitle>
          <CardDescription>
            Historique des mesures de signes vitaux du patient
          </CardDescription>
        </div>
        <Button onClick={onAddVitalSign}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        {vitalSigns.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Aucun signe vital enregistré pour ce patient
          </div>
        ) : (
          <div className="space-y-4">
            {vitalSigns.map((sign, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">
                    {sign.recorded_at ? format(new Date(sign.recorded_at), 'PPP', { locale: fr }) : 'Date inconnue'}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {sign.recorded_at ? format(new Date(sign.recorded_at), 'HH:mm', { locale: fr }) : ''}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Température</p>
                    <p className="font-medium">{sign.temperature ? `${sign.temperature}°C` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rythme cardiaque</p>
                    <p className="font-medium">{sign.heart_rate ? `${sign.heart_rate} bpm` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pression artérielle</p>
                    <p className="font-medium">{sign.blood_pressure || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saturation O₂</p>
                    <p className="font-medium">{sign.oxygen_saturation ? `${sign.oxygen_saturation}%` : 'N/A'}</p>
                  </div>
                </div>
                {sign.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{sign.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Composant pour afficher les ordonnances du patient
const PrescriptionsTab = ({ patientId }: { patientId: string }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Ordonnances et documents</CardTitle>
          <CardDescription>
            Gérez les ordonnances et documents médicaux du patient
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Importer
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Créer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10 text-muted-foreground">
          Aucun document disponible pour ce patient
        </div>
      </CardContent>
    </Card>
  );
};

const PatientFile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isVitalSignDialogOpen, setIsVitalSignDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Patient>>({});
  const [vitalSignFormData, setVitalSignFormData] = useState<LegacyVitalSign>({
    date: new Date().toISOString(),
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    notes: ''
  });
  
  // Hooks pour les requêtes API
  const { usePatient, useUpdatePatient, usePatientVitalSigns, useAddVitalSign } = usePatientsService();
  const { data: patient, isLoading } = usePatient(id || '');
  const { data: vitalSigns, isLoading: isVitalSignsLoading } = usePatientVitalSigns(id || '');
  const updatePatientMutation = useUpdatePatient();
  const addVitalSignMutation = useAddVitalSign();
  
  // Initialiser le formulaire d'édition avec les données du patient
  useEffect(() => {
    if (patient) {
      setEditFormData({
        first_name: patient.first_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        address: patient.address,
        city: patient.city,
        postal_code: patient.postal_code,
        phone: patient.phone,
        email: patient.email,
        doctor: patient.doctor,
        social_security_number: patient.social_security_number,
        medical_notes: patient.medical_notes
      });
    }
  }, [patient]);
  
  // Gérer la soumission du formulaire d'édition
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    updatePatientMutation.mutate({
      patientId: id,
      data: editFormData
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
      }
    });
  };
  
  // Gérer la soumission du formulaire de signes vitaux
  const handleVitalSignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    addVitalSignMutation.mutate({
      patientId: id,
      vitalSign: vitalSignFormData
    }, {
      onSuccess: () => {
        setIsVitalSignDialogOpen(false);
        setVitalSignFormData({
          date: new Date().toISOString(),
          temperature: '',
          heartRate: '',
          bloodPressure: '',
          notes: ''
        });
      }
    });
  };
  
  // Gérer l'ouverture du formulaire de signes vitaux
  const handleAddVitalSign = () => {
    setVitalSignFormData({
      date: new Date().toISOString(),
      temperature: '',
      heartRate: '',
      bloodPressure: '',
      notes: ''
    });
    setIsVitalSignDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isLoading ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            patient ? `${patient.first_name} ${patient.last_name}` : 'Patient non trouvé'
          )}
        </h1>
        <Button variant="outline" onClick={() => navigate('/patients')}>
          Retour à la liste
        </Button>
      </div>
      
    <Tabs defaultValue="info" className="space-y-4">
      <TabsList>
        <TabsTrigger value="info" className="flex items-center gap-1">
          <User size={14} /> Informations
        </TabsTrigger>
        <TabsTrigger value="visits" className="flex items-center gap-1">
          <Calendar size={14} /> Visites
        </TabsTrigger>
        <TabsTrigger value="vital-signs" className="flex items-center gap-1">
          <Activity size={14} /> Signes vitaux
        </TabsTrigger>
        <TabsTrigger value="prescriptions" className="flex items-center gap-1">
          <FileText size={14} /> Ordonnances
        </TabsTrigger>
        <TabsTrigger value="messaging" className="flex items-center gap-1">
          <MessageSquare size={14} /> Messagerie
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
        <PatientInfo
          patient={patient}
          isLoading={isLoading}
          onEdit={() => setIsEditDialogOpen(true)}
        />
      </TabsContent>
      
      <TabsContent value="visits">
        <VisitsTab patientId={id} />
      </TabsContent>
      
      <TabsContent value="vital-signs">
        <VitalSignsTab
          patientId={id}
          vitalSigns={vitalSigns}
          isLoading={isVitalSignsLoading}
          onAddVitalSign={handleAddVitalSign}
        />
      </TabsContent>
      
      <TabsContent value="prescriptions">
        <PrescriptionsTab patientId={id} />
      </TabsContent>
      
      <TabsContent value="messaging">
        <MessagingTab />
      </TabsContent>
    </Tabs>
      
      {/* Dialogue d'édition du patient */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier les informations du patient</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations du patient. Cliquez sur enregistrer lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    value={editFormData.first_name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Nom</Label>
                  <Input
                    id="last_name"
                    value={editFormData.last_name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="date_of_birth">Date de naissance</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={editFormData.date_of_birth?.split('T')[0] || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, date_of_birth: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="social_security_number">Numéro de sécurité sociale</Label>
                <Input
                  id="social_security_number"
                  value={editFormData.social_security_number || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, social_security_number: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={editFormData.address || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">Code postal</Label>
                  <Input
                    id="postal_code"
                    value={editFormData.postal_code || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, postal_code: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={editFormData.city || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="doctor">Médecin traitant</Label>
                <Input
                  id="doctor"
                  value={editFormData.doctor || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, doctor: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="medical_notes">Notes médicales</Label>
                <Textarea
                  id="medical_notes"
                  value={editFormData.medical_notes || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, medical_notes: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={updatePatientMutation.isPending}>
                {updatePatientMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'ajout de signes vitaux */}
      <Dialog open={isVitalSignDialogOpen} onOpenChange={setIsVitalSignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter des signes vitaux</DialogTitle>
            <DialogDescription>
              Enregistrez les signes vitaux du patient.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleVitalSignSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="temperature">Température (°C)</Label>
                <Input
                  id="temperature"
                  type="text"
                  placeholder="37.0"
                  value={vitalSignFormData.temperature}
                  onChange={(e) => setVitalSignFormData({ ...vitalSignFormData, temperature: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="heartRate">Rythme cardiaque (bpm)</Label>
                <Input
                  id="heartRate"
                  type="text"
                  placeholder="80"
                  value={vitalSignFormData.heartRate}
                  onChange={(e) => setVitalSignFormData({ ...vitalSignFormData, heartRate: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="bloodPressure">Pression artérielle (mmHg)</Label>
                <Input
                  id="bloodPressure"
                  type="text"
                  placeholder="120/80"
                  value={vitalSignFormData.bloodPressure}
                  onChange={(e) => setVitalSignFormData({ ...vitalSignFormData, bloodPressure: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Observations supplémentaires"
                  value={vitalSignFormData.notes}
                  onChange={(e) => setVitalSignFormData({ ...vitalSignFormData, notes: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsVitalSignDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={addVitalSignMutation.isPending}>
                {addVitalSignMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientFile;
