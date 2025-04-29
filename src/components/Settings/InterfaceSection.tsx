
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sun, Moon, Monitor } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function InterfaceSection() {
  const isMobile = useIsMobile();
  
  // Paramètres d'interface
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState("medium");
  
  const handleThemeChange = (value: string) => {
    // Logique pour changer le thème (à implémenter)
    setTheme(value);
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    
    if (value === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemPreference);
    } else {
      root.classList.add(value);
    }
    
    localStorage.setItem("theme", value);
  };
  
  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    
    // Appliquer la taille de police globalement
    const root = window.document.documentElement;
    root.style.fontSize = {
      "small": "0.9rem",
      "medium": "1rem",
      "large": "1.1rem",
    }[value] || "1rem";
    
    localStorage.setItem("fontSize", value);
  };
  
  // Charger les préférences au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    
    setTheme(savedTheme);
    setFontSize(savedFontSize);
  }, []);
  
  const saveSettings = () => {
    localStorage.setItem("notificationsEnabled", String(notificationsEnabled));
    localStorage.setItem("soundsEnabled", String(soundsEnabled));
    toast.success("Préférences d'interface sauvegardées");
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Préférences d'interface</CardTitle>
        <CardDescription>Personnalisez l'apparence et le comportement de l'application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium">Apparence</h3>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme-select">Thème</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme-select" className="w-full">
                    <SelectValue placeholder="Choisir un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun size={16} />
                        <span>Clair</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon size={16} />
                        <span>Sombre</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor size={16} />
                        <span>Système</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Le thème sombre est plus reposant pour les yeux pendant la nuit.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size-select">Taille de police</Label>
                <Select value={fontSize} onValueChange={handleFontSizeChange}>
                  <SelectTrigger id="font-size-select" className="w-full">
                    <SelectValue placeholder="Choisir une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-medium">Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Activer les notifications</Label>
                  <p className="text-xs text-muted-foreground">Recevoir des alertes pour les rendez-vous et mises à jour</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sounds">Sons de notification</Label>
                  <p className="text-xs text-muted-foreground">Activer les sons pour les notifications</p>
                </div>
                <Switch
                  id="sounds"
                  checked={soundsEnabled}
                  onCheckedChange={setSoundsEnabled}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={saveSettings}>Sauvegarder les préférences</Button>
      </CardFooter>
    </Card>
  );
}
