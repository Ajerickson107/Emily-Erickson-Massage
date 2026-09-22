import React from 'react';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../types';
import SquareBookingWidget from './SquareBookingWidget';

interface SquareBookingModalProps {
  isOpen: boolean;
  settings: BusinessSettings;
  onClose: () => void;
}

export const SquareBookingModal: React.FC<SquareBookingModalProps> = ({
  isOpen,
  settings: _settings,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-pink-600 flex items-center justify-center text-white text-xs">
              <Sparkles className="w-4 h-4 text-emerald-100" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Book with Emily Erickson, LMT</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono uppercase">
                  Square Appointments
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Rio Rancho, NM • Saturdays, Sundays & Mondays
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Standard Native Square Widget */}
        <div className="p-2 sm:p-6 overflow-y-auto flex-1 bg-stone-50/50 flex flex-col items-center">
          <div className="w-full relative rounded-2xl bg-white border border-stone-200 overflow-hidden min-h-[700px] flex flex-col p-2">
            <SquareBookingWidget />
          </div>
        </div>

        {/* Modal Footer info */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-600 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Payments, scheduling, and intake are secured via Square Appointments.</span>
        </div>
      </div>
    </div>
  );
};
