
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
        <PracticeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
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
        </PracticeProvider>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
