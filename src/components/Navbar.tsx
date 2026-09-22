import React from 'react';
import { Sparkles, Phone, MapPin, Calendar, ShieldCheck, User } from 'lucide-react';
import { BusinessSettings } from '../types';

interface NavbarProps {
  settings: BusinessSettings;
  onNavigate: (sectionId?: string) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onNavigate,
  onOpenBooking
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 text-stone-100 backdrop-blur-md border-b border-stone-800 shadow-sm transition-all">
      {/* Simple Dark Green and Pink Ombre Accent Line */}
      <div className="h-1 bg-gradient-to-r from-emerald-900 via-emerald-800 via-pink-600 to-rose-600 w-full" />

      {/* Top micro banner - robust and responsive on smaller screens */}
      <div className="bg-stone-950 border-b border-emerald-900/50 text-emerald-200/90 text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate hidden sm:inline font-medium">Private Home Studio in Rio Rancho, NM • By Appointment Only (Sat, Sun & Mon)</span>
            <span className="truncate sm:hidden text-[11px] font-medium">Rio Rancho Studio • Sat, Sun & Mon by Appt</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-300 shrink-0">
            <a
              href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold">{settings.phone}</span>
            </a>
            <span className="text-stone-700 hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1 text-stone-300">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Rio Rancho, NM</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand identity */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-pink-600 flex items-center justify-center text-white shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-emerald-100" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-sm sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                Emily Erickson
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800 shrink-0">
                LMT
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-stone-400 font-normal whitespace-nowrap">
              Therapeutic Deep Tissue
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-semibold text-stone-300">
          <button
            onClick={() => onNavigate('about')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            About Emily
          </button>
          <button
            onClick={() => onNavigate('services')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Services & Rates
          </button>
          <button
            onClick={() => onNavigate('book')}
            className="hover:text-emerald-300 transition-colors cursor-pointer text-emerald-300"
          >
            Square Booking
          </button>
          <button
            onClick={() => onNavigate('testimonials')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Client Reviews
          </button>
          <button
            onClick={() => onNavigate('policies')}
            className="hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Studio & Arrival Policies
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenBooking}
            className="bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Book via Square</span>
            <span className="sm:hidden">Book Now</span>
          </button>
        </div>
      </div>
    </header>
  );
};
