import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutEmily } from './components/AboutEmily';
import { ServicesMenu } from './components/ServicesMenu';
import { SquareBookingSection } from './components/SquareBookingSection';
import { SquareBookingModal } from './components/SquareBookingModal';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LocationPolicies } from './components/LocationPolicies';
import { Footer } from './components/Footer';
import { StorageService } from './services/storage';
import {
  Service,
  Enhancement,
  Testimonial,
  BusinessSettings,
  DurationOption
} from './types';

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(StorageService.getSettings());

  // Square Booking Modal state (for direct modal popup booking)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    setServices(StorageService.getServices());
    setEnhancements(StorageService.getEnhancements());
    setTestimonials(StorageService.getTestimonials());
    setSettings(StorageService.getSettings());
  }, []);

  const handleNavigate = (sectionId?: string) => {
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

  const handleOpenBooking = (_serviceId?: string, _duration: DurationOption = 60) => {
    // Navigate smoothly to the embedded Square Booking Section, or open the modal
    const bookElem = document.getElementById('book');
    if (bookElem) {
      bookElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Single-Page Client View */}
      <main className="flex-1">
        <Hero
          settings={settings}
          onBookNow={() => handleOpenBooking()}
          onExploreServices={() => handleNavigate('services')}
        />

        <AboutEmily
          settings={settings}
          onBookNow={() => handleOpenBooking()}
        />

        <ServicesMenu
          services={services}
          enhancements={enhancements}
          onSelectServiceForBooking={(_sId, _dur) => handleOpenBooking()}
        />

        {/* Embedded Square Appointments Booking Portal */}
        <SquareBookingSection settings={settings} />

        <TestimonialsSection
          testimonials={testimonials}
          onBookNow={() => handleOpenBooking()}
        />

        <LocationPolicies
          settings={settings}
          onBookNow={() => handleOpenBooking()}
        />
      </main>

      {/* Square Booking Modal for instant overlay access */}
      {isBookingModalOpen && (
        <SquareBookingModal
          isOpen={isBookingModalOpen}
          settings={settings}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
