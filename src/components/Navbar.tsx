import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {Menu, X, Calendar, ChevronRight } from 'lucide-react';
import { SUCCESS_STORIES } from '../data/clinicData';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Document order, not menu order -- the loop breaks on the first
      // section containing the scroll position, so this has to track the page.
      const sections = ['home', 'services', 'conditions', 'journey', 'success', 'about', 'gallery', 'faqs', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // "Stories" is conditional: the section it targets hides itself when there
  // are no real success stories, and a nav item that scrolls to nothing is a
  // dead control in both the desktop bar and the mobile drawer below. It comes
  // back on its own as soon as SUCCESS_STORIES has an entry.
  const navLinks = [
    { label: 'Home', href: '/#home', id: 'home' },
    { label: 'Services', href: '/#services', id: 'services' },
    { label: 'Conditions', href: '/#conditions', id: 'conditions' },
    ...(SUCCESS_STORIES.length > 0
      ? [{ label: 'Stories', href: '/#success', id: 'success' }]
      : []),
    { label: 'About', href: '/#about', id: 'about' },
    { label: 'Gallery', href: '/#gallery', id: 'gallery' },
    { label: 'FAQs', href: '/#faqs', id: 'faqs' },
    { label: 'Contact', href: '/#contact', id: 'contact' },
  ];

  // The nav is `position: fixed`, so it takes no space in flow and the hero has
  // to leave room for it. That gap used to be a hardcoded `pt-24`, which was
  // right for the 85px mobile bar and wrong for the 113px desktop one — the
  // hero's own `lg:py-0` then removed it entirely and the "Certified
  // Veterinary Rehabilitation Center" badge sat 18px underneath the nav.
  //
  // Publishing the real measured height means the two cannot drift: the bar
  // also shrinks on scroll, and any future change to its padding or logo size
  // is picked up automatically rather than needing a matching edit elsewhere.
  const navRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const publish = () =>
      document.documentElement.style.setProperty('--nav-h', `${el.offsetHeight}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <nav ref={navRef} className={`bg-[#fef9f2]/95 backdrop-blur-md text-[#3C2117] font-['Inter'] fixed top-0 w-full z-50 transition-all duration-300 border-b ${
      scrolled ? 'border-[#d4c3bd]/40 shadow-xs py-2' : 'border-[#d4c3bd]/20 py-3.5 sm:py-4'
    }`}>
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto h-14 sm:h-16 lg:h-20 gap-2 sm:gap-4">
        {/* Brand Logo */}
        <a 
          href="/#home" 
          className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl lg:text-2xl font-light text-[#3C2117] flex items-center gap-2 tracking-tight group shrink-0 whitespace-nowrap"
        >
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 group-hover:scale-105 transition-transform"
          />
          <span className="font-medium whitespace-nowrap tracking-tight">The Pet Physio Vet</span>
        </a>

        {/* Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-6 2xl:gap-7 shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`uppercase tracking-widest text-[11px] xl:text-xs font-medium transition-all hover:opacity-100 relative py-1 whitespace-nowrap ${
                activeSection === link.id ? 'text-[#3C2117] font-semibold' : 'text-[#504440] opacity-80 hover:text-[#3C2117]'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#3C2117]" />
              )}
            </a>
          ))}
        </div>

        {/* Trailing Actions */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
          
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-1.5 xl:gap-2 bg-[#3C2117] text-[#ffffff] px-4 xl:px-6 py-2 xl:py-2.5 rounded-none hover:bg-[#504440] transition-colors duration-300 uppercase tracking-widest text-[11px] xl:text-xs font-medium cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        </div>

        {/* Mobile / Tablet Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            onClick={onOpenBooking}
            className="bg-[#3C2117] text-[#ffffff] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider rounded-none cursor-pointer"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#3C2117] hover:bg-[#f2ede7] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fef9f2] border-b border-[#d4c3bd]/40 px-6 py-6 shadow-xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs uppercase tracking-widest font-medium py-2.5 border-b border-[#d4c3bd]/20 flex justify-between items-center ${
                  activeSection === link.id ? 'text-[#3C2117] font-semibold' : 'text-[#504440]'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[#84523e]" />
              </a>
            ))}

            <div className="pt-3 flex flex-col gap-2.5">

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 bg-[#3C2117] text-white uppercase tracking-widest text-xs font-medium cursor-pointer"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

