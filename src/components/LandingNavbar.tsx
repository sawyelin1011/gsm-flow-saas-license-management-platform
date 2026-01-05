import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };
  const navLinks = [
    { label: 'What', id: 'what' },
    { label: 'Capabilities', id: 'capabilities' },
    { label: 'Who', id: 'who' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Comparison', id: 'comparison' },
  ];
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b py-3" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="font-black text-sm uppercase tracking-widest">GSM FLOW</span>
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest" asChild>
            <Link to="/login">Client Portal</Link>
          </Button>
          <Button className="btn-gradient rounded-full text-[10px] font-black uppercase tracking-widest px-6" onClick={() => scrollTo('pricing')}>
            Get Started
          </Button>
        </div>
        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b p-4 space-y-4 animate-fade-in shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left p-2 text-xs font-black uppercase tracking-widest text-muted-foreground"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t space-y-2">
            <Button variant="outline" className="w-full text-[10px] font-black uppercase" asChild>
              <Link to="/login">Client Portal</Link>
            </Button>
            <Button className="w-full btn-gradient text-[10px] font-black uppercase" onClick={() => scrollTo('pricing')}>
              Start License
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}