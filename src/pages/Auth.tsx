
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { TemporaryAccessService } from "@/services/TemporaryAccessService";

// Schéma de validation pour le formulaire de connexion
const loginFormSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  userType: z.enum(["patient", "soignant"]),
});

// Schéma de validation pour le formulaire d'inscription
const registerFormSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "Le prénom est obligatoire"),
  lastName: z.string().min(1, "Le nom est obligatoire"),
  userType: z.enum(["patient", "soignant"]),
  socialSecurityNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user } = useAuth();
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<any>(null);

  // Formulaire de connexion
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "soignant",
    },
  });

  // Formulaire d'inscription
  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      userType: "soignant",
      socialSecurityNumber: "",
    },
  });
  
  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Vérifier si un token d'invitation est présent dans l'URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (token) {
      const invitationData = TemporaryAccessService.validateToken(token);
      
      if (invitationData) {
        setInvitationToken(token);
        setInvitationData(invitationData);
        setActiveTab("register");
        
        // Pré-remplir le formulaire d'inscription avec les données de l'invitation
        registerForm.setValue("email", invitationData.email);
        registerForm.setValue("userType", "soignant");
        registerForm.setValue("firstName", invitationData.name.split(' ')[0] || '');
        registerForm.setValue("lastName", invitationData.name.split(' ')[1] || '');
        
        toast.info("Vous avez été invité à rejoindre un cabinet. Complétez votre inscription.");
      } else {
        toast.error("Le lien d'invitation est invalide ou a expiré.");
      }
    }
  }, [location.search, registerForm]);

  // Gestion de la connexion
  const handleLogin = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      await signIn(data.email, data.password);
      
      // La redirection se fera automatiquement grâce à notre effet ci-dessus
    } catch (error) {
      // L'erreur est déjà gérée dans le contexte d'authentification
    }
  };

  // Gestion de l'inscription
  const handleRegister = async (data: z.infer<typeof registerFormSchema>) => {
    try {
      await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName
      });
      
      // Redirection ou connexion automatique
      setActiveTab("login");
      loginForm.setValue("email", data.email);
      loginForm.setValue("userType", data.userType);
      
      // Simuler une attente pour montrer un toast de confirmation
      setTimeout(() => {
        toast.info("Veuillez vous connecter avec vos identifiants");
      }, 1000);
    } catch (error) {
      // L'erreur est déjà gérée dans le contexte d'authentification
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-background p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <motion.h1 
            className="text-3xl font-bold text-primary"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            Meditime
          </motion.h1>
          <p className="text-muted-foreground mt-2">
            {invitationToken 
              ? `Finaliser votre inscription sur invitation de ${invitationData?.name || 'votre cabinet'}` 
              : "Connexion à votre espace de gestion de soins"}
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            {!invitationToken && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            {invitationToken && (
              <CardTitle className="text-center">Finaliser votre inscription</CardTitle>
            )}
          </CardHeader>
          <CardContent>
            {!invitationToken ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="login" className="mt-0">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                type="button"
                                variant={field.value === "soignant" ? "default" : "outline"}
                                className="w-full"
                                onClick={() => field.onChange("soignant")}
                              >
                                Soignant
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === "patient" ? "default" : "outline"}
                                className="w-full"
                                onClick={() => field.onChange("patient")}
                              >
                                Patient
                              </Button>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="exemple@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        Se connecter
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                type="button"
                                variant={field.value === "soignant" ? "default" : "outline"}
                                className="w-full"
                                onClick={() => field.onChange("soignant")}
                              >
                                Soignant
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === "patient" ? "default" : "outline"}
                                className="w-full"
                                onClick={() => field.onChange("patient")}
                              >
                                Patient
                              </Button>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="exemple@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {registerForm.watch("userType") === "patient" && (
                        <FormField
                          control={registerForm.control}
                          name="socialSecurityNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de sécurité sociale</FormLabel>
                              <FormControl>
                                <Input placeholder="X XX XX XX XXX XXX XX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        Créer un compte
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            ) : (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" disabled={!!invitationToken} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {invitationToken ? "Finaliser l'inscription" : "Créer un compte"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Auth;
