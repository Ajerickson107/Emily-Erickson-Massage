import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutEmily } from './components/AboutEmily';
import { ServicesMenu } from './components/ServicesMenu';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LocationPolicies } from './components/LocationPolicies';
import { Footer } from './components/Footer';
import { BookingFlow } from './components/BookingFlow';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { StorageService } from './services/storage';
import {
  Service,
  Enhancement,
  Testimonial,
  BusinessSettings,
  Appointment,
  DurationOption
} from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'client' | 'admin'>('client');
  const [services, setServices] = useState<Service[]>([]);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(StorageService.getSettings());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Booking Flow modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreselect, setBookingPreselect] = useState<{
    serviceId?: string;
    duration?: DurationOption;
  }>({});

  // Admin login modal state
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Reload data from LocalStorage
  const refreshAllData = () => {
    setServices(StorageService.getServices());
    setEnhancements(StorageService.getEnhancements());
    setTestimonials(StorageService.getTestimonials());
    setSettings(StorageService.getSettings());
    setAppointments(StorageService.getAppointments());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleNavigate = (view: 'client' | 'admin', sectionId?: string) => {
    if (view === 'admin') {
      if (StorageService.isAdminAuthenticated()) {
        setActiveView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsAdminLoginOpen(true);
      }
      return;
    }

    setActiveView('client');
    if (sectionId) {
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        } else if (sectionId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handleOpenBooking = (serviceId?: string, duration: DurationOption = 60) => {
    setBookingPreselect({ serviceId, duration });
    setIsBookingOpen(true);
  };

  const handleAppointmentBooked = (newAppt: Appointment) => {
    refreshAllData();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'client' ? (
          <>
            <Hero
              settings={settings}
              onBookNow={() => handleOpenBooking()}
              onExploreServices={() => handleNavigate('client', 'services')}
            />

            <AboutEmily
              settings={settings}
              onBookNow={() => handleOpenBooking()}
            />

            <ServicesMenu
              services={services}
              enhancements={enhancements}
              onSelectServiceForBooking={(sId, dur) => handleOpenBooking(sId, dur)}
            />

            <TestimonialsSection
              testimonials={testimonials}
              onBookNow={() => handleOpenBooking()}
            />

            <LocationPolicies
              settings={settings}
              onBookNow={() => handleOpenBooking()}
            />
          </>
        ) : (
          <AdminDashboard
            appointments={appointments}
            services={services}
            enhancements={enhancements}
            settings={settings}
            onReturnToClientView={() => setActiveView('client')}
            onRefreshData={refreshAllData}
          />
        )}
      </main>

      {/* Booking Flow Modal */}
      {isBookingOpen && (
        <BookingFlow
          services={services}
          enhancements={enhancements}
          settings={settings}
          preSelectedServiceId={bookingPreselect.serviceId}
          preSelectedDuration={bookingPreselect.duration}
          onClose={() => setIsBookingOpen(false)}
          onAppointmentBooked={handleAppointmentBooked}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginOpen(false);
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
