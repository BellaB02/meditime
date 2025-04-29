
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  Check, 
  PencilLine, 
  Trash, 
  Plus,
  Euro,
  User,
  LogOut,
  Palette,
  Bell,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Types
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

interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [nursingActs, setNursingActs] = useState<NursingAct[]>([]);
  const [majorations, setMajorations] = useState<Majoration[]>([]);
  const [appSettings, setAppSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingAct, setEditingAct] = useState<NursingAct | null>(null);
  const [editingMajoration, setEditingMajoration] = useState<Majoration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingAct, setIsAddingAct] = useState(false);
  const [isAddingMajoration, setIsAddingMajoration] = useState(false);

  // Formulaire pour la modification des actes
  const actForm = useForm({
    defaultValues: {
      code: "",
      description: "",
      rate: 0,
      active: true
    }
  });

  // Formulaire pour la modification des majorations
  const majorationForm = useForm({
    defaultValues: {
      code: "",
      description: "",
      rate: 0,
      active: true
    }
  });

  // Formulaire pour les paramètres généraux
  const generalSettingsForm = useForm({
    defaultValues: {
      app_name: "Infirmier Facile",
      default_currency: "€",
      display_help_tips: true,
      theme_color: "blue",
      dark_mode: "auto"
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
          .order('code');
          
        if (actsError) throw actsError;
        setNursingActs(actsData || []);
        
        // Charger les majorations
        const { data: majData, error: majError } = await supabase
          .from('majorations')
          .select('*')
          .order('code');
          
        if (majError) throw majError;
        setMajorations(majData || []);
        
        // Charger les paramètres de l'application
        const { data: settingsData, error: settingsError } = await supabase
          .from('app_settings')
          .select('*');
          
        if (settingsError) throw settingsError;
        
        const settingsMap: Record<string, string> = {};
        settingsData?.forEach(setting => {
          settingsMap[setting.setting_key] = setting.setting_value;
        });
        
        setAppSettings(settingsMap);
        
        // Mettre à jour le formulaire des paramètres généraux
        generalSettingsForm.reset({
          app_name: settingsMap.app_name || "Infirmier Facile",
          default_currency: settingsMap.default_currency || "€",
          display_help_tips: settingsMap.display_help_tips === "true",
          theme_color: settingsMap.theme_color || "blue",
          dark_mode: settingsMap.dark_mode || "auto"
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Ouvrir le dialogue de modification pour un acte
  const handleEditAct = (act: NursingAct) => {
    setEditingAct(act);
    setIsAddingAct(false);
    actForm.reset({
      code: act.code,
      description: act.description,
      rate: act.rate,
      active: act.active
    });
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue d'ajout pour un acte
  const handleAddAct = () => {
    setEditingAct(null);
    setIsAddingAct(true);
    actForm.reset({
      code: "",
      description: "",
      rate: 0,
      active: true
    });
    setIsDialogOpen(true);
  };

  // Sauvegarder un acte
  const handleSaveAct = async (data: any) => {
    try {
      if (isAddingAct) {
        // Ajouter un nouvel acte
        const { data: newAct, error } = await supabase
          .from('nursing_acts')
          .insert([{
            code: data.code,
            description: data.description,
            rate: data.rate,
            active: data.active
          }])
          .select();
          
        if (error) throw error;
        
        toast.success("Acte ajouté avec succès");
        setNursingActs([...(newAct || []), ...nursingActs]);
      } else if (editingAct) {
        // Mettre à jour un acte existant
        const { error } = await supabase
          .from('nursing_acts')
          .update({
            code: data.code,
            description: data.description,
            rate: data.rate,
            active: data.active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAct.id);
          
        if (error) throw error;
        
        toast.success("Acte mis à jour avec succès");
        
        // Mettre à jour la liste locale
        setNursingActs(nursingActs.map(act => 
          act.id === editingAct.id 
            ? { ...act, code: data.code, description: data.description, rate: data.rate, active: data.active } 
            : act
        ));
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  // Ouvrir le dialogue de modification pour une majoration
  const handleEditMajoration = (majoration: Majoration) => {
    setEditingMajoration(majoration);
    setIsAddingMajoration(false);
    majorationForm.reset({
      code: majoration.code,
      description: majoration.description,
      rate: majoration.rate,
      active: majoration.active
    });
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue d'ajout pour une majoration
  const handleAddMajoration = () => {
    setEditingMajoration(null);
    setIsAddingMajoration(true);
    majorationForm.reset({
      code: "",
      description: "",
      rate: 0,
      active: true
    });
    setIsDialogOpen(true);
  };

  // Sauvegarder une majoration
  const handleSaveMajoration = async (data: any) => {
    try {
      if (isAddingMajoration) {
        // Ajouter une nouvelle majoration
        const { data: newMaj, error } = await supabase
          .from('majorations')
          .insert([{
            code: data.code,
            description: data.description,
            rate: data.rate,
            active: data.active
          }])
          .select();
          
        if (error) throw error;
        
        toast.success("Majoration ajoutée avec succès");
        setMajorations([...(newMaj || []), ...majorations]);
      } else if (editingMajoration) {
        // Mettre à jour une majoration existante
        const { error } = await supabase
          .from('majorations')
          .update({
            code: data.code,
            description: data.description,
            rate: data.rate,
            active: data.active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMajoration.id);
          
        if (error) throw error;
        
        toast.success("Majoration mise à jour avec succès");
        
        // Mettre à jour la liste locale
        setMajorations(majorations.map(maj => 
          maj.id === editingMajoration.id 
            ? { ...maj, code: data.code, description: data.description, rate: data.rate, active: data.active } 
            : maj
        ));
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  // Sauvegarder les paramètres généraux
  const handleSaveGeneralSettings = async (data: any) => {
    try {
      const updates = [
        { setting_key: 'app_name', setting_value: data.app_name },
        { setting_key: 'default_currency', setting_value: data.default_currency },
        { setting_key: 'display_help_tips', setting_value: data.display_help_tips ? 'true' : 'false' },
        { setting_key: 'theme_color', setting_value: data.theme_color },
        { setting_key: 'dark_mode', setting_value: data.dark_mode }
      ];
      
      // Mettre à jour chaque paramètre
      for (const update of updates) {
        const { error } = await supabase
          .from('app_settings')
          .update({ setting_value: update.setting_value })
          .eq('setting_key', update.setting_key);
          
        if (error) throw error;
      }
      
      toast.success("Paramètres mis à jour avec succès");
      
      // Mettre à jour l'état local
      const newSettings = { ...appSettings };
      updates.forEach(update => {
        newSettings[update.setting_key] = update.setting_value;
      });
      setAppSettings(newSettings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      toast.error("Erreur lors de la sauvegarde des paramètres");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon size={24} />
          Paramètres
        </h1>
        <p className="text-muted-foreground">
          Personnalisez les paramètres de votre application
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
          <TabsTrigger value="majorations">Majorations</TabsTrigger>
          <TabsTrigger value="profil">Profil</TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalSettingsForm}>
                <form onSubmit={generalSettingsForm.handleSubmit(handleSaveGeneralSettings)} className="space-y-4">
                  <FormField
                    control={generalSettingsForm.control}
                    name="app_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'application</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Ce nom sera affiché dans l'en-tête de l'application.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="default_currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Devise par défaut</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une devise" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="€">Euro (€)</SelectItem>
                              <SelectItem value="$">Dollar ($)</SelectItem>
                              <SelectItem value="£">Livre Sterling (£)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="display_help_tips"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Conseils d'aide
                          </FormLabel>
                          <FormDescription>
                            Afficher les conseils d'aide dans l'application.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="theme_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Couleur du thème</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une couleur" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">Bleu</SelectItem>
                              <SelectItem value="green">Vert</SelectItem>
                              <SelectItem value="purple">Violet</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="dark_mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode sombre</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Automatique (selon le système)</SelectItem>
                              <SelectItem value="light">Clair</SelectItem>
                              <SelectItem value="dark">Sombre</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save size={16} />
                      Enregistrer les paramètres
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options avancées</CardTitle>
              <CardDescription>
                Paramètres supplémentaires pour personnaliser votre expérience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Vérification automatique des mises à jour</h3>
                  <p className="text-sm text-muted-foreground">
                    Vérifier automatiquement les mises à jour de l'application
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications pour les rappels et les événements
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sauvegarde automatique</h3>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarder automatiquement vos données dans le cloud
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Restaurer les paramètres par défaut
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Tarifs */}
        <TabsContent value="tarifs" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestion des tarifs</CardTitle>
                <CardDescription>
                  Configurez les tarifs des actes infirmiers
                </CardDescription>
              </div>
              <Button onClick={handleAddAct} className="flex items-center gap-2">
                <Plus size={16} />
                Ajouter un acte
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Chargement des tarifs...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Tarif</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nursingActs.map(act => (
                      <TableRow key={act.id}>
                        <TableCell className="font-medium">{act.code}</TableCell>
                        <TableCell>{act.description}</TableCell>
                        <TableCell>{act.rate.toFixed(2)} €</TableCell>
                        <TableCell>
                          {act.active ? (
                            <Badge variant="default" className="bg-green-500">Actif</Badge>
                          ) : (
                            <Badge variant="outline">Inactif</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditAct(act)}
                            >
                              <PencilLine size={16} className="text-primary" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {nursingActs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Aucun acte trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Majorations */}
        <TabsContent value="majorations" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestion des majorations</CardTitle>
                <CardDescription>
                  Configurez les majorations applicables
                </CardDescription>
              </div>
              <Button onClick={handleAddMajoration} className="flex items-center gap-2">
                <Plus size={16} />
                Ajouter une majoration
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Chargement des majorations...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Tarif</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {majorations.map(majoration => (
                      <TableRow key={majoration.id}>
                        <TableCell className="font-medium">{majoration.code}</TableCell>
                        <TableCell>{majoration.description}</TableCell>
                        <TableCell>{majoration.rate.toFixed(2)} €</TableCell>
                        <TableCell>
                          {majoration.active ? (
                            <Badge variant="default" className="bg-green-500">Actif</Badge>
                          ) : (
                            <Badge variant="outline">Inactif</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditMajoration(majoration)}
                            >
                              <PencilLine size={16} className="text-primary" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {majorations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Aucune majoration trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Profil */}
        <TabsContent value="profil" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Votre profil</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
                  IF
                </div>
                <div>
                  <h3 className="text-lg font-medium">Infirmier / Infirmière</h3>
                  <p className="text-muted-foreground">Cabinet Infirmier</p>
                  <Button variant="outline" size="sm" className="mt-2 flex items-center gap-1">
                    <PencilLine size={14} />
                    Modifier la photo
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">Prénom</Label>
                    <Input id="firstname" defaultValue="Jean" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Nom</Label>
                    <Input id="lastname" defaultValue="Dupont" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jean.dupont@exemple.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="06 12 34 56 78" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adeli">Numéro ADELI</Label>
                  <Input id="adeli" defaultValue="123456789" />
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Button className="flex items-center gap-2">
                  <Save size={16} />
                  Enregistrer le profil
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText size={16} />
                  Données professionnelles
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <LogOut size={18} />
                Déconnexion
              </CardTitle>
              <CardDescription>
                Options avancées de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" className="w-full sm:w-auto">
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue pour l'édition ou l'ajout d'actes */}
      {isAddingAct || editingAct ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isAddingAct ? "Ajouter un acte" : "Modifier un acte"}
              </DialogTitle>
              <DialogDescription>
                {isAddingAct 
                  ? "Créez un nouvel acte infirmier" 
                  : "Modifiez les informations de cet acte"
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...actForm}>
              <form onSubmit={actForm.handleSubmit(handleSaveAct)} className="space-y-4">
                <FormField
                  control={actForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={actForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={actForm.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tarif (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={actForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                      <div>
                        <FormLabel>Actif</FormLabel>
                        <FormDescription>
                          Définissez si cet acte est actuellement utilisable.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">
                    <Check size={16} className="mr-2" />
                    {isAddingAct ? "Ajouter" : "Enregistrer"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : null}

      {/* Dialogue pour l'édition ou l'ajout de majorations */}
      {isAddingMajoration || editingMajoration ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isAddingMajoration ? "Ajouter une majoration" : "Modifier une majoration"}
              </DialogTitle>
              <DialogDescription>
                {isAddingMajoration 
                  ? "Créez une nouvelle majoration" 
                  : "Modifiez les informations de cette majoration"
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...majorationForm}>
              <form onSubmit={majorationForm.handleSubmit(handleSaveMajoration)} className="space-y-4">
                <FormField
                  control={majorationForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={majorationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={majorationForm.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tarif (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={majorationForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                      <div>
                        <FormLabel>Actif</FormLabel>
                        <FormDescription>
                          Définissez si cette majoration est actuellement utilisable.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">
                    <Check size={16} className="mr-2" />
                    {isAddingMajoration ? "Ajouter" : "Enregistrer"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};

export default Settings;
