
import { useState, useEffect } from "react";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérifier au chargement
    checkMobile();

    // Ajouter un écouteur de redimensionnement
    window.addEventListener("resize", checkMobile);

    // Nettoyer l'écouteur
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState(false);
  
  useEffect(() => {
    const checkIOS = () => {
      const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(isAppleDevice);
    };
    
    checkIOS();
  }, []);
  
  return isIOS;
}
