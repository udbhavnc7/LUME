import React from 'react';
import { AppTheme } from '../types';

interface LumeLogoProps {
  theme?: AppTheme;
  className?: string;
  height?: number | string;
}

export const LumeLogo: React.FC<LumeLogoProps> = ({
  theme,
  className = 'h-7 w-auto',
  height
}) => {
  return (
    <div 
      className={`inline-flex items-center select-none ${className}`}
      style={height ? { height } : undefined}
    >
      {/* Light Mode Logo: Crisp black wordmark as provided */}
      <img
        src="/logo-light@2x.png"
        alt="LUME Logo"
        className={`h-full w-auto object-contain lume-logo-light ${
          theme === 'dark' ? 'hidden' : theme === 'light' ? 'block' : ''
        }`}
        loading="eager"
      />
      {/* Dark Mode Logo: Multi-tone colored letters (Amber, Emerald, Teal, Cyan) */}
      <img
        src="/logo-dark@2x.png"
        alt="LUME Logo"
        className={`h-full w-auto object-contain lume-logo-dark ${
          theme === 'light' ? 'hidden' : theme === 'dark' ? 'block' : ''
        }`}
        loading="eager"
      />
    </div>
  );
};
