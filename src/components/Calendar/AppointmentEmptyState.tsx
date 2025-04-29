
import { CalendarX } from "lucide-react";
import { motion } from "framer-motion";

export const AppointmentEmptyState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center py-8 text-muted-foreground"
    >
      <div className="flex flex-col items-center gap-2">
        <CalendarX className="h-12 w-12 text-muted-foreground/50" />
        <p>Aucun rendez-vous prévu pour cette date</p>
      </div>
    </motion.div>
  );
};
