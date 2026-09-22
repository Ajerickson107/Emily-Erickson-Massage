import React, { useState } from 'react';
import { Sparkles, ShieldCheck, CreditCard, Clock, Calendar, RefreshCw } from 'lucide-react';
import { BusinessSettings } from '../types';

interface SquareBookingSectionProps {
  settings: BusinessSettings;
}

export const SquareBookingSection: React.FC<SquareBookingSectionProps> = ({ settings }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // In-site Square Appointments route - neutralized so service selection, details, and booking happen directly inside the website
  const squareBookingFlowUrl = '/appointments/6jkiftssg2nhc1/location/L2N4AWWF3XG13';

  return (
    <section id="book" className="py-16 sm:py-24 bg-stone-900 text-stone-100 relative overflow-hidden border-b border-stone-800">
      {/* Ambient background accents */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-gradient-to-tr from-emerald-900/25 via-emerald-800/15 to-pink-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 -z-10 w-80 h-80 bg-gradient-to-br from-emerald-950/30 via-pink-900/15 to-rose-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct Square Appointments Booking</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Schedule Your Appointment
          </h2>

          <p className="mt-3 text-sm sm:text-base text-stone-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Book your therapeutic massage session right here on the website. Select your service, pick your date and time, and confirm your appointment with Square.
          </p>

          {/* Key trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/80 border border-stone-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure Square Booking</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/80 border border-stone-700">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Availability</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/80 border border-stone-700">
              <CreditCard className="w-4 h-4 text-pink-400" />
              <span>Cards & Digital Wallets</span>
            </div>
          </div>
        </div>

        {/* Square Embed Card */}
        <div className="bg-white rounded-3xl p-3 sm:p-6 shadow-2xl border border-stone-200/90 text-stone-900">
          {/* Card Sub-header */}
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2 pb-3 border-b border-stone-200 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-stone-900">Emily Erickson, LMT</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-600">Rio Rancho, NM</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Select your date & time below to complete booking</span>
            </div>
          </div>

          {/* Fully interactive, embedded booking experience right on the page */}
          <div className="w-full relative rounded-2xl bg-stone-50 border border-stone-200 overflow-hidden min-h-[680px] sm:min-h-[760px] flex flex-col">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 text-stone-500 gap-3 z-10">
                <RefreshCw className="w-6 h-6 text-emerald-700 animate-spin" />
                <span className="text-xs font-medium">Connecting to Square Appointments...</span>
              </div>
            )}

            <iframe
              src={squareBookingFlowUrl}
              title="Emily Erickson Massage Therapy Square Appointments"
              className="w-full min-h-[680px] sm:min-h-[780px] border-0 rounded-2xl bg-white"
              allow="payment; payment https://book.squareup.com; payment https://app.squareup.com; clipboard-write; geolocation"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>

          {/* Card Footer notice */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500 px-2">
            <span>Square handles your scheduling, intake, and payment securely.</span>
            <span>Questions or special requests? Call or text <strong className="text-stone-700">{settings.phone}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};
