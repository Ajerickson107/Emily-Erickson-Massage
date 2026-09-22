import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Appointment, Service, Enhancement, BusinessSettings } from '../../types';
import { StorageService } from '../../services/storage';
import { ScheduleView } from './ScheduleView';
import { AppointmentsManager } from './AppointmentsManager';
import { ClientRecordsView } from './ClientRecordsView';
import { BusinessSettingsEditor } from './BusinessSettingsEditor';

interface AdminDashboardProps {
  appointments: Appointment[];
  services: Service[];
  enhancements: Enhancement[];
  settings: BusinessSettings;
  onReturnToClientView: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  appointments,
  services,
  enhancements,
  settings,
  onReturnToClientView,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'appointments' | 'clients' | 'settings'>('schedule');
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] = useState<Appointment | null>(null);

  const handleLogout = () => {
    StorageService.setAdminAuthenticated(false);
    onReturnToClientView();
  };

  // Compute key operational metrics
  const activeBookings = appointments.filter(a => a.status !== 'cancelled');
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const totalRevenue = activeBookings.reduce((sum, a) => sum + a.totalPrice, 0);

  const handleSelectAppointment = (appt: Appointment) => {
    setSelectedAppointmentForDetails(appt);
    setActiveTab('clients');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 pb-16">
      {/* Top Admin Sub-bar with green & pink ombre accent line */}
      <div className="bg-stone-900 text-stone-100 border-b border-stone-800 relative">
        <div className="h-1 bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-600 w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  Studio Operations & Schedule
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded font-mono">
                  Rio Rancho, NM
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Cloud Sync Live
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Emily Erickson, LMT — Studio Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshData}
              title="Refresh Data"
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={onReturnToClientView}
              className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Client View</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/60 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-stone-500 block">
                Active Bookings
              </span>
              <span className="text-2xl font-bold text-stone-900">
                {activeBookings.length}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium block">
                {confirmedCount} confirmed
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-stone-500 block">
                Pending Approval
              </span>
              <span className="text-2xl font-bold text-amber-700">
                {pendingCount}
              </span>
              <span className="text-[11px] text-stone-500 block">
                Awaiting confirmation
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-stone-500 block">
                Total Revenue
              </span>
              <span className="text-2xl font-bold text-stone-900">
                ${totalRevenue}
              </span>
              <span className="text-[11px] text-stone-500 block">
                Via Square & Terminal
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center flex-shrink-0">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-stone-500 block">
                Sanitization Buffer
              </span>
              <span className="text-2xl font-bold text-stone-900">
                {settings.bufferMinutes}m
              </span>
              <span className="text-[11px] text-emerald-800 font-medium block">
                Zero client overlap
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 space-x-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'appointments'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Appointment Management</span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'clients'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Client Records & Digital Intakes</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Content & Pricing Settings</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'schedule' && (
          <ScheduleView
            appointments={appointments}
            settings={settings}
            onSelectAppointment={handleSelectAppointment}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsManager
            appointments={appointments}
            settings={settings}
            onSelectAppointment={handleSelectAppointment}
            onRefresh={onRefreshData}
          />
        )}

        {activeTab === 'clients' && (
          <ClientRecordsView
            appointments={appointments}
            selectedAppointment={selectedAppointmentForDetails}
            onSelectAppointment={setSelectedAppointmentForDetails}
            onRefresh={onRefreshData}
          />
        )}

        {activeTab === 'settings' && (
          <BusinessSettingsEditor
            services={services}
            enhancements={enhancements}
            settings={settings}
            onRefresh={onRefreshData}
          />
        )}
      </div>
    </div>
  );
};
