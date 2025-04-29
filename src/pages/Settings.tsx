import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, CreditCard, CheckCircle2, UploadCloud } from "lucide-react";
import { PatientService } from "@/services/PatientService";
import PricingTab from "@/components/Settings/PricingTab";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  phone: z.string().optional(),
  profession: z.string().optional(),
  address: z.string().optional(),
});

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [activeSettingsTab, setActiveSettingsTab] = useState("profile");
  
  // État pour les réglages généraux
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [defaultView, setDefaultView] = useState("calendar");
  
  // État pour la photo de profil
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg");
  const [uploading, setUploading] = useState(false);
  
  // Configuration du formulaire de profil
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Dr. Sophie Martin",
      email: "sophie.martin@meditime.fr",
      phone: "06 12 34 56 78",
      profession: "Infirmière libérale",
      address: "15 Rue de la Santé, 75014 Paris"
    },
  });
  
  // État pour l'abonnement
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro">("free");
  
  // Sauvegarde des réglages généraux
  const handleSaveSettings = () => {
    toast.success("Réglages sauvegardés avec succès");
  };
  
  // Soumission du formulaire de profil
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    toast.success("Profil mis à jour avec succès");
    console.log(data);
  };
  
  // Simuler le changement d'abonnement
  const handleUpgradeToPro = () => {
    toast.success("Abonnement Pro activé avec succès");
    setCurrentPlan("pro");
  };
  
  // Simuler le téléchargement d'avatar
  const handleAvatarUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setAvatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie");
      toast.success("Photo de profil mise à jour");
    }, 1500);
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Réglages de Meditime</h1>
      
      <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="pricing">Tarification</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="app-info">À propos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Profil utilisateur</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} alt="Photo de profil" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAvatarUpload}
                    disabled={uploading}
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {uploading ? "Téléversement..." : "Changer la photo"}
                  </Button>
                </div>
              </div>
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="votre.email@exemple.fr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="06 xx xx xx xx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profession</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre profession" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Adresse professionnelle</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre adresse" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">Enregistrer les modifications</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Votre abonnement</CardTitle>
              <CardDescription>
                Gérez votre plan d'abonnement et vos paiements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`border rounded-lg p-4 transition-all ${currentPlan === 'free' ? 'bg-accent/20 border-primary' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Plan Gratuit</h3>
                      <p className="text-muted-foreground">Fonctionnalités de base</p>
                    </div>
                    {currentPlan === 'free' && (
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                        Actif
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Gestion de 10 patients maximum</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Calendrier de rendez-vous</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Fiche patient basique</span>
                    </li>
                  </ul>
                  
                  <p className="text-lg font-bold mb-4">0€ / mois</p>
                  
                  {currentPlan !== 'free' ? (
                    <Button variant="outline" className="w-full" onClick={() => setCurrentPlan("free")}>
                      Rétrograder
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Plan actuel
                    </Button>
                  )}
                </div>
                
                <div className={`border rounded-lg p-4 transition-all ${currentPlan === 'pro' ? 'bg-accent/20 border-primary' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Plan Pro</h3>
                      <p className="text-muted-foreground">Accès illimité à toutes les fonctionnalités</p>
                    </div>
                    {currentPlan === 'pro' && (
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                        Actif
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Patients illimités</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Gestion des ordonnances avancée</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Suivi des constantes</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Facturation automatique</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Support prioritaire</span>
                    </li>
                  </ul>
                  
                  <p className="text-lg font-bold mb-4">29.99€ / mois</p>
                  
                  {currentPlan !== 'pro' ? (
                    <Button className="w-full" onClick={handleUpgradeToPro}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Passer au plan Pro
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Plan actuel
                    </Button>
                  )}
                </div>
              </div>
              
              {currentPlan === 'pro' && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Détails du paiement</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Prochain paiement:</span>
                    <span>29 Mai 2025</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mode de paiement:</span>
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Visa •••• 4242
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing">
          <PricingTab />
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Interface et préférences</CardTitle>
              <CardDescription>
                Personnalisez votre expérience utilisateur de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="appearance">Apparence</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Langue</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Sélectionner une langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-view">Vue par défaut</Label>
                      <Select value={defaultView} onValueChange={setDefaultView}>
                        <SelectTrigger id="default-view">
                          <SelectValue placeholder="Sélectionner une vue par défaut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Tableau de bord</SelectItem>
                          <SelectItem value="calendar">Calendrier</SelectItem>
                          <SelectItem value="patients">Liste des patients</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Mode sombre</Label>
                        <p className="text-sm text-muted-foreground">
                          Activer l'interface en mode sombre
                        </p>
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Activer les notifications de l'application
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>
                    
                    {notificationsEnabled && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Rappels de rendez-vous</Label>
                            <p className="text-sm text-muted-foreground">
                              Notifications 15 minutes avant un rendez-vous
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Mises à jour patients</Label>
                            <p className="text-sm text-muted-foreground">
                              Notifications pour les changements dans les dossiers patients
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email récapitulatif</Label>
                            <p className="text-sm text-muted-foreground">
                              Résumé quotidien des activités par email
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Thème de couleur</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="h-8 w-full border-2 border-primary">
                          <span className="sr-only">Bleu</span>
                          <span className="h-4 w-4 rounded-full bg-blue-600" />
                        </Button>
                        <Button variant="outline" className="h-8 w-full">
                          <span className="sr-only">Vert</span>
                          <span className="h-4 w-4 rounded-full bg-green-600" />
                        </Button>
                        <Button variant="outline" className="h-8 w-full">
                          <span className="sr-only">Violet</span>
                          <span className="h-4 w-4 rounded-full bg-purple-600" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Taille du texte</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une taille" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Petit</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="large">Grand</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Animations réduites</Label>
                        <p className="text-sm text-muted-foreground">
                          Réduire les animations de l'interface
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveSettings}>
                  Enregistrer les modifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="app-info">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Informations sur l'application</CardTitle>
              <CardDescription>
                Détails techniques de l'installation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Nom de l'application</p>
                <p className="text-sm text-muted-foreground">Meditime</p>
              </div>
              <div>
                <p className="text-sm font-medium">Version</p>
                <p className="text-sm text-muted-foreground">1.2.0</p>
              </div>
              <div>
                <p className="text-sm font-medium">Dernière mise à jour</p>
                <p className="text-sm text-muted-foreground">29 avril 2025</p>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Vérifier les mises à jour
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
