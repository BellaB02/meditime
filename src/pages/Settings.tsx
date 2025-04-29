
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [defaultView, setDefaultView] = useState("calendar");
  
  // Sauvegarde des réglages
  const handleSaveSettings = () => {
    toast.success("Réglages sauvegardés avec succès");
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Réglages de Meditime</h1>
      
      <Card className="mb-8">
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
    </div>
  );
};

export default Settings;
