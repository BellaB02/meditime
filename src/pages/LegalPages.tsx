
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function LegalPages() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("mentions-legales");
  const navigate = useNavigate();
  
  // Fonction pour revenir à la page précédente
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGoBack}
          aria-label="Retour à la page précédente"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Informations légales</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`${isMobile ? "w-full grid grid-cols-3" : ""}`}>
          <TabsTrigger value="mentions-legales">Mentions légales</TabsTrigger>
          <TabsTrigger value="confidentialite">Confidentialité</TabsTrigger>
          <TabsTrigger value="cgu">CGU</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mentions-legales" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentions légales</CardTitle>
              <CardDescription>
                Informations légales concernant l'application Meditime Pro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Éditeur du site</h2>
              <p>
                <strong>Meditime Pro</strong><br />
                Siège social : 123 Avenue de la Santé<br />
                75000 Paris, France<br />
                SIRET : 123 456 789 00012<br />
                RCS Paris B 123 456 789<br />
                Tél : +33 (0)1 23 45 67 89<br />
                Email : contact@meditimepro.com
              </p>
              
              <h2 className="text-xl font-semibold">Directeur de la publication</h2>
              <p>M. Jean Dupont, Président</p>
              
              <h2 className="text-xl font-semibold">Hébergement</h2>
              <p>
                <strong>Supabase</strong><br />
                San Francisco, Californie<br />
                États-Unis
              </p>
              
              <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (structure, textes, logos, images, éléments graphiques...) 
                est la propriété exclusive de Meditime Pro ou de ses partenaires. 
                Toute reproduction, représentation, modification, publication, transmission, dénaturation, 
                totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, 
                et sur quelque support que ce soit est interdite sans autorisation écrite préalable de Meditime Pro.
              </p>
              
              <h2 className="text-xl font-semibold">Déclaration CNIL</h2>
              <p>
                Conformément à la loi n° 78-17 du 6 janvier 1978, relative à l'Informatique, 
                aux Fichiers et aux Libertés, vous disposez d'un droit d'accès, de modification, 
                de rectification et de suppression des données qui vous concernent. 
                Vous pouvez exercer ce droit en nous contactant à l'adresse email suivante: privacy@meditimepro.com
              </p>
              
              <p className="text-sm text-muted-foreground mt-8">
                Dernière mise à jour : 02/05/2025
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="confidentialite" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Politique de confidentialité</CardTitle>
              <CardDescription>
                Comment nous protégeons vos données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Protection des données personnelles</h2>
              <p>
                Meditime Pro s'engage à protéger la confidentialité et la sécurité de vos données personnelles.
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations
                lorsque vous utilisez notre application.
              </p>
              
              <h2 className="text-xl font-semibold">Données collectées</h2>
              <p>
                Nous collectons les informations suivantes :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Informations d'identification (nom, prénom, email, téléphone)</li>
                <li>Informations professionnelles (spécialité médicale, numéro RPPS)</li>
                <li>Données relatives aux patients (lorsque vous les saisissez)</li>
                <li>Données de connexion et d'utilisation de l'application</li>
              </ul>
              
              <h2 className="text-xl font-semibold">Utilisation des données</h2>
              <p>
                Ces données sont utilisées pour :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fournir et améliorer les services de Meditime Pro</li>
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Vous contacter concernant votre compte ou votre abonnement</li>
                <li>Répondre à vos demandes d'assistance</li>
              </ul>
              
              <h2 className="text-xl font-semibold">Conservation des données</h2>
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services
                ou pour se conformer à nos obligations légales. Les données des patients sont conservées
                conformément aux obligations légales en matière de dossier médical.
              </p>
              
              <h2 className="text-xl font-semibold">Vos droits</h2>
              <p>
                Conformément au RGPD, vous disposez des droits suivants concernant vos données :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Droit d'accès et de rectification</li>
                <li>Droit à l'effacement (droit à l'oubli)</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez notre DPO : dpo@meditimepro.com
              </p>
              
              <p className="text-sm text-muted-foreground mt-8">
                Dernière mise à jour : 02/05/2025
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cgu" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conditions Générales d'Utilisation</CardTitle>
              <CardDescription>
                Règles d'utilisation de l'application Meditime Pro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">Objet</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) définissent les conditions d'accès
                et d'utilisation de l'application Meditime Pro. Tout utilisateur de l'application s'engage
                à respecter ces CGU.
              </p>
              
              <h2 className="text-xl font-semibold">Description du service</h2>
              <p>
                Meditime Pro est une application de gestion destinée aux professionnels de santé permettant
                de gérer les patients, les rendez-vous, les tournées, la facturation et les dossiers médicaux.
              </p>
              
              <h2 className="text-xl font-semibold">Accès au service</h2>
              <p>
                L'accès à Meditime Pro nécessite une inscription préalable et l'acceptation des présentes CGU.
                L'utilisateur est responsable de maintenir la confidentialité de ses identifiants de connexion.
              </p>
              
              <h2 className="text-xl font-semibold">Obligations de l'utilisateur</h2>
              <p>
                En utilisant Meditime Pro, l'utilisateur s'engage à :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fournir des informations exactes et complètes</li>
                <li>Respecter les droits des patients</li>
                <li>Se conformer aux obligations légales de sa profession</li>
                <li>Ne pas utiliser l'application à des fins illicites</li>
                <li>Ne pas tenter de compromettre la sécurité de l'application</li>
              </ul>
              
              <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
              <p>
                Tous les éléments de l'application Meditime Pro (marques, logos, textes, etc.) sont protégés par
                le droit d'auteur et sont la propriété exclusive de Meditime Pro.
              </p>
              
              <h2 className="text-xl font-semibold">Responsabilité</h2>
              <p>
                Meditime Pro ne saurait être tenu responsable des dommages directs ou indirects résultant
                de l'utilisation de l'application. L'utilisateur est seul responsable des données qu'il saisit
                et des actions qu'il effectue via l'application.
              </p>
              
              <h2 className="text-xl font-semibold">Modification des CGU</h2>
              <p>
                Meditime Pro se réserve le droit de modifier à tout moment les présentes CGU.
                Les utilisateurs seront informés des modifications par email ou via l'application.
              </p>
              
              <p className="text-sm text-muted-foreground mt-8">
                Dernière mise à jour : 02/05/2025
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
