
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.meditime',
  appName: 'Meditime Pro',
  webDir: 'dist',
  server: {
    url: 'https://2a382a84-78fc-4d84-8828-877cafba10ac.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2E8BC0",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    }
  },
  android: {
    buildOptions: {
      keystorePath: 'meditime.keystore',
      keystoreAlias: 'upload',
    }
  },
  ios: {
    scheme: 'Meditime Pro',
    contentInset: 'automatic'
  }
};

export default config;
