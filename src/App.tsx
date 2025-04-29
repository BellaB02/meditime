
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Patients from "./pages/Patients";
import Calendar from "./pages/Calendar";
import PatientFile from "./pages/PatientFile";
import AdminTasks from "./pages/AdminTasks";
import BillingPage from "./pages/BillingPage";
import Settings from "./pages/Settings";
import { SidebarProvider } from "./components/Layout/SidebarProvider";
import { NotificationProvider } from "./contexts/NotificationContext";
import { PracticeProvider } from "./contexts/PracticeContext";
import Layout from "./components/Layout/Layout";
import CareSheets from "./pages/CareSheets";
import Rounds from "./pages/Rounds";
import Practice from "./pages/Practice";
import Auth from "./pages/Auth";
import PatientDashboard from "./pages/PatientDashboard";

// Transitions entre les pages
import { AnimatePresence } from "framer-motion";
import "./styles/pageTransitions.css";

// Contexte d'authentification simulé
interface AuthContextType {
  isAuthenticated: boolean;
  userType: string | null;
  login: (userType: string) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  userType: null,
  login: () => {},
  logout: () => {}
});

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  
  // Vérifier l'authentification au chargement
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUserType = localStorage.getItem("userType");
    
    if (storedAuth === "true" && storedUserType) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
    }
  }, []);
  
  const login = (userType: string) => {
    setIsAuthenticated(true);
    setUserType(userType);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userType", userType);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
  };
  
  const authContextValue = {
    isAuthenticated,
    userType,
    login,
    logout
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <PracticeProvider>
            <AuthContext.Provider value={authContextValue}>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AnimatePresence mode="wait">
                  <SidebarProvider>
                    <Routes>
                      <Route path="/auth" element={
                        isAuthenticated ? (
                          userType === "patient" ? <Navigate to="/patient-dashboard" /> : <Navigate to="/" />
                        ) : <Auth />
                      } />
                      
                      <Route path="/patient-dashboard" element={
                        isAuthenticated && userType === "patient" ? 
                        <PatientDashboard /> : <Navigate to="/auth" />
                      } />
                      
                      <Route path="/" element={
                        isAuthenticated && userType === "soignant" ? 
                        <Layout /> : <Navigate to="/auth" />
                      }>
                        <Route index element={<Index />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/patients/:id" element={<PatientFile />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/admin" element={<AdminTasks />} />
                        <Route path="/admin/billing" element={<BillingPage />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/caresheets" element={<CareSheets />} />
                        <Route path="/rounds" element={<Rounds />} />
                        <Route path="/practice" element={<Practice />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </SidebarProvider>
                </AnimatePresence>
              </BrowserRouter>
            </AuthContext.Provider>
          </PracticeProvider>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
