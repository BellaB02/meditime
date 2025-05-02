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
  AlertCircle,
  Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useBillingService } from "@/hooks/useBillingService";
import { PDFGenerationService } from "@/services/PDFGenerationService";

// Types
interface BillingFormValues {
  patient: string;
  date: string;
  acts: string[];
  majorations: string[];
  comment: string;
}

interface InvoiceInfo {
  id: string;
  date: string;
  amount: number;
  details: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  patientId: string;
  patientDetails: any;
  paid: boolean;
  totalAmount: number;
  majorations: any[];
  careCode: string;
}

const BillingPage = () => {
  const { user } = useAuth();
  const [selectedActs, setSelectedActs] = useState<string[]>([]);
  const [selectedMajorations, setSelectedMajorations] = useState<string[]>([]);
  const [nursingActsData, setNursingActsData] = useState<any[]>([]);
  const [majorationsData, setMajorationsData] = useState<any[]>([]);
  const [patientsData, setPatientsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { useBillingRecords, useCreateBillingRecord } = useBillingService();
  
  // Get billing records
  const { data: billingRecords = [], isLoading: isLoadingBilling } = useBillingRecords();
  const { mutate: createBillingRecord } = useCreateBillingRecord();
  
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
        
        // Charger les patients
        const { data: patients, error: patientsError } = await supabase
          .from('patients')
          .select('id, first_name, last_name')
          .eq('status', 'active')
          .order('last_name');
          
        if (patientsError) throw patientsError;
        setPatientsData(patients || []);
        
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

  const onSubmit = async (data: BillingFormValues) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer une facturation");
      return;
    }
    
    const patientData = patientsData.find(p => p.id === data.patient);
    if (!patientData) {
      toast.error("Patient non trouvé");
      return;
    }
    
    const total = parseFloat(calculateTotal());
    
    // Préparer les données des actes
    const actDetails = selectedActs.map(id => {
      const act = nursingActsData.find(a => a.id === id);
      return act ? {
        code: act.code,
        description: act.description,
        rate: act.rate
      } : null;
    }).filter(Boolean);
    
    // Préparer les données des majorations
    const majorationDetails = selectedMajorations.map(id => {
      const maj = majorationsData.find(m => m.id === id);
      return maj ? {
        code: maj.code,
        description: maj.description,
        rate: maj.rate
      } : null;
    }).filter(Boolean);
    
    // Récupérer le premier code d'acte pour le champ care_code
    const careCode = actDetails.length > 0 ? actDetails[0].code : "UNKNOWN";
    
    // Créer le nouvel enregistrement de facturation
    const newRecord = {
      patient_id: data.patient,
      care_code: careCode,
      quantity: 1,
      base_amount: actDetails.reduce((sum, act) => sum + (act?.rate || 0), 0),
      majorations: majorationDetails,
      total_amount: total,
      created_by: user.id,
      payment_status: "pending",
      transmission_status: "pending",
    };
    
    try {
      await createBillingRecord(newRecord);
      
      // Réinitialiser le formulaire
      form.reset();
      setSelectedActs([]);
      setSelectedMajorations([]);
    } catch (error) {
      console.error("Erreur lors de la création de la facturation:", error);
      toast.error("Erreur lors de la création de la facturation");
    }
  };

  const handleDownloadInvoice = async (invoice: any) => {
    try {
      const { useDetailedBillingRecord } = useBillingService();
      const patientName = invoice.patients ? 
        `${invoice.patients?.first_name || ""} ${invoice.patients?.last_name || ""}` : 
        "Patient";
      
      // Préparer les détails pour la facture
      const invoiceInfo: InvoiceInfo = {
        id: invoice.id.substring(0, 8),
        date: format(new Date(invoice.created_at), "dd/MM/yyyy"),
        amount: parseFloat(invoice.total_amount || 0),
        details: [
          {
            description: `${invoice.care_code} - Acte de soins`,
            quantity: invoice.quantity || 1,
            unitPrice: parseFloat(invoice.base_amount || 0),
            total: parseFloat(invoice.base_amount || 0)
          },
          ...(invoice.majorations || []).map((maj: any) => ({
            description: `${maj.code} - ${maj.description}`,
            quantity: 1,
            unitPrice: parseFloat(maj.rate || 0),
            total: parseFloat(maj.rate || 0)
          }))
        ],
        patientId: invoice.patient_id,
        patientDetails: invoice.patients,
        paid: invoice.payment_status === "paid",
        totalAmount: parseFloat(invoice.total_amount || 0),
        majorations: invoice.majorations,
        careCode: invoice.care_code
      };
      
      // Générer et télécharger le PDF
      const pdfDoc = PDFGenerationService.generateInvoicePDF(invoiceInfo);
      if (pdfDoc) {
        PDFGenerationService.saveInvoicePDF(pdfDoc, invoiceInfo.id);
        toast.success(`Téléchargement de la facture ${invoiceInfo.id} pour ${patientName}`);
      } else {
        toast.error("Erreur lors de la génération du PDF");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement de la facture:", error);
      toast.error("Erreur lors du téléchargement de la facture");
    }
  };

  const handlePrintInvoice = (invoice: any) => {
    try {
      const patientName = invoice.patients ? 
        `${invoice.patients?.first_name || ""} ${invoice.patients?.last_name || ""}` : 
        "Patient";
      
      // Préparer les détails pour la facture
      const invoiceInfo: InvoiceInfo = {
        id: invoice.id.substring(0, 8),
        date: format(new Date(invoice.created_at), "dd/MM/yyyy"),
        amount: parseFloat(invoice.total_amount || 0),
        details: [
          {
            description: `${invoice.care_code} - Acte de soins`,
            quantity: invoice.quantity || 1,
            unitPrice: parseFloat(invoice.base_amount || 0),
            total: parseFloat(invoice.base_amount || 0)
          },
          ...(invoice.majorations || []).map((maj: any) => ({
            description: `${maj.code} - ${maj.description}`,
            quantity: 1,
            unitPrice: parseFloat(maj.rate || 0),
            total: parseFloat(maj.rate || 0)
          }))
        ],
        patientId: invoice.patient_id,
        patientDetails: invoice.patients,
        paid: invoice.payment_status === "paid",
        totalAmount: parseFloat(invoice.total_amount || 0),
        majorations: invoice.majorations,
        careCode: invoice.care_code
      };
      
      // Générer le PDF pour impression
      const pdfDoc = PDFGenerationService.generateInvoicePDF(invoiceInfo);
      if (pdfDoc) {
        const pdfUrl = PDFGenerationService.preparePDFForPrint(pdfDoc);
        if (pdfUrl) {
          const printWindow = window.open(pdfUrl, "_blank");
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.print();
            };
            toast.success(`Impression de la facture ${invoiceInfo.id} pour ${patientName}`);
          } else {
            toast.error("Impossible d'ouvrir la fenêtre d'impression");
          }
        } else {
          toast.error("Erreur lors de la préparation du PDF pour impression");
        }
      } else {
        toast.error("Erreur lors de la génération du PDF");
      }
    } catch (error) {
      console.error("Erreur lors de l'impression de la facture:", error);
      toast.error("Erreur lors de l'impression de la facture");
    }
  };

  // Obtenir le statut visuel d'une facture
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "submitted":
        return <Badge variant="default">Soumis</Badge>;
      case "paid":
        return <Badge variant="default" className="bg-green-500">Payé</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Chargement des données...</span>
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
                                {patientsData.map((patient) => (
                                  <option key={patient.id} value={patient.id}>
                                    {`${patient.last_name} ${patient.first_name}`}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              onClick={() => window.location.href = "/patients"}
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
                              onClick={() => window.location.href = "/calendar"}
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
      
      {/* Liste des facturations générées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt size={18} />
            Facturations générées
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingBilling ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement des facturations...</span>
            </div>
          ) : (
            billingRecords.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Soins</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingRecords.map((record) => {
                    const patientName = record.patients ? 
                      `${record.patients.first_name} ${record.patients.last_name}` : 
                      "Patient";
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>{patientName}</TableCell>
                        <TableCell>
                          {format(new Date(record.created_at), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{record.care_code}</TableCell>
                        <TableCell className="font-semibold">
                          {parseFloat(record.total_amount || 0).toFixed(2)}€
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(record.payment_status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadInvoice(record)}
                            >
                              <Download size={16} className="mr-2" />
                              PDF
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePrintInvoice(record)}
                            >
                              <Printer size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="mx-auto h-12 w-12 mb-4 text-muted-foreground/60" />
                <p>Aucune facturation n'a été créée</p>
                <p className="text-sm mt-2">Créez votre première facturation en utilisant le formulaire ci-dessus</p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
