import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isAppMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(isAppMode);
    
    if (isAppMode) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Show iOS prompt after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
    }

    // Android / Desktop beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000); // Show popup after 3 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 z-[9999]"
      >
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-medical-blue flex-shrink-0 flex items-center justify-center p-2 overflow-hidden mt-1 shadow-lg shadow-medical-blue/20">
            <img src="/logo.png" alt="Doctori App" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1 leading-tight">Installer Doctori</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
              Installez l'application pour une expérience plus rapide et un accès hors ligne.
            </p>
            
            {isIOS ? (
              <div className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl text-xs text-gray-600 dark:text-gray-300">
                1. Appuyez sur <Share className="inline w-4 h-4 mx-1 text-medical-blue" /> ci-dessous
                <br/>
                2. Choisissez <span className="font-bold">Sur l'écran d'accueil</span>
              </div>
            ) : (
              <button 
                onClick={handleInstallClick}
                className="w-full py-2 bg-gradient-to-r from-medical-blue to-medical-light text-white rounded-xl text-sm font-bold shadow-md shadow-medical-blue/20 active:scale-95 transition-transform"
              >
                Installer maintenant
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
