
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { careProtocolsService } from '@/integrations/supabase/services/careProtocolsService';
import { toast } from 'sonner';
import { CareProtocol } from '@/integrations/supabase/services/types';

export function useCareProtocolsService() {
  const queryClient = useQueryClient();
  
  // Care Protocols Queries
  const useCareProtocols = () => {
    return useQuery({
      queryKey: ['care-protocols'],
      queryFn: careProtocolsService.getCareProtocols,
    });
  };
  
  const useCareProtocol = (protocolId: string) => {
    return useQuery({
      queryKey: ['care-protocol', protocolId],
      queryFn: () => careProtocolsService.getCareProtocol(protocolId),
      enabled: !!protocolId,
    });
  };
  
  const useCreateCareProtocol = () => {
    return useMutation({
      mutationFn: (protocol: Omit<CareProtocol, 'id' | 'created_at' | 'updated_at'>) => 
        careProtocolsService.createCareProtocol(protocol),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['care-protocols'] });
        toast.success("Protocole de soins créé avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la création du protocole de soins");
        console.error("Error creating care protocol:", error);
      }
    });
  };
  
  const useUpdateCareProtocol = () => {
    return useMutation({
      mutationFn: ({ protocolId, data }: { protocolId: string, data: Partial<CareProtocol> }) => 
        careProtocolsService.updateCareProtocol(protocolId, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['care-protocols'] });
        queryClient.invalidateQueries({ queryKey: ['care-protocol', variables.protocolId] });
        toast.success("Protocole de soins mis à jour avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la mise à jour du protocole de soins");
        console.error("Error updating care protocol:", error);
      }
    });
  };
  
  const useDeleteCareProtocol = () => {
    return useMutation({
      mutationFn: (protocolId: string) => 
        careProtocolsService.deleteCareProtocol(protocolId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['care-protocols'] });
        toast.success("Protocole de soins supprimé avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la suppression du protocole de soins");
        console.error("Error deleting care protocol:", error);
      }
    });
  };
  
  // Checklists Queries
  const useChecklists = () => {
    return useQuery({
      queryKey: ['checklists'],
      queryFn: careProtocolsService.getChecklists,
    });
  };
  
  const useChecklist = (checklistId: string) => {
    return useQuery({
      queryKey: ['checklist', checklistId],
      queryFn: () => careProtocolsService.getChecklist(checklistId),
      enabled: !!checklistId,
    });
  };
  
  const useCreateChecklist = () => {
    return useMutation({
      mutationFn: (checklist: any) => 
        careProtocolsService.createChecklist(checklist),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['checklists'] });
        toast.success("Liste de vérification créée avec succès");
      },
      onError: (error: any) => {
        toast.error("Erreur lors de la création de la liste de vérification");
        console.error("Error creating checklist:", error);
      }
    });
  };

  return {
    useCareProtocols,
    useCareProtocol,
    useCreateCareProtocol,
    useUpdateCareProtocol,
    useDeleteCareProtocol,
    useChecklists,
    useChecklist,
    useCreateChecklist
  };
}
