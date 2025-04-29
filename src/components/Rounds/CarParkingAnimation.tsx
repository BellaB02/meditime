
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CarParkingAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export const CarParkingAnimation = ({ show, onComplete }: CarParkingAnimationProps) => {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    if (show) {
      // Reset animation steps when shown
      setStep(0);
      
      // Start the animation sequence
      const timer = setTimeout(() => {
        setStep(1);
        
        // Move to final step after car arrives
        const finalTimer = setTimeout(() => {
          setStep(2);
          
          // Notify animation is complete
          setTimeout(onComplete, 1000);
        }, 3000);
        
        return () => clearTimeout(finalTimer);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  if (!show) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Tournée terminée !</h2>
        
        <div className="relative h-32 overflow-hidden bg-gray-100 rounded-lg">
          {/* Road */}
          <div className="absolute bottom-0 w-full h-10 bg-gray-300">
            {/* Road markings */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white">
              <div className="flex justify-between">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-8 h-1 bg-white"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Parking spot */}
          <div className="absolute bottom-10 right-10 w-24 h-16">
            <div className="absolute top-0 left-0 right-0 h-full border-2 border-white border-dashed"></div>
          </div>
          
          {/* Car */}
          <motion.div
            className="absolute bottom-12"
            initial={{ x: -100 }}
            animate={{
              x: step === 0 ? -100 : step === 1 ? 200 : 300,
              y: step === 2 ? -5 : 0,
              rotate: step === 2 ? -5 : 0
            }}
            transition={{
              duration: step === 0 ? 0 : 2,
              ease: "easeInOut"
            }}
          >
            <div className="relative">
              {/* Car body */}
              <div className="w-20 h-8 bg-blue-500 rounded-t-lg"></div>
              
              {/* Car cabin */}
              <div className="w-12 h-6 bg-blue-600 mt-[-6px] mx-auto rounded-t-lg"></div>
              
              {/* Wheels */}
              <div className="flex justify-between px-1 mt-1">
                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
              </div>
              
              {/* Windows */}
              <div className="absolute top-1 left-4 w-3 h-4 bg-blue-300 rounded-sm"></div>
              <div className="absolute top-1 right-4 w-3 h-4 bg-blue-300 rounded-sm"></div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-6 text-center">
          {step === 0 && <p>Arrivée au cabinet...</p>}
          {step === 1 && <p>Stationnement en cours...</p>}
          {step === 2 && (
            <motion.p 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-green-600 font-medium"
            >
              Tournée complétée avec succès !
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};
