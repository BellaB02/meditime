
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type PlanType = "free" | "pro";

interface PlanDetails {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  current: boolean;
}

interface UserSubscription {
  plan: PlanType;
  nextBillingDate?: string; // format: YYYY-MM-DD
  active: boolean;
}

export function SubscriptionSection() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<PlanType>("free");
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    setIsLoading(true);
    
    try {
      // Here would be the call to fetch subscription data from your backend
      // For now we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Default to free plan until we have a real subscription system
      const mockSubscription: UserSubscription = {
        plan: "free",
        active: true
      };
      
      setSubscription(mockSubscription);
      setCurrentPlan(mockSubscription.plan);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      toast.error("Impossible de récupérer les informations d'abonnement");
    } finally {
      setIsLoading(false);
    }
  };
  
  const plans: Record<PlanType, PlanDetails> = {
    free: {
      name: "Gratuit",
      price: "0€/mois",
      features: [
        "Jusqu'à 30 patients",
        "Planning de rendez-vous",
        "Gestion des tournées",
        "Fonctionnalités de base",
      ],
      buttonText: "Plan actuel",
      current: currentPlan === "free",
    },
    pro: {
      name: "Pro",
      price: "11,99€/mois",
      features: [
        "Patients illimités",
        "Toutes les fonctionnalités gratuites",
        "Feuilles de soins électroniques",
        "Télétransmission",
        "Facturation automatique",
        "Statistiques avancées",
        "Cabinet multi-praticiens",
        "Support prioritaire",
      ],
      buttonText: "Passer au plan Pro",
      current: currentPlan === "pro",
    },
  };

  const handlePlanChange = async (plan: PlanType) => {
    setIsLoading(true);
    
    try {
      if (!user) {
        toast.error("Vous devez être connecté pour changer d'abonnement");
        return;
      }
      
      if (plan === currentPlan) {
        toast.info(`Vous êtes déjà sur le plan ${plans[plan].name}`);
        return;
      }
      
      // Simulate subscription change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (plan === "pro") {
        // Here you would redirect to a checkout page or process
        toast.info("Redirection vers la page de paiement...");
        
        // For now just show a simulated success message
        setTimeout(() => {
          setCurrentPlan("pro");
          toast.success("Abonnement mis à niveau avec succès !");
        }, 2000);
      } else {
        // Downgrading to free plan
        setCurrentPlan("free");
        toast.success("Abonnement modifié avec succès");
      }
    } catch (error) {
      console.error("Failed to change plan:", error);
      toast.error("Impossible de changer d'abonnement");
    } finally {
      setIsLoading(false);
    }
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
                {currentPlan === "free" ? (
                  <p className="text-muted-foreground text-sm mt-1">
                    Plan gratuit - Aucun paiement requis
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm mt-1">
                    Prochain prélèvement le {subscription?.nextBillingDate || '15/05/2025'} - {plans[currentPlan].price}
                  </p>
                )}
              </div>
              {currentPlan === "pro" && (
                <div>
                  <Button variant="outline" size="sm">Gérer le paiement</Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Comparer les plans</h3>
            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-6"}`}>
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
                    disabled={plan.current || isLoading}
                    className="w-full mt-2"
                    onClick={() => handlePlanChange(key as PlanType)}
                  >
                    {isLoading ? "Chargement..." : plan.current ? "Plan actuel" : plan.buttonText}
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
