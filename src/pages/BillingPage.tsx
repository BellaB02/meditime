
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Euro,
  Receipt,
  Check,
  FilePlus,
  Calendar,
  User,
  Plus,
  Trash,
  Download,
  Printer,
  AlertCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

// Types
interface BillingFormValues {
  patient: string;
  date: string;
  acts: string[];
  majorations: string[];
  comment: string;
}

interface NursingAct {
  id: string;
  code: string;
  description: string;
  rate: number;
  active: boolean;
}

interface Majoration {
  id: string;
  code: string;
  description: string;
  rate: number;
  active: boolean;
}

// Données fictives pour les patients
const patients = [
  { id: "p1", name: "Jean Dupont" },
  { id: "p2", name: "Marie Martin" },
  { id: "p3", name: "Robert Petit" },
  { id: "p4", name: "Sophie Leroy" },
  { id: "p5", name: "Pierre Bernard" },
];

const BillingPage = () => {
  const [selectedActs, setSelectedActs] = useState<string[]>([]);
  const [selectedMajorations, setSelectedMajorations] = useState<string[]>([]);
  const [previewInvoices, setPreviewInvoices] = useState<any[]>([]);
  const [nursingActsData, setNursingActsData] = useState<NursingAct[]>([]);
  const [majorationsData, setMajorationsData] = useState<Majoration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<BillingFormValues>({
    defaultValues: {
      patient: "",
      date: format(new Date(), "yyyy-MM-dd"),
      acts: [],
      majorations: [],
      comment: ""
    }
  });

  // Charger les données au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Charger les actes infirmiers
        const { data: actsData, error: actsError } = await supabase
          .from('nursing_acts')
          .select('*')
          .eq('active', true)
          .order('code');
          
        if (actsError) throw actsError;
        setNursingActsData(actsData || []);
        
        // Charger les majorations
        const { data: majData, error: majError } = await supabase
          .from('majorations')
          .select('*')
          .eq('active', true)
          .order('code');
          
        if (majError) throw majError;
        setMajorationsData(majData || []);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAddAct = (actId: string) => {
    if (!selectedActs.includes(actId)) {
      setSelectedActs([...selectedActs, actId]);
      toast.success("Acte ajouté");
    }
  };

  const handleRemoveAct = (actId: string) => {
    setSelectedActs(selectedActs.filter(id => id !== actId));
    toast.success("Acte retiré");
  };

  const handleAddMajoration = (majorationId: string) => {
    if (!selectedMajorations.includes(majorationId)) {
      setSelectedMajorations([...selectedMajorations, majorationId]);
      toast.success("Majoration ajoutée");
    }
  };

  const handleRemoveMajoration = (majorationId: string) => {
    setSelectedMajorations(selectedMajorations.filter(id => id !== majorationId));
    toast.success("Majoration retirée");
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Add acts
    selectedActs.forEach(actId => {
      const act = nursingActsData.find(a => a.id === actId);
      if (act) {
        total += act.rate;
      }
    });
    
    // Add majorations
    selectedMajorations.forEach(majId => {
      const maj = majorationsData.find(m => m.id === majId);
      if (maj) {
        total += maj.rate;
      }
    });
    
    return total.toFixed(2);
  };

  const onSubmit = (data: BillingFormValues) => {
    const patient = patients.find(p => p.id === data.patient)?.name || "Patient inconnu";
    const total = calculateTotal();
    
    // Créer une nouvelle facture simulée
    const newInvoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`, // Générer un ID aléatoire
      patient,
      date: format(new Date(data.date), "dd/MM/yyyy", { locale: fr }),
      acts: selectedActs.map(id => {
        const act = nursingActsData.find(a => a.id === id);
        return act ? act.code : "";
      }).join(", "),
      majorations: selectedMajorations.map(id => {
        const maj = majorationsData.find(m => m.id === id);
        return maj ? maj.code : "";
      }).join(", "),
      total: `${total}€`,
      comment: data.comment
    };
    
    setPreviewInvoices([...previewInvoices, newInvoice]);
    toast.success("Facturation générée avec succès");
    
    // Réinitialiser le formulaire
    form.reset();
    setSelectedActs([]);
    setSelectedMajorations([]);
  };

  const handlePrintInvoice = (invoice: any) => {
    toast.success(`Impression de la facture ${invoice.id}`);
    // Logique d'impression
  };

  const handleDownloadInvoice = (invoice: any) => {
    toast.success(`Téléchargement de la facture ${invoice.id} en PDF`);
    // Logique de téléchargement
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Facturation</h1>
        <p className="text-muted-foreground">Créez et gérez vos facturations pour l'Assurance Maladie</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de facturation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Nouvelle facturation</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Chargement des données...</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    {/* Patient */}
                    <FormField
                      control={form.control}
                      name="patient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <select 
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              >
                                <option value="">Sélectionnez un patient</option>
                                {patients.map((patient) => (
                                  <option key={patient.id} value={patient.id}>
                                    {patient.name}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              onClick={() => toast.info("Gestion des patients")}
                            >
                              <User size={16} />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Date des soins */}
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date des soins</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              onClick={() => toast.info("Voir le calendrier")}
                            >
                              <Calendar size={16} />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Actes */}
                    <div className="space-y-2">
                      <FormLabel>Actes réalisés</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedActs.map(actId => {
                          const act = nursingActsData.find(a => a.id === actId);
                          return act ? (
                            <Badge key={act.id} className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 flex items-center gap-1 py-1.5">
                              {act.code} - {act.description}
                              <button 
                                type="button" 
                                className="ml-1 text-primary hover:text-destructive"
                                onClick={() => handleRemoveAct(act.id)}
                              >
                                <Trash size={14} />
                              </button>
                            </Badge>
                          ) : null;
                        })}
                        {selectedActs.length === 0 && (
                          <p className="text-sm text-muted-foreground">Aucun acte sélectionné</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          onChange={(e) => e.target.value && handleAddAct(e.target.value)}
                          value=""
                        >
                          <option value="">Ajouter un acte...</option>
                          {nursingActsData.filter(act => !selectedActs.includes(act.id)).map(act => (
                            <option key={act.id} value={act.id}>
                              {act.code} - {act.description} ({act.rate}€)
                            </option>
                          ))}
                        </select>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => toast.info("Gérer les actes dans les paramètres")}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Majorations */}
                    <div className="space-y-2">
                      <FormLabel>Majorations</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedMajorations.map(majId => {
                          const maj = majorationsData.find(m => m.id === majId);
                          return maj ? (
                            <Badge key={maj.id} className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 border border-secondary/20 flex items-center gap-1 py-1.5">
                              {maj.code} - {maj.description}
                              <button 
                                type="button" 
                                className="ml-1 text-secondary-foreground hover:text-destructive"
                                onClick={() => handleRemoveMajoration(maj.id)}
                              >
                                <Trash size={14} />
                              </button>
                            </Badge>
                          ) : null;
                        })}
                        {selectedMajorations.length === 0 && (
                          <p className="text-sm text-muted-foreground">Aucune majoration sélectionnée</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          onChange={(e) => e.target.value && handleAddMajoration(e.target.value)}
                          value=""
                        >
                          <option value="">Ajouter une majoration...</option>
                          {majorationsData.filter(maj => !selectedMajorations.includes(maj.id)).map(maj => (
                            <option key={maj.id} value={maj.id}>
                              {maj.code} - {maj.description} ({maj.rate}€)
                            </option>
                          ))}
                        </select>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => toast.info("Gérer les majorations dans les paramètres")}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Commentaire */}
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commentaire (facultatif)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Notes supplémentaires..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-xl font-semibold flex items-center">
                      Total: <span className="text-primary ml-2">{calculateTotal()}€</span>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={selectedActs.length === 0 || !form.getValues().patient}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Générer la facturation
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
        
        {/* Guide de facturation */}
        <Card>
          <CardHeader>
            <CardTitle>Aide à la facturation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Règles de facturation</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Chaque acte doit correspondre à un soin effectivement réalisé</span>
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Vérifiez la compatibilité des actes entre eux</span>
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Les majorations doivent être justifiées par les horaires ou jours de passage</span>
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>Conservez tous les justificatifs (prescription, feuilles de soins...)</span>
                </li>
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Documents utiles</h4>
              <div className="grid gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  size="sm"
                  onClick={() => toast.success("Téléchargement de la feuille de soins")}
                >
                  <Download size={16} className="mr-2" />
                  Feuille de soins vierge
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  size="sm"
                  onClick={() => toast.success("Téléchargement de l'aide-mémoire")}
                >
                  <Download size={16} className="mr-2" />
                  Aide-mémoire cotation NGAP
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  size="sm"
                  onClick={() => toast.success("Téléchargement du guide")}
                >
                  <Download size={16} className="mr-2" />
                  Guide des incompatibilités
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Aperçu des factures générées */}
      {previewInvoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt size={18} />
              Facturations générées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actes</TableHead>
                  <TableHead>Majorations</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewInvoices.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.patient}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.acts}</TableCell>
                    <TableCell>{invoice.majorations || "-"}</TableCell>
                    <TableCell className="font-semibold">{invoice.total}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePrintInvoice(invoice)}
                        >
                          <Printer size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillingPage;
