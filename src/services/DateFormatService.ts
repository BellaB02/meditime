
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const DateFormatService = {
  /**
   * Formate la date actuelle au format français
   */
  formatCurrentDate: (): string => {
    const now = new Date();
    return format(now, "dd/MM/yyyy", { locale: fr });
  },
  
  /**
   * Formate une date donnée au format français
   */
  formatDate: (date: Date): string => {
    return format(date, "dd/MM/yyyy", { locale: fr });
  },
  
  /**
   * Formate une heure donnée
   */
  formatTime: (date?: Date): string => {
    const dateToFormat = date || new Date();
    return format(dateToFormat, "HH:mm");
  },
  
  /**
   * Formate une date pour les noms de fichiers
   */
  formatDateForFilename: (): string => {
    return format(new Date(), "dd-MM-yyyy");
  }
};
