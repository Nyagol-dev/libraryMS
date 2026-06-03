import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, Search } from 'lucide-react';

const LandingPage = () => {
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const CountUp = ({ target, suffix = '' }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!statsVisible) return;
      const duration = 800;
      const steps = 30;
      const stepDuration = duration / steps;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(target * eased));
        if (step >= steps) {
          setCount(target);
          clearInterval(interval);
        }
      }, stepDuration);
      return () => clearInterval(interval);
    }, [statsVisible, target]);
    return <>{count.toLocaleString()}{suffix}</>;
  };

  return (
    <div className="min-h-screen bg-ak-ebony">
      {/* Header / Navigation */}
      <header className="border-b border-ak-mahogany-light sticky top-0 z-50 bg-ak-ebony/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-ak-gold rounded-md flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-ak-ebony" />
            </div>
            <span className="font-display text-[17px] font-semibold text-ak-parchment">Akosombo</span>
            <span className="font-body text-[11px] text-ak-gold-dim ml-0.5">Library</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/catalog" className="font-body text-[13px] text-ak-ash hover:text-ak-parchment transition-colors">
              Browse Catalog
            </Link>
            <Link to="/login" className="bg-ak-gold px-4 py-1.5 rounded-md font-body text-[13px] font-semibold text-ak-ebony hover:scale-[1.02] transition-transform">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-7xl mx-auto">
        {/* Badge */}
        <div className="animate-fade-in opacity-0" style={{ animationDelay: '100ms' }}>
          <div className="inline-block bg-ak-mahogany-light border border-ak-gold px-3 py-1 rounded mb-5">
            <span className="font-body text-[10px] tracking-wider uppercase text-ak-gold">
              National Library System · Kenya
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in opacity-0" style={{ animationDelay: '200ms' }}>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[50px] font-semibold text-ak-parchment leading-[1.05] mb-1.5">
            Where Africa's<br />Stories Live
          </h1>
        </div>
        <div className="animate-fade-in opacity-0" style={{ animationDelay: '400ms' }}>
          <p className="font-display text-xl sm:text-[22px] italic font-light text-ak-gold mb-5">
            & Knowledge Flourishes
          </p>
        </div>

        {/* Description */}
        <div className="animate-fade-in opacity-0" style={{ animationDelay: '500ms' }}>
          <p className="font-body text-sm text-ak-ash leading-relaxed max-w-md mb-7">
            Access thousands of books across every discipline. Physical copies to borrow, 
            digital editions to download — all in one place, available to every Kenyan.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 flex-wrap mb-9 animate-fade-in opacity-0" style={{ animationDelay: '600ms' }}>
          <Link to="/catalog" className="bg-ak-gold px-6 py-3 rounded-ak font-body text-[13px] font-semibold text-ak-ebony hover:scale-[1.02] transition-transform">
            Browse Catalog
          </Link>
          <Link to="/register" className="border border-ak-mahogany px-6 py-3 rounded-ak font-body text-[13px] text-ak-ash hover:border-ak-gold hover:text-ak-parchment transition-colors">
            Create Account
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-7 pt-6 border-t border-ak-mahogany-light flex-wrap animate-fade-in opacity-0" style={{ animationDelay: '700ms' }}>
          {[
            { value: 12840, label: 'Volumes' },
            { value: 2300, label: 'Ebooks', suffix: '+' },
            { value: 47, label: 'Branches' },
            { value: 180, label: 'Members', suffix: 'K' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-semibold text-ak-parchment">
                <CountUp target={stat.value} suffix={stat.suffix || ''} />
              </p>
              <p className="font-body text-[11px] text-ak-gold-dim uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-ak-mahogany-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-ak-mahogany-dark border border-ak-mahogany-light rounded-xl p-8 text-center hover:border-ak-gold transition-colors group">
              <div className="w-16 h-16 bg-ak-mahogany-light text-ak-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-ak-gold group-hover:text-ak-ebony transition-colors">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ak-parchment mb-3">Browse our catalog</h3>
              <p className="font-body text-sm text-ak-ash leading-relaxed">
                Explore our extensive collection of materials across various disciplines and genres.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-ak-mahogany-dark border border-ak-mahogany-light rounded-xl p-8 text-center hover:border-ak-gold transition-colors group">
              <div className="w-16 h-16 bg-ak-mahogany-light text-ak-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-ak-gold group-hover:text-ak-ebony transition-colors">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ak-parchment mb-3">Borrow physical books</h3>
              <p className="font-body text-sm text-ak-ash leading-relaxed">
                Reserve and borrow physical copies from our library locations with easy pickup.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-ak-mahogany-dark border border-ak-mahogany-light rounded-xl p-8 text-center hover:border-ak-gold transition-colors group">
              <div className="w-16 h-16 bg-ak-mahogany-light text-ak-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-ak-gold group-hover:text-ak-ebony transition-colors">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ak-parchment mb-3">Download ebooks</h3>
              <p className="font-body text-sm text-ak-ash leading-relaxed">
                Instantly access and download electronic materials directly to your devices.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-ak-mahogany-light bg-ak-ebony-deep py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 bg-ak-gold rounded flex items-center justify-center">
            <BookOpen className="h-3 w-3 text-ak-ebony" />
          </div>
          <span className="font-display text-sm font-semibold text-ak-parchment">Akosombo Library</span>
        </div>
        <p className="font-body text-xs text-ak-gold-dim">
          Where Africa's Stories Live · © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
