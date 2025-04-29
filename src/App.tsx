
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
import { SidebarProvider } from "./components/Layout/SidebarProvider";
import Layout from "./components/Layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
