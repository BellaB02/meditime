
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import { AuthContext } from "../App";

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
  const { login } = useContext(AuthContext);

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

  // Gestion de la connexion
  const handleLogin = (data: z.infer<typeof loginFormSchema>) => {
    console.log("Connexion avec:", data);
    
    // Simulation d'une connexion réussie
    login(data.userType);
    toast.success(`Connexion réussie en tant que ${data.userType}`);
    
    // Redirection vers la page appropriée
    if (data.userType === "soignant") {
      navigate("/");
    } else {
      navigate("/patient-dashboard");
    }
  };

  // Gestion de l'inscription
  const handleRegister = (data: z.infer<typeof registerFormSchema>) => {
    console.log("Inscription avec:", data);
    
    // Simulation d'une inscription réussie
    toast.success(`Compte créé pour ${data.firstName} ${data.lastName}`);
    
    // Redirection ou connexion automatique
    setActiveTab("login");
    loginForm.setValue("email", data.email);
    loginForm.setValue("userType", data.userType);
    
    // Simuler une attente pour montrer un toast de confirmation
    setTimeout(() => {
      toast.info("Veuillez vous connecter avec vos identifiants");
    }, 1000);
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
            Connexion à votre espace de gestion de soins
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Auth;
