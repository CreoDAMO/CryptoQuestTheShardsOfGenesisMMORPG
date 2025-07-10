import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePWA } from '@/hooks/usePWA';
import { 
  Menu, X, Download, Wifi, WifiOff, 
  Smartphone, Bell, Settings, Home
} from 'lucide-react';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function MobileOptimizedLayout({ 
  children, 
  currentView, 
  onViewChange 
}: MobileOptimizedLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isInstallable, isInstalled, isOnline, install, showNotification } = usePWA();

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    { id: 'whitepaper', label: 'White Paper', icon: '📖' },
    { id: 'defi', label: 'DeFi Hub', icon: '🪙' },
    { id: 'game', label: 'Game Hub', icon: '🎮' },
    { id: 'agent', label: 'AI Agent', icon: '🤖' },
    { id: 'onramper', label: 'OnRamper', icon: '💳' },
    { id: 'arbitrage', label: 'CQT Bot', icon: '📈' },
    { id: 'nvidia', label: 'NVIDIA Cloud', icon: '✨' },
    { id: 'wallet', label: 'MetaMask', icon: '🦊' },
    { id: 'holographic', label: 'Holographic', icon: '👁️' },
    { id: 'unified', label: 'Unified Hub', icon: '🧠' },
    { id: 'blockchain', label: 'Blockchain', icon: '🔗' },
    { id: 'admin', label: 'Operating Center', icon: '🛡️' }
  ];

  const handleInstallApp = async () => {
    try {
      await install();
      await showNotification('CryptoQuest Installed!', {
        body: 'The app has been installed successfully. You can now access it from your home screen.'
      });
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-white">CryptoQuest</h1>
          </div>

          <div className="flex items-center gap-2">
            {!isOnline && (
              <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-400">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            )}
            
            {isOnline && (
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </Badge>
            )}

            {isInstallable && !isInstalled && (
              <Button
                size="sm"
                onClick={handleInstallApp}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Install
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700">
        <div className="grid grid-cols-4 p-2">
          {navigationItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* PWA Install Banner */}
      {isInstallable && !isInstalled && (
        <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 shadow-lg z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-white font-semibold">Install CryptoQuest</h3>
                <p className="text-purple-100 text-sm">Get the full app experience</p>
              </div>
            </div>
            <Button
              onClick={handleInstallApp}
              size="sm"
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-1" />
              Install
            </Button>
          </div>
        </div>
      )}

      {/* Offline Notification */}
      {!isOnline && (
        <div className="fixed top-16 left-4 right-4 bg-yellow-600 rounded-lg p-3 shadow-lg z-40">
          <div className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-white" />
            <span className="text-white text-sm">
              You're offline. Some features may be limited.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}