import React, { useState } from 'react';
import { Sparkles, Clock, Check, Plus, ArrowRight, ShieldCheck, Flame, Compass } from 'lucide-react';
import { Service, Enhancement, DurationOption, SQUARE_BOOKING_URL } from '../types';

interface ServicesMenuProps {
  services: Service[];
  enhancements: Enhancement[];
  onSelectServiceForBooking: (serviceId: string, duration: DurationOption) => void;
}

export const ServicesMenu: React.FC<ServicesMenuProps> = ({
  services,
  enhancements,
  onSelectServiceForBooking
}) => {
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(60);
  const activeServices = services.filter(s => s.active);
  const activeEnhancements = enhancements.filter(e => e.active);

  return (
    <section id="services" className="py-20 bg-stone-50 border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Offerings & Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Therapeutic Services & Modalities
          </h2>
          <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal">
            Rooted in therapeutic musculoskeletal bodywork and biomechanics. Every appointment includes a personalized pre-session consultation and post-massage mobility check.
          </p>

          {/* Duration Selector Tabs with green and pink accents */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-stone-200/70 border border-stone-300/80 shadow-inner">
            <button
              onClick={() => setSelectedDuration(60)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedDuration === 60
                  ? 'bg-white text-emerald-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>60 Minutes Session</span>
            </button>
            <button
              onClick={() => setSelectedDuration(90)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedDuration === 90
                  ? 'bg-white text-pink-700 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-4 h-4 text-pink-600" />
              <span>90 Minutes (Recommended)</span>
            </button>
          </div>
        </div>

        {/* Services Grid (Simplified to the 2 primary offerings: Deep Tissue & Swedish) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {activeServices.map(service => {
            const currentPrice = selectedDuration === 60 ? service.price60 : service.price90;

            return (
              <div
                key={service.id}
                className={`bg-white rounded-3xl p-7 sm:p-9 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-lg ${
                  service.isPopular
                    ? 'border-emerald-500/80 ring-2 ring-emerald-500/20'
                    : 'border-stone-200'
                }`}
              >
                {service.isPopular && (
                  <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-600 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Specialty Focus</span>
                  </div>
                )}

                <div>
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-stone-900">
                      {service.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                        ${currentPrice}
                      </span>
                      <span className="text-xs text-stone-500 block font-normal">
                        / {selectedDuration} minutes
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed mb-6">
                    {service.fullDescription}
                  </p>

                  {/* Ideal For */}
                  <div className="mb-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                      Clinical Focus & Indications
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.idealFor.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 rounded-full bg-emerald-50/80 text-emerald-900 border border-emerald-200 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Techniques */}
                  <div className="mb-6 pt-4 border-t border-stone-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2.5">
                      Targeted Techniques Applied
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                      {service.techniquesUsed.map((tech, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{tech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-stone-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Includes intake consultation & buffer</span>
                  </div>
                  <a
                    href={SQUARE_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-700 hover:from-emerald-800 hover:to-pink-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Book {selectedDuration}m Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhancements / Add-ons section */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-stone-200 shadow-sm max-w-5xl mx-auto overflow-hidden relative">
          {/* Green & Pink ombre top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-600" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-stone-100 pb-5">
            <div>
              <h3 className="text-2xl font-bold text-stone-900">
                Therapeutic Add-On Enhancements
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Customize your massage with specialized modalities from Emily’s clinical training. Select during booking.
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full font-semibold self-start sm:self-auto">
              Integrated seamlessly into 60 or 90 min slots
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEnhancements.map(enhancement => (
              <div
                key={enhancement.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {enhancement.name}
                    </h4>
                    <span className="text-sm font-extrabold text-emerald-700 shrink-0">
                      +${enhancement.price}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {enhancement.description}
                  </p>
                </div>
                <div className="mt-3.5 pt-2 text-[11px] text-stone-500 flex items-center gap-1 border-t border-stone-200/60">
                  <Plus className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Available in online booking flow</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
