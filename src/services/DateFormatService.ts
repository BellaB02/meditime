
import { format } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Service pour le formatage des dates
 */
export const DateFormatService = {
  /**
   * Formate la date actuelle au format français (JJ/MM/AAAA)
   */
  formatCurrentDate: (): string => {
    return format(new Date(), "dd/MM/yyyy", { locale: fr });
  },
  
  /**
   * Formate l'heure actuelle (HH:MM)
   */
  formatTime: (): string => {
    return format(new Date(), "HH:mm", { locale: fr });
  },
  
  /**
   * Formate une date complète avec l'heure
   */
  formatDateTime: (date: Date): string => {
    return format(date, "dd/MM/yyyy à HH:mm", { locale: fr });
  }
};
