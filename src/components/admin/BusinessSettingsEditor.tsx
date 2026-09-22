import React, { useState } from 'react';
import {
  DollarSign,
  Clock,
  Car,
  ShieldAlert,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Sliders,
  Lock,
  Key,
  Mail
} from 'lucide-react';
import { Service, Enhancement, BusinessSettings } from '../../types';
import { StorageService } from '../../services/storage';

interface BusinessSettingsEditorProps {
  services: Service[];
  enhancements: Enhancement[];
  settings: BusinessSettings;
  onRefresh: () => void;
}

export const BusinessSettingsEditor: React.FC<BusinessSettingsEditorProps> = ({
  services,
  enhancements,
  settings,
  onRefresh
}) => {
  const [localSettings, setLocalSettings] = useState<BusinessSettings>(settings);
  const [localServices, setLocalServices] = useState<Service[]>(services);
  const [localEnhancements, setLocalEnhancements] = useState<Enhancement[]>(enhancements);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Admin credentials state
  const [adminAuth, setAdminAuth] = useState(StorageService.getAdminCredentials());
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleSaveAll = () => {
    // Save settings
    StorageService.saveSettings(localSettings);

    // Save services
    localServices.forEach(srv => {
      StorageService.updateService(srv.id, srv);
    });

    // Save enhancements
    localEnhancements.forEach(enh => {
      StorageService.updateEnhancement(enh.id, enh);
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onRefresh();
  };

  const handleSaveAuth = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveAdminCredentials(adminAuth);
    setAuthSuccess(true);
    setTimeout(() => setAuthSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all data, services, and appointments to initial demo defaults?')) {
      StorageService.resetDefaults();
      onRefresh();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Save Action Banner */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between sticky top-24 z-20">
        <div>
          <h3 className="font-bold text-stone-900 text-base">
            Content & Studio Settings
          </h3>
          <p className="text-xs text-stone-500">
            Emily Erickson Massage Therapy — Operational Configuration
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved successfully!</span>
            </span>
          )}

          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* 1. SCHEDULING BUFFER DURATION */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-700" />
            <h4 className="font-serif text-lg font-bold text-stone-900">
              Scheduling Buffer Duration
            </h4>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 font-mono">
            {localSettings.bufferMinutes} Minutes Buffer
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Controls the mandatory gap automatically enforced between appointments in the booking calendar. This buffer guarantees Emily has dedicated time to sanitize the massage table, change linens, and ensure zero client overlap.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[15, 30, 45, 60].map(mins => (
            <button
              type="button"
              key={mins}
              onClick={() => setLocalSettings({ ...localSettings, bufferMinutes: mins })}
              className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                localSettings.bufferMinutes === mins
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                  : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {mins} Minutes Gap
            </button>
          ))}
        </div>
      </div>

      {/* 2. SERVICE MENU & RATES MANAGEMENT */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-700" />
            <h4 className="font-serif text-lg font-bold text-stone-900">
              Service Menu & Pricing (60 vs 90 Minutes)
            </h4>
          </div>
          <span className="text-xs text-stone-500">Live rate updates</span>
        </div>

        <div className="space-y-4">
          {localServices.map((srv, idx) => (
            <div
              key={srv.id}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={srv.name}
                    onChange={e => {
                      const updated = [...localServices];
                      updated[idx].name = e.target.value;
                      setLocalServices(updated);
                    }}
                    className="font-bold text-sm text-stone-900 bg-white border border-stone-300 rounded px-2.5 py-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {srv.isPopular && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={srv.active}
                    onChange={e => {
                      const updated = [...localServices];
                      updated[idx].active = e.target.checked;
                      setLocalServices(updated);
                    }}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Active in Online Booking</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                    60-Minute Rate ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-stone-400 font-bold">$</span>
                    <input
                      type="number"
                      value={srv.price60}
                      onChange={e => {
                        const updated = [...localServices];
                        updated[idx].price60 = Number(e.target.value);
                        setLocalServices(updated);
                      }}
                      className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                    90-Minute Rate ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-stone-400 font-bold">$</span>
                    <input
                      type="number"
                      value={srv.price90}
                      onChange={e => {
                        const updated = [...localServices];
                        updated[idx].price90 = Number(e.target.value);
                        setLocalServices(updated);
                      }}
                      className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-stone-300 text-sm font-bold text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ENHANCEMENTS PRICING */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h4 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <span>Therapeutic Add-on Enhancements</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {localEnhancements.map((enh, idx) => (
            <div
              key={enh.id}
              className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3"
            >
              <div>
                <span className="text-xs font-bold text-stone-900 block">{enh.name}</span>
                <span className="text-[11px] text-stone-500 line-clamp-1">{enh.description}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative w-20">
                  <span className="absolute left-2.5 top-1 text-stone-400 text-xs font-bold">$</span>
                  <input
                    type="number"
                    value={enh.price}
                    onChange={e => {
                      const updated = [...localEnhancements];
                      updated[idx].price = Number(e.target.value);
                      setLocalEnhancements(updated);
                    }}
                    className="w-full pl-6 pr-2 py-1 rounded border border-stone-300 bg-white text-xs font-bold text-stone-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. BUSINESS HOURS */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h4 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-700" />
          <span>Weekly Operating Hours</span>
        </h4>

        <div className="space-y-2 text-xs">
          {Object.entries(localSettings.operatingHours).map(([day, sched]) => (
            <div
              key={day}
              className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200"
            >
              <div className="w-28 font-bold text-stone-800">{day}</div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sched.isOpen}
                  onChange={e => {
                    setLocalSettings({
                      ...localSettings,
                      operatingHours: {
                        ...localSettings.operatingHours,
                        [day]: { ...sched, isOpen: e.target.checked }
                      }
                    });
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className={sched.isOpen ? 'font-semibold text-emerald-800' : 'text-stone-400'}>
                  {sched.isOpen ? 'Open' : 'Closed'}
                </span>
              </label>

              {sched.isOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sched.start}
                    onChange={e => {
                      setLocalSettings({
                        ...localSettings,
                        operatingHours: {
                          ...localSettings.operatingHours,
                          [day]: { ...sched, start: e.target.value }
                        }
                      });
                    }}
                    className="w-20 p-1 text-center bg-white border border-stone-300 rounded font-mono text-xs"
                  />
                  <span>to</span>
                  <input
                    type="text"
                    value={sched.end}
                    onChange={e => {
                      setLocalSettings({
                        ...localSettings,
                        operatingHours: {
                          ...localSettings.operatingHours,
                          [day]: { ...sched, end: e.target.value }
                        }
                      });
                    }}
                    className="w-20 p-1 text-center bg-white border border-stone-300 rounded font-mono text-xs"
                  />
                </div>
              ) : (
                <span className="text-stone-400 italic">No bookings accepted</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. ARRIVAL & PARKING POLICIES EDIT */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h4 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
          <Car className="w-5 h-5 text-emerald-700" />
          <span>Rio Rancho Studio Arrival & Parking Instructions</span>
        </h4>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Wait in Car / Arrival Protocol
          </label>
          <textarea
            rows={3}
            value={localSettings.arrivalPolicy}
            onChange={e => setLocalSettings({ ...localSettings, arrivalPolicy: e.target.value })}
            className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Parking Instructions
          </label>
          <textarea
            rows={2}
            value={localSettings.parkingInstructions}
            onChange={e => setLocalSettings({ ...localSettings, parkingInstructions: e.target.value })}
            className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
          />
        </div>
      </div>

      {/* 6. ADMIN SECURITY & LOGIN CREDENTIALS */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-700" />
            <h4 className="font-serif text-lg font-bold text-stone-900">
              Admin Portal Security & Credentials
            </h4>
          </div>
          <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-mono">
            Access Control
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Manage the username and password required to access the administrative dashboard, client records, and calendar.
        </p>

        <form onSubmit={handleSaveAuth} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Admin Username / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={adminAuth.username}
                onChange={e => setAdminAuth({ ...adminAuth, username: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={adminAuth.password}
                onChange={e => setAdminAuth({ ...adminAuth, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Admin Credentials</span>
            </button>

            {authSuccess && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Credentials updated!</span>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
