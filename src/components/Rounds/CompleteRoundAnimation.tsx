
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface CompleteRoundAnimationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompleteRoundAnimation = ({ isOpen, onClose }: CompleteRoundAnimationProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
      
      // Fermer automatiquement après l'animation
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-transparent border-0 shadow-none">
        <div className="relative w-full h-40 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary" />
          
          <motion.div
            className="absolute bottom-4"
            initial={{ x: -100 }}
            animate={{ 
              x: showAnimation ? 500 : -100,
              transition: { duration: 2, ease: "easeInOut" }
            }}
          >
            <CarIcon />
          </motion.div>
          
          <motion.div
            className="absolute top-4 text-center w-full text-xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: showAnimation ? 1 : 0,
              y: showAnimation ? 0 : -20,
              transition: { duration: 0.5 }
            }}
          >
            Tournée terminée !
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant SVG de voiture
const CarIcon = () => (
  <svg 
    width="64" 
    height="40" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary"
  >
    <path 
      d="M19 17H5V15.5H19V17Z" 
      fill="currentColor" 
      stroke="currentColor" 
      strokeWidth="1.5" 
    />
    <path 
      d="M17.5 14C17.5 14.5523 17.0523 15 16.5 15C15.9477 15 15.5 14.5523 15.5 14C15.5 13.4477 15.9477 13 16.5 13C17.0523 13 17.5 13.4477 17.5 14Z" 
      fill="currentColor" 
    />
    <path 
      d="M8.5 14C8.5 14.5523 8.05229 15 7.5 15C6.94772 15 6.5 14.5523 6.5 14C6.5 13.4477 6.94772 13 7.5 13C8.05229 13 8.5 13.4477 8.5 14Z" 
      fill="currentColor" 
    />
    <path 
      d="M16 7.5H15.5V6H8.5V7.5H8L6 11H18L16 7.5Z" 
      fill="currentColor" 
      stroke="currentColor" 
      strokeWidth="1.5" 
    />
  </svg>
);
