import React from 'react';
import { Sparkles, Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { BusinessSettings, SQUARE_BOOKING_URL } from '../types';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (sectionId?: string) => void;
  onOpenBooking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 relative">
      {/* Top dark green & pink ombre line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-pink-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Emily Erickson
                </span>
                <p className="text-xs text-stone-400">
                  Licensed Massage Therapist • Rio Rancho, NM
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              Evidence-based therapeutic deep tissue bodywork, myofascial decompression, and targeted tension relief in a private home studio setting.
            </p>

            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              <a
                href="https://www.linkedin.com/in/emily-erickson-5a441a3b4/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <span>Emily’s LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <a
                href="https://square.site/appointments/buyer/widget/6jkiftssg2nhc1/L2N4AWWF3XG13"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 flex items-center gap-1 transition-colors text-xs text-emerald-400"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Square Appointments Portal</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Studio Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  About the Therapist
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Services Menu & Rates
                </button>
              </li>
              <li>
                <a
                  href={SQUARE_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>Book with Square</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('testimonials')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Client Reviews (5.0 ★)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Parking & Arrival Protocol
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Studio */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Rio Rancho Studio
            </h4>
            <div className="space-y-2 text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}<br />Rio Rancho, NM 87144</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Emily Erickson Massage Therapy. All rights reserved.</p>
          <p>Rio Rancho, NM • Open Saturday, Sunday & Monday by Appointment.</p>
        </div>
      </div>
    </footer>
  );
};
