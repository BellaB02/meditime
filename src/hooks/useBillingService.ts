
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { billingService } from '@/integrations/supabase/services/billingService';
import { toast } from 'sonner';

export function useBillingService() {
  const queryClient = useQueryClient();
  
  // Billing Records Queries
  const useBillingRecords = (filters?: {
    startDate?: string;
    endDate?: string;
    patientId?: string;
    status?: string;
  }) => {
    return useQuery({
      queryKey: ['billing-records', filters],
      queryFn: () => billingService.getBillingRecords(filters),
    });
  };
  
  const useBillingRecord = (recordId: string) => {
    return useQuery({
      queryKey: ['billing-record', recordId],
      queryFn: () => billingService.getBillingRecord(recordId),
      enabled: !!recordId,
    });
  };
  
  const useCreateBillingRecord = () => {
    return useMutation({
      mutationFn: (record: any) => 
        billingService.createBillingRecord(record),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['billing-records'] });
        toast.success("Facturation créée avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la création de la facturation");
        console.error("Error creating billing record:", error);
      }
    });
  };
  
  const useUpdateTransmissionStatus = () => {
    return useMutation({
      mutationFn: ({ 
        recordId, 
        status, 
        transmissionId 
      }: { 
        recordId: string, 
        status: string, 
        transmissionId?: string 
      }) => 
        billingService.updateTransmissionStatus(recordId, status, transmissionId),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['billing-records'] });
        queryClient.invalidateQueries({ queryKey: ['billing-record', variables.recordId] });
        toast.success("Statut de transmission mis à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour du statut de transmission");
        console.error("Error updating transmission status:", error);
      }
    });
  };
  
  const useUpdatePaymentStatus = () => {
    return useMutation({
      mutationFn: ({ 
        recordId, 
        status, 
        paymentDate 
      }: { 
        recordId: string, 
        status: string, 
        paymentDate?: string 
      }) => 
        billingService.updatePaymentStatus(recordId, status, paymentDate),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['billing-records'] });
        queryClient.invalidateQueries({ queryKey: ['billing-record', variables.recordId] });
        toast.success("Statut de paiement mis à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour du statut de paiement");
        console.error("Error updating payment status:", error);
      }
    });
  };
  
  // Get detailed billing data with patient information directly from Supabase
  const useDetailedBillingRecord = (recordId: string) => {
    return useQuery({
      queryKey: ['detailed-billing-record', recordId],
      queryFn: () => billingService.getBillingDetails(recordId),
      enabled: !!recordId,
    });
  };

  return {
    useBillingRecords,
    useBillingRecord,
    useCreateBillingRecord,
    useUpdateTransmissionStatus,
    useUpdatePaymentStatus,
    useDetailedBillingRecord
  };
}
