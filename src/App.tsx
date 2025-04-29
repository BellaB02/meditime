
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation,
  Outlet
} from "react-router-dom";
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
import PatientPortal from "./pages/PatientPortal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Create a new Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
    }
  }
});

// Protected Route component
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

// Admin only route
const AdminRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  // Add admin check here once admin roles are implemented
  // For now, just check if user is logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <NotificationProvider>
              <SidebarProvider>
                <PracticeProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route element={<Layout />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/patients/:patientId" element={<PatientFile />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/care-sheets" element={<CareSheets />} />
                        <Route path="/rounds" element={<Rounds />} />
                        <Route path="/billing" element={<BillingPage />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/practice" element={<Practice />} />
                      </Route>
                    </Route>
                    
                    {/* Admin routes */}
                    <Route element={<AdminRoute />}>
                      <Route element={<Layout />}>
                        <Route path="/admin" element={<AdminTasks />} />
                      </Route>
                    </Route>
                    
                    {/* Patient portal route - will need its own authentication in the future */}
                    <Route path="/patient-portal" element={<PatientPortal />} />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PracticeProvider>
              </SidebarProvider>
            </NotificationProvider>
            <Toaster />
            <Sonner position="top-right" />
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
