
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
      <DialogContent className="sm:max-w-md bg-white border shadow-lg p-6">
        <div className="relative w-full h-60 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-2 bg-primary/70 rounded-full" />
          
          <motion.div
            className="absolute bottom-6"
            initial={{ x: -100 }}
            animate={{ 
              x: showAnimation ? 500 : -100,
              transition: { duration: 2.5, ease: "easeInOut" }
            }}
          >
            <CarAnimation />
          </motion.div>
          
          <motion.div
            className="absolute top-8 text-center w-full text-2xl font-bold text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: showAnimation ? 1 : 0,
              y: showAnimation ? 0 : -20,
              transition: { duration: 0.5 }
            }}
          >
            Tournée terminée !
          </motion.div>
          
          {/* Paysage urbain simple */}
          <div className="absolute bottom-2 left-0 w-full flex justify-around">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i} 
                className="w-12 h-16 md:h-24 bg-gray-300 rounded-t-lg mx-1"
                style={{ height: `${40 + (i * 10)}px` }}
                initial={{ y: 100 }}
                animate={{ 
                  y: showAnimation ? 0 : 100,
                  transition: { delay: 0.1 * i, duration: 0.5 }
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant SVG de voiture avec animation améliorée
const CarAnimation = () => {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(prev => !prev);
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{ 
        y: bounce ? -2 : 2,
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      <svg 
        width="80" 
        height="50" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <motion.path 
          d="M19 17H5V15.5H19V17Z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="1.5" 
        />
        <motion.path 
          d="M17.5 14C17.5 14.5523 17.0523 15 16.5 15C15.9477 15 15.5 14.5523 15.5 14C15.5 13.4477 15.9477 13 16.5 13C17.0523 13 17.5 13.4477 17.5 14Z" 
          fill="currentColor" 
        />
        <motion.path 
          d="M8.5 14C8.5 14.5523 8.05229 15 7.5 15C6.94772 15 6.5 14.5523 6.5 14C6.5 13.4477 6.94772 13 7.5 13C8.05229 13 8.5 13.4477 8.5 14Z" 
          fill="currentColor" 
        />
        <motion.path 
          d="M16 7.5H15.5V6H8.5V7.5H8L6 11H18L16 7.5Z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="1.5" 
        />
        {/* Exhaust smoke animation */}
        <motion.circle
          cx="5" 
          cy="16"
          r="0.5"
          fill="#6E6E6E"
          initial={{ opacity: 0.8, scale: 0.5 }}
          animate={{ 
            opacity: [0.8, 0],
            scale: [0.5, 2],
            x: -5,
            y: -1,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
        <motion.circle
          cx="4.5" 
          cy="16"
          r="0.3"
          fill="#6E6E6E"
          initial={{ opacity: 0.8, scale: 0.5 }}
          animate={{ 
            opacity: [0.8, 0],
            scale: [0.5, 1.5],
            x: -3,
            y: -2,
          }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </svg>
    </motion.div>
  );
};
