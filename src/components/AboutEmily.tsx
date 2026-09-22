import React from 'react';
import { Award, GraduationCap, Sparkles, ExternalLink, HeartHandshake, CheckCircle2, Shield, Bed, Droplets, Clock, Home } from 'lucide-react';
import { BusinessSettings } from '../types';

interface AboutEmilyProps {
  settings: BusinessSettings;
  onBookNow: () => void;
}

export const AboutEmily: React.FC<AboutEmilyProps> = ({
  settings,
  onBookNow
}) => {
  return (
    <section id="about" className="py-20 bg-stone-50 border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/10 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-900/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
            <span>Meet Your Therapist</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Meet Emily Erickson
          </h2>
          <p className="mt-3 text-base sm:text-lg text-stone-600 font-medium">
            Licensed Massage Therapist specializing in Therapeutic Deep Tissue in Rio Rancho, New Mexico.
          </p>
        </div>

        {/* 2-Column Balanced Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Biography & Career Timeline */}
          <div className="space-y-6">
            {/* Background Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-5">
              <h3 className="text-2xl font-bold text-stone-900">
                Background & Clinical Bodywork
              </h3>

              <p className="text-stone-700 text-base leading-relaxed">
                Emily Erickson is a Licensed Massage Therapist specializing in <strong>Therapeutic Deep Tissue</strong> massage. After completing rigorous clinical training in musculoskeletal anatomy, physiology, and kinesiology at <strong>IntelliTec College in Albuquerque</strong>, Emily served as the <strong>Lead Therapist at Massage Envy Rio Rancho</strong>. There she trained fellow therapists in advanced technical bodywork, body mechanics, and client communication, authoring clinical reference material while maintaining a 95% 5-star client satisfaction mark.
              </p>

              <p className="text-stone-700 text-base leading-relaxed">
                In addition to her private Rio Rancho home studio, Emily practices bodywork at the renowned <strong>Tamaya Mist Spa and Salon</strong>, bringing refined therapeutic precision, focused myofascial release, and attentive neuromuscular care to every single appointment.
              </p>

              {/* Personalized Client Care Card */}
              <div className="p-5 rounded-2xl bg-stone-100/90 border border-emerald-900/20 text-stone-800 text-sm leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <HeartHandshake className="w-4 h-4 text-emerald-800" />
                  <span>Attentive, Pressure-Calibrated Care</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  Every session starts with a thorough consultation regarding your tension points and physical goals. Pressure is calibrated to your comfort level—releasing deep-seated knots and chronic muscle tension with focused, restorative care.
                </p>
              </div>

              {/* Verified Profile Link */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="text-stone-600 font-semibold">Professional Credentials</span>
                <a
                  href="https://www.linkedin.com/in/emily-erickson-5a441a3b4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-900 hover:text-pink-700 font-bold hover:underline transition-colors"
                >
                  <span>Emily’s LinkedIn Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Experience timeline card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
              <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-800" />
                <span>Professional Training & Career History</span>
              </h3>

              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {/* Item 1 */}
                <div className="relative pl-8">
                  <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-800 border-2 border-white shadow-sm"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm sm:text-base">Tamaya Mist Spa and Salon</span>
                    <span className="text-xs bg-emerald-950/10 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-900/20">Current</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-900 mt-0.5">Licensed Massage Therapist</p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed font-medium">
                    Delivering customized therapeutic deep tissue sessions, therapeutic hot stone applications, and tailored restorative bodywork.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="relative pl-8">
                  <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-pink-700 border-2 border-white shadow-sm"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm sm:text-base">Massage Envy – Rio Rancho, NM</span>
                    <span className="text-xs text-stone-500 font-semibold">March 2025 – April 2026</span>
                  </div>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">Lead Therapist</p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed font-medium">
                    Mentored therapist team in therapeutic deep tissue protocols, body mechanics, and enhancements. Authored clinical reference handbooks with a 95% 5-star rating.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="relative pl-8">
                  <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-stone-400 border-2 border-white shadow-sm"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm sm:text-base">IntelliTec College – Albuquerque, NM</span>
                    <span className="text-xs text-stone-500 font-semibold">May 2024 – Feb 2025</span>
                  </div>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">Certificate in Massage Therapy</p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed font-medium">
                    Rigorous clinical curriculum covering musculoskeletal anatomy, physiological mechanics, kinesiology, deep tissue pathology, and professional ethics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clinical Standards & Private Studio Sanctuary */}
          <div className="space-y-6">
            {/* Standards badge card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-600" />
              
              <div className="flex items-center gap-3 pb-5 border-b border-stone-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/10 border border-emerald-900/20 flex items-center justify-center text-emerald-900">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-stone-900">Clinical Studio Standards</h4>
                  <p className="text-xs text-emerald-900 font-semibold">State of New Mexico Licensed</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs text-stone-700">
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Core Specialty</span>
                  <span className="font-bold text-stone-900">Therapeutic Deep Tissue</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Location</span>
                  <span className="font-bold text-stone-900">Rio Rancho, NM (Home Studio)</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Operating Days</span>
                  <span className="font-bold text-stone-900">Saturday, Sunday & Monday</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Client Protocol</span>
                  <span className="font-bold text-stone-900">Strictly 1 Client per Window</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-stone-500 font-medium">Sanitization Buffer</span>
                  <span className="font-bold text-stone-900">{settings.bufferMinutes} Min Between Appointments</span>
                </div>
              </div>
            </div>

            {/* Studio Sanctuary & Experience Card (Balances Desktop Layout) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 relative overflow-hidden space-y-5">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-900 via-pink-600 to-rose-600" />
              
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-700">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-stone-900">Private Studio Sanctuary</h4>
                  <p className="text-xs text-stone-500 font-semibold">Quiet, comfortable & unhurried care</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Bed className="w-4 h-4 text-emerald-800" />
                    <span>Plush Heated Table</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Custom heated padding with ergonomic supportive contours for spine and neck comfort.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Droplets className="w-4 h-4 text-pink-700" />
                    <span>Hypoallergenic Oils</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Pure, unscented natural carrier oils that nourish skin without heavy residue.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Clock className="w-4 h-4 text-emerald-800" />
                    <span>Zero Rush Transitions</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    A full 15-minute gap guarantees you never pass another client in the entryway.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <CheckCircle2 className="w-4 h-4 text-pink-700" />
                    <span>Private Arrival</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Dedicated driveway parking and immediate, peaceful entry into the studio space.
                  </p>
                </div>
              </div>

              <button
                onClick={onBookNow}
                className="w-full mt-2 bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-700 hover:from-emerald-800 hover:to-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm cursor-pointer active:scale-98"
              >
                Schedule an Appointment with Emily
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
