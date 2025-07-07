import React from 'react';
import { Shield, Sword, Crown, Sparkles } from 'lucide-react';

interface CryptoQuestLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export function CryptoQuestLogo({ 
  size = 'md', 
  showText = true, 
  variant = 'full',
  className = '' 
}: CryptoQuestLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  // Classic CryptoQuest Logo - Established Brand Identity
  const LogoIcon = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer Ring - Mystical Energy */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 animate-pulse opacity-80" />
      
      {/* Middle Ring - Gaming Elements */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 opacity-90" />
      
      {/* Inner Circle - Core Brand */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        {/* Central Symbol - Quest Crystal */}
        <div className="relative">
          <Crown className="w-4 h-4 text-amber-400 absolute -top-1 -left-1 opacity-60" />
          <Shield className="w-5 h-5 text-cyan-400 z-10 relative" />
          <Sword className="w-4 h-4 text-purple-400 absolute -bottom-1 -right-1 opacity-60" />
          <Sparkles className="w-2 h-2 text-white absolute top-0 right-0 animate-ping" />
        </div>
      </div>
      
      {/* Rotating Orbit Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-purple-400 to-cyan-400 opacity-30 animate-spin" style={{ animationDuration: '8s' }} />
    </div>
  );

  const LogoText = () => (
    <div className={`font-bold ${textSizes[size]} logo-text`}>
      <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
        CryptoQuest
      </span>
      <span className="block text-sm text-gray-400 font-normal -mt-1">
        The Shards of Genesis
      </span>
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon />
      {showText && <LogoText />}
    </div>
  );
}

// Tokenomics Version - Focused on Brand Recognition
export function CryptoQuestTokenomicsLogo({ 
  size = 'xl',
  className = ''
}: Pick<CryptoQuestLogoProps, 'size' | 'className'>) {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      {/* Large Central Logo */}
      <div className="flex justify-center">
        <CryptoQuestLogo size={size} variant="icon" />
      </div>
      
      {/* Brand Name */}
      <div className="space-y-2">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          CryptoQuest
        </h1>
        <p className="text-xl text-gray-300 font-medium">The Shards of Genesis</p>
        <p className="text-sm text-gray-400">Est. 2024 • Blockchain MMORPG • CQT Token</p>
      </div>
      
      {/* Token Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-8">
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-lg font-bold text-purple-400">$2.4M</div>
          <div className="text-xs text-gray-400">Liquidity</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-lg font-bold text-cyan-400">125.4%</div>
          <div className="text-xs text-gray-400">Max APR</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-lg font-bold text-amber-400">12.5K</div>
          <div className="text-xs text-gray-400">Holders</div>
        </div>
      </div>
    </div>
  );
}

// Header version for navigation
export function CryptoQuestHeaderLogo() {
  return (
    <div className="flex items-center gap-2">
      <CryptoQuestLogo size="sm" variant="icon" />
      <div className="hidden md:block">
        <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          CryptoQuest
        </div>
        <div className="text-xs text-gray-400 -mt-1">The Shards of Genesis</div>
      </div>
    </div>
  );
}