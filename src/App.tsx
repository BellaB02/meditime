
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { AnimatePresence, motion } from "framer-motion";
import "./styles/pageTransitions.css";
import { AuthProvider } from "./contexts/AuthContext";

// Animations pour les pages
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Composant de protection des routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const hasAuthentication = localStorage.getItem("sb-ttvuqgcgknkicggsnlke-auth-token") !== null;
  
  if (!hasAuthentication) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <PracticeProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <SidebarProvider>
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    
                    <Route path="/patient-dashboard" element={
                      <ProtectedRoute>
                        <PatientDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
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
              </BrowserRouter>
            </AuthProvider>
          </PracticeProvider>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
