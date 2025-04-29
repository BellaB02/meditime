
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface CompleteRoundAnimationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompleteRoundAnimation = ({
  isOpen,
  onClose
}: CompleteRoundAnimationProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative w-full h-40">
            {/* Route */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-2 bg-gray-300 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Voiture */}
            <motion.div
              className="absolute bottom-4"
              initial={{ x: "-20%" }}
              animate={{ x: "80%" }}
              transition={{ 
                duration: 3, 
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="20" width="50" height="15" rx="5" fill="#3b82f6" />
                  <rect x="10" y="10" width="30" height="15" rx="3" fill="#3b82f6" />
                  <circle cx="15" cy="35" r="5" fill="black" />
                  <circle cx="45" cy="35" r="5" fill="black" />
                </svg>
              </div>
            </motion.div>
            
            {/* Garage/Maison */}
            <motion.div 
              className="absolute right-0 bottom-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="20" width="30" height="30" fill="#e11d48" />
                <path d="M5 20L25 5L45 20" stroke="#e11d48" strokeWidth="4" />
                <rect x="20" y="30" width="10" height="20" fill="white" />
              </svg>
            </motion.div>
          </div>
          
          <motion.div
            className="text-xl font-bold mt-4 text-primary"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            Tournée terminée !
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
