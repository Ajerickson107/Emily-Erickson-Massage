import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  // Try candidate image filenames in public folder in sequence: logo.png, logo.jpg, Logo.png, Logo.jpg
  const candidateLogos = [
    `${import.meta.env.BASE_URL}logo.png`,
    `${import.meta.env.BASE_URL}logo.jpg`,
    `${import.meta.env.BASE_URL}Logo.png`,
    `${import.meta.env.BASE_URL}Logo.jpg`
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasWorkingImage, setHasWorkingImage] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const testImage = (index: number) => {
      if (index >= candidateLogos.length) {
        if (isMounted) setHasWorkingImage(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (isMounted) {
          setCurrentIndex(index);
          setHasWorkingImage(true);
        }
      };
      img.onerror = () => {
        testImage(index + 1);
      };
      img.src = candidateLogos[index];
    };

    testImage(0);

    return () => {
      isMounted = false;
    };
  }, []);

  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5 text-emerald-100',
    md: 'w-4 h-4 text-emerald-100',
    lg: 'w-5 h-5 text-emerald-100'
  }[size];

  if (hasWorkingImage) {
    return (
      <div className={`${sizeClasses} rounded-full overflow-hidden bg-stone-900 border border-emerald-800/40 shadow-inner shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center ${className}`}>
        <img
          src={candidateLogos[currentIndex]}
          alt="Emily Erickson Massage Logo"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Default sparkle symbol in dark green & pink ombre circle
  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-pink-600 flex items-center justify-center text-white shadow-inner shrink-0 group-hover:scale-105 transition-transform ${className}`}>
      <Sparkles className={iconSizes} />
    </div>
  );
};
