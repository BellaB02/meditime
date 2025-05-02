
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmailService } from "@/services/EmailService";

// Schéma de validation avec Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "L'adresse email n'est pas valide." }),
  phone: z.string().optional(),
  subject: z.string().min(3, { message: "Le sujet doit contenir au moins 3 caractères." }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
  // Honeypot pour lutter contre le spam
  website: z.string().max(0).optional()
});

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialisation du formulaire avec React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      website: ""
    }
  });
  
  // Fonction de soumission du formulaire
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Si le champ honeypot est rempli, c'est probablement un bot
    if (values.website) {
      // Simuler un succès mais ne rien faire
      toast.success("Message envoyé");
      form.reset();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Dans une application réelle, ceci appellerait une API ou un service
      await EmailService.sendNotificationEmail(
        "contact@meditimepro.com",
        `Nouveau message de ${values.name}`,
        `
          Nom: ${values.name}
          Email: ${values.email}
          Téléphone: ${values.phone || "Non renseigné"}
          Sujet: ${values.subject}
          
          Message:
          ${values.message}
        `
      );
      
      // Envoyer un email de confirmation à l'utilisateur
      await EmailService.sendNotificationEmail(
        values.email,
        "Confirmation de votre message - Meditime Pro",
        `
          Bonjour ${values.name},
          
          Nous avons bien reçu votre message et vous remercions de nous avoir contactés.
          Notre équipe va étudier votre demande et vous répondra dans les plus brefs délais.
          
          Pour rappel, voici votre message :
          
          Sujet: ${values.subject}
          Message: ${values.message}
          
          Cordialement,
          L'équipe Meditime Pro
        `
      );
      
      toast.success("Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.");
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Contactez-nous</h1>
      <p className="text-muted-foreground">
        Vous avez des questions ou des suggestions ? N'hésitez pas à nous contacter.
        Notre équipe vous répondra dans les plus brefs délais.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Formulaire de contact</CardTitle>
            <CardDescription>Envoyez-nous un message via ce formulaire</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jean.dupont@exemple.fr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Téléphone <span className="text-muted-foreground">(optionnel)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="01 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sujet</FormLabel>
                      <FormControl>
                        <Input placeholder="Demande d'information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Votre message..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Champ honeypot caché pour éviter le spam */}
                <div className="hidden" aria-hidden="true">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} tabIndex={-1} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Nos coordonnées</CardTitle>
            <CardDescription>Comment nous contacter directement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Adresse</h3>
              <p className="text-muted-foreground">
                123 Avenue de la Santé<br />
                75000 Paris, France
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">contact@meditimepro.com</p>
            </div>
            
            <div>
              <h3 className="font-medium">Téléphone</h3>
              <p className="text-muted-foreground">+33 (0)1 23 45 67 89</p>
            </div>
            
            <div>
              <h3 className="font-medium">Horaires d'assistance</h3>
              <p className="text-muted-foreground">
                Lundi au vendredi : 9h00 - 18h00<br />
                Samedi : 9h00 - 12h00
              </p>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium">Une question fréquente ?</h3>
              <p className="text-muted-foreground mb-2">
                Consultez notre base de connaissances, votre réponse s'y trouve peut-être.
              </p>
              <Button variant="outline" className="w-full">
                Accéder à l'aide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
