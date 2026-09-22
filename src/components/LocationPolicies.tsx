import React from 'react';
import { MapPin, Clock, Car, Phone, Mail, ShieldAlert, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';
import { BusinessSettings } from '../types';

interface LocationPoliciesProps {
  settings: BusinessSettings;
  onBookNow: () => void;
}

export const LocationPolicies: React.FC<LocationPoliciesProps> = ({
  settings,
  onBookNow
}) => {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${settings.address}, ${settings.cityStateZip}`
  )}`;

  return (
    <section id="policies" className="py-20 bg-stone-50 border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Studio Location & Etiquette</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Location, Parking & Arrival Protocol
          </h2>
          <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal">
            Our studio is located in a quiet residential setting in Rio Rancho, New Mexico. Please review our arrival guidelines to ensure a peaceful, seamless visit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Arrival & Parking Protocol (High Priority) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Arrival Protocol Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
                  <Car className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                    Mandatory Arrival & Parking Procedure
                  </h3>
                  <p className="text-xs text-stone-500">
                    Rio Rancho Home Studio Guidelines
                  </p>
                </div>
              </div>

              {/* Step by step arrival instructions */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">
                      Please wait in your vehicle until your exact appointment time
                    </h4>
                    <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                      Because this is a private home studio with a strict 1-client limit, waiting in your car preserves the complete privacy of the client before you and allows Emily full time for our clinical-grade sanitization and linen exchange protocol.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">
                      Designated Parking
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {settings.parkingInstructions}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">
                      Studio Entry & Greeting
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      At your exact scheduled time, walk up to the front entrance. Emily will greet you at the door and escort you directly into the sanitized massage suite.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancellation policy callout */}
              <div className="mt-6 pt-5 border-t border-stone-100 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-600">
                  <strong className="text-stone-900 font-semibold">24-Hour Rescheduling & Cancellation:</strong>
                  <p className="mt-0.5">{settings.cancellationPolicy}</p>
                </div>
              </div>
            </div>

            {/* Operating Hours card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <span>Weekly Studio Hours</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(settings.operatingHours).map(([day, sched]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/80"
                  >
                    <span className="font-medium text-stone-800">{day}</span>
                    <span className={sched.isOpen ? 'text-emerald-700 font-semibold' : 'text-stone-400 font-normal'}>
                      {sched.isOpen ? `${sched.start} – ${sched.end}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Address, Map Card & Contact info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Studio Address
                </span>
                <h3 className="text-2xl font-bold text-stone-900">
                  {settings.address}
                </h3>
                <p className="text-stone-600 text-sm mt-0.5">
                  Rio Rancho, NM 87144
                </p>
              </div>

              {/* Visual map card */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 aspect-video flex flex-col items-center justify-center p-4 text-center group">
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-emerald-950/40"></div>
                <div className="relative z-10 text-white space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-white shadow-lg mx-auto flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Rio Rancho, New Mexico</span>
                    <span className="text-xs text-stone-300">Near Northern Blvd & NM-528</span>
                  </div>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white text-stone-900 font-semibold px-4 py-1.5 rounded-lg text-xs shadow-md hover:bg-stone-100 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Direct Contacts */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Direct Inquiries
                </h4>

                <a
                  href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 hover:bg-emerald-50 text-stone-800 hover:text-emerald-950 border border-stone-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="text-xs text-stone-500 block">Phone / Text</span>
                    <span className="text-sm font-semibold">{settings.phone}</span>
                  </div>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 hover:bg-emerald-50 text-stone-800 hover:text-emerald-950 border border-stone-200 transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="text-xs text-stone-500 block">Email Inquiries</span>
                    <span className="text-sm font-semibold">{settings.email}</span>
                  </div>
                </a>
              </div>

              {/* Payment info notice */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 space-y-1">
                <span className="font-semibold text-stone-800 block">Secure Online Checkout:</span>
                <p className="text-[11px] text-stone-500">
                  Appointments are secured through online Square payment (credit/debit, Apple Pay, Google Pay) when scheduling.
                </p>
              </div>

              <button
                onClick={onBookNow}
                className="w-full bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-700 hover:from-emerald-800 hover:to-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm cursor-pointer text-center"
              >
                Book Your 60 or 90 Min Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
