import React from 'react';
import { ShieldCheck, MapPin, Sparkles, Clock, ArrowRight, CheckCircle2, Calendar, Heart } from 'lucide-react';
import { BusinessSettings, SQUARE_BOOKING_URL } from '../types';
import { EmilyPortrait } from './EmilyPortrait';

interface HeroProps {
  settings: BusinessSettings;
  onBookNow: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onBookNow,
  onExploreServices
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-stone-100 pt-10 pb-16 sm:py-20 border-b border-stone-800">
      {/* Green & Pink Ombre Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-gradient-to-tr from-emerald-900/30 via-emerald-800/20 to-pink-900/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 -z-10 w-80 h-80 bg-gradient-to-br from-emerald-950/40 via-pink-900/20 to-rose-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Main Hero Copy - Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top credentials pill with green-pink ombre border */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 shadow-sm border border-stone-800 text-stone-200 text-xs sm:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-emerald-400">Licensed Massage Therapist</span>
              <span className="text-stone-600">•</span>
              <span className="text-pink-300 font-semibold">Rio Rancho, NM</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.2]">
              Therapeutic deep tissue that helps you{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-pink-300 bg-clip-text text-transparent">
                feel lighter & move freely.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-medium">
              Specializing in <strong>Therapeutic Deep Tissue</strong> in a warm, private home studio in Rio Rancho. A thoughtful balance of clinical musculoskeletal precision and restorative comfort—customized to release tight shoulders, relieve chronic tension, and reset your body.
            </p>

            {/* Key trust bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-stone-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Strict 1-client privacy (no waiting rooms)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{settings.bufferMinutes}-minute sanitization buffer between clients</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Unrushed 60 & 90-minute treatment slots</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>Secure online Square payment upon booking</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <a
                href={SQUARE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-pink-700 hover:from-emerald-700 hover:to-pink-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-pink-950/40 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer group active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Session</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onExploreServices}
                className="bg-stone-900/90 hover:bg-stone-800 text-stone-200 font-semibold px-6 py-3.5 rounded-xl border border-stone-700/80 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer hover:border-pink-500/40"
              >
                <span>View Modalities & Rates</span>
              </button>
            </div>
          </div>

          {/* Right Column: Emily's Portrait & Studio Info */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-3.5">
            <EmilyPortrait />

            {/* Quick Studio snapshot bar */}
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-[290px] sm:max-w-[310px]">
              <div className="p-2.5 rounded-xl bg-stone-900/85 border border-stone-800/90 text-center sm:text-left">
                <span className="text-stone-400 block text-[10px] uppercase font-semibold tracking-wider mb-0.5">Specialty</span>
                <span className="font-bold text-xs text-emerald-400 block leading-tight">Deep Tissue</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900/85 border border-stone-800/90 text-center sm:text-left">
                <span className="text-stone-400 block text-[10px] uppercase font-semibold tracking-wider mb-0.5">Schedule</span>
                <span className="font-bold text-xs text-pink-300 block leading-tight">Sat, Sun & Mon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
