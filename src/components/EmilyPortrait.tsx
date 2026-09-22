import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, Heart, Award, MapPin } from 'lucide-react';
import emilyPortraitImage from './portrait.jpg';

const baseUrl = import.meta.env.BASE_URL || './';
const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

const CANDIDATE_IMAGE_PATHS = [
  emilyPortraitImage,
  `${normalizedBase}portrait.jpg`,
  `${normalizedBase}Portrait.jpg`,
  './portrait.jpg',
  '/portrait.jpg'
];

interface EmilyPortraitProps {
  className?: string;
  showDetails?: boolean;
}

export const EmilyPortrait: React.FC<EmilyPortraitProps> = ({
  className = '',
  showDetails = true
}) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [allFailed, setAllFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageError = () => {
    if (candidateIndex + 1 < CANDIDATE_IMAGE_PATHS.length) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setAllFailed(true);
    }
  };

  const currentSrc = CANDIDATE_IMAGE_PATHS[candidateIndex];

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [currentSrc]);

  return (
    <div className={`relative group max-w-[290px] sm:max-w-[310px] mx-auto w-full ${className}`}>
      {/* Dark Forest Green and Pink Ombre Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-800/60 via-emerald-700/60 via-pink-600/60 to-rose-600/60 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500 pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative rounded-2xl bg-stone-900 border border-stone-800 p-1.5 shadow-xl overflow-hidden">
        {/* Ombre border inner wrapper */}
        <div className="rounded-xl p-[1.5px] bg-gradient-to-br from-emerald-700 via-emerald-800 via-pink-600 to-rose-600">
          <div className="relative rounded-[10px] bg-stone-950 overflow-hidden aspect-[4/4.2] sm:aspect-[4/4.3] flex items-center justify-center">
            {!allFailed ? (
              <img
                ref={imgRef}
                src={currentSrc}
                alt="Emily Erickson, Licensed Massage Therapist"
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : null}

            {/* If loading or failed to find local image file */}
            {(!imageLoaded || allFailed) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-stone-200">
                <div className="relative mb-2.5">
                  {/* Dark Green & Pink ring avatar frame */}
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-emerald-700 via-emerald-800 to-pink-600 shadow-md flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-white overflow-hidden">
                      <div className="flex flex-col items-center justify-center">
                        <Sparkles className="w-5 h-5 text-pink-400 mb-0.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">Emily</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                    ✓
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  Emily Erickson
                </h3>
                <p className="text-[11px] font-semibold text-emerald-400 mt-0.5">
                  Licensed Massage Therapist (LMT)
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-800/80 border border-stone-700 text-stone-300 text-[10px]">
                  <span className="w-1 h-1 rounded-full bg-pink-400"></span>
                  <span>Therapeutic Deep Tissue Specialist</span>
                </div>
              </div>
            )}

            {/* Floating verified badge in bottom corner when real photo loaded */}
            {imageLoaded && !allFailed && (
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded-lg bg-stone-950/85 backdrop-blur-md border border-stone-800/90 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white leading-tight">Emily Erickson, LMT</h4>
                    <p className="text-[10px] text-emerald-400 font-medium leading-tight">Therapeutic Deep Tissue</p>
                  </div>
                  <span className="text-[9px] bg-emerald-950/90 text-emerald-300 border border-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                    Licensed MT
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Details Pill (if requested) */}
        {showDetails && (
          <div className="px-2.5 py-2 mt-0.5 flex items-center justify-between text-[11px] text-stone-300">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-stone-200">Rio Rancho Studio</span>
            </div>
            <span className="text-[10px] bg-gradient-to-r from-emerald-400 to-pink-400 bg-clip-text text-transparent font-bold">
              Sat, Sun & Mon
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
