
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type PlanType = "basic" | "standard" | "premium";

interface PlanDetails {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  current: boolean;
}

export function SubscriptionSection() {
  const isMobile = useIsMobile();
  
  const [currentPlan, setCurrentPlan] = useState<PlanType>("standard");
  
  const plans: Record<PlanType, PlanDetails> = {
    basic: {
      name: "Basique",
      price: "9,99€/mois",
      features: [
        "Jusqu'à 50 patients",
        "Planning de rendez-vous",
        "Gestion des tournées",
        "Fonctionnalités de base",
      ],
      buttonText: "Passer au plan Basique",
      current: currentPlan === "basic",
    },
    standard: {
      name: "Standard",
      price: "19,99€/mois",
      features: [
        "Jusqu'à 150 patients",
        "Toutes les fonctionnalités basiques",
        "Feuilles de soins électroniques",
        "Télétransmission",
        "Facturation automatique",
      ],
      buttonText: "Passer au plan Standard",
      current: currentPlan === "standard",
    },
    premium: {
      name: "Premium",
      price: "29,99€/mois",
      features: [
        "Patients illimités",
        "Toutes les fonctionnalités standard",
        "Statistiques avancées",
        "Cabinet multi-praticiens",
        "Support prioritaire 24/7",
        "Mises à jour en avant-première",
      ],
      buttonText: "Passer au plan Premium",
      current: currentPlan === "premium",
    },
  };

  const handlePlanChange = (plan: PlanType) => {
    // Logique pour changer d'abonnement (à implémenter avec Supabase)
    setCurrentPlan(plan);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Abonnement</CardTitle>
        <CardDescription>Gérez votre abonnement et vos options de facturation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Plan actuel: {plans[currentPlan].name}</h3>
                  <Badge variant="default">Actif</Badge>
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Prochain prélèvement le 15/05/2023 - {plans[currentPlan].price}
                </p>
              </div>
              <div>
                <Button variant="outline" size="sm">Gérer le paiement</Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Comparer les plans</h3>
            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-3 gap-6"}`}>
              {Object.entries(plans).map(([key, plan]) => (
                <div 
                  key={key} 
                  className={`p-4 rounded-lg border ${
                    plan.current ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <h4 className="font-medium">{plan.name}</h4>
                  <div className="text-xl font-bold my-2">{plan.price}</div>
                  <ul className="space-y-2 my-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckIcon size={16} className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.current ? "secondary" : "default"} 
                    disabled={plan.current}
                    className="w-full mt-2"
                    onClick={() => handlePlanChange(key as PlanType)}
                  >
                    {plan.current ? "Plan actuel" : plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Besoin d'annuler votre abonnement ?</p>
              <p>Contactez notre service client au 01 23 45 67 89 ou par email à support@meditime.fr</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
