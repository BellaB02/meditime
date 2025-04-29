
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, FileText, Calendar, UserPlus, Settings, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  buttonText: string;
}

export function WelcomeGuide() {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return localStorage.getItem("welcome_guide_dismissed") === "true";
  });
  const navigate = useNavigate();

  // If the user dismissed the guide, don't show it
  if (dismissed) {
    return null;
  }

  const steps: Step[] = [
    {
      title: "Ajoutez votre premier patient",
      description: "Commencez par ajouter un patient pour enregistrer des soins et programmer des rendez-vous.",
      icon: <UserPlus className="h-10 w-10 text-primary" />,
      link: "/patients",
      buttonText: "Ajouter un patient",
    },
    {
      title: "Programmez vos rendez-vous",
      description: "Organisez votre emploi du temps en planifiant vos visites et soins à domicile.",
      icon: <Calendar className="h-10 w-10 text-primary" />,
      link: "/calendar",
      buttonText: "Voir le calendrier",
    },
    {
      title: "Gérez vos feuilles de soins",
      description: "Créez et suivez vos feuilles de soins pour simplifier votre facturation.",
      icon: <FileText className="h-10 w-10 text-primary" />,
      link: "/care-sheets",
      buttonText: "Feuilles de soins",
    },
    {
      title: "Configurez votre compte",
      description: "Personnalisez votre profil et vos paramètres d'abonnement.",
      icon: <Settings className="h-10 w-10 text-primary" />,
      link: "/settings",
      buttonText: "Paramètres",
    }
  ];

  const handleDismiss = () => {
    localStorage.setItem("welcome_guide_dismissed", "true");
    setDismissed(true);
  };

  return (
    <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Info className="h-5 w-5" /> Bienvenue sur Meditime
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Ne plus afficher
          </Button>
        </div>
        <CardDescription>
          Voici quelques étapes pour vous aider à démarrer avec votre nouvelle application de gestion de soins
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={index} className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  {step.icon}
                </div>
                <CardTitle className="text-center text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                {step.description}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(step.link)}
                >
                  {step.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">Astuce</span>: Explorez le menu latéral pour accéder à toutes les fonctionnalités
        </div>
      </CardFooter>
    </Card>
  );
}
