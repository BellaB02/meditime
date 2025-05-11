
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MobileService } from './services/MobileService'

// Initialize mobile services if running as a native app
if (MobileService.isMobileApp()) {
  MobileService.init().catch(error => {
    console.error("Failed to initialize mobile services:", error);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
