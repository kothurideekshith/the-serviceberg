import React from 'react';
import { Hero } from '../Hero';
import { ServiceCard } from '../ServiceCard';
import { ProviderCard } from '../ProviderCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CategoryData, Provider, Service } from '../../types';

interface HomeViewProps {
  gridCategories: CategoryData[];
  masterCategories: CategoryData[];
  providerOffers: Provider[];
  popularServices: Service[];
  onNavigate: (view: 'home' | 'category' | 'provider' | 'jobs' | 'admin', categoryId?: string | null, providerId?: string | null) => void;
  onServiceClick: (service: Service) => void;
  popularRef: React.RefObject<HTMLDivElement | null>;
  offersScrollRef: React.RefObject<HTMLDivElement | null>;
  scrollOffers: (direction: 'left' | 'right') => void;
  categoriesRef: React.RefObject<HTMLDivElement | null>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  gridCategories,
  masterCategories,
  providerOffers,
  popularServices,
  onNavigate,
  onServiceClick,
  popularRef,
  offersScrollRef,
  scrollOffers,
  categoriesRef
}) => {
  return (
    <main className="mx-auto max-w-[1472px] px-6 pt-32 pb-12 md:px-12 lg:px-24">
      <div className="mb-20" ref={categoriesRef}>
        <div className="mb-10 px-2 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-ink">Categories</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
          {gridCategories.map((cat) => (
            <div key={cat.id} className="group flex flex-col gap-3 items-center">
              <div 
                className={`relative h-28 w-full rounded-2xl border border-smoke overflow-hidden transition-all bg-pearl ${cat.isActive !== false ? 'cursor-pointer hover:border-lemon hover:-translate-y-1' : 'opacity-60 cursor-not-allowed'}`}
                onClick={() => cat.isActive !== false && onNavigate('category', cat.id)}
              >
                <img src={cat.heroImage} className="h-full w-full object-cover opacity-80" alt={cat.name} referrerPolicy="no-referrer" />
                {cat.isActive === false && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Coming Soon</span>
                  </div>
                )}
              </div>
              <span className={`text-[13px] font-bold text-ink/60 text-center truncate w-full ${cat.isActive !== false ? 'group-hover:text-ink' : ''}`}>{cat.name}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {masterCategories.map((cat) => (
            <div key={cat.id} className="group flex flex-col gap-3 items-center">
              <div 
                onClick={() => cat.isActive !== false && onNavigate('category', cat.id)}
                className={`relative h-28 w-full rounded-2xl border border-smoke overflow-hidden transition-all bg-pearl shadow-sm ${cat.isActive !== false ? 'cursor-pointer hover:border-lemon hover:-translate-y-1' : 'opacity-60 cursor-not-allowed'}`}
              >
                <img 
                  src={cat.heroImage} 
                  className={`h-full w-full object-cover opacity-80 transition-transform duration-500 ${cat.isActive !== false ? 'group-hover:scale-105' : ''}`} 
                  alt={cat.name} 
                  referrerPolicy="no-referrer"
                />
                {cat.isActive === false && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Coming Soon</span>
                  </div>
                )}
              </div>
              <span className={`text-[13px] font-bold text-ink/60 text-center truncate w-full ${cat.isActive !== false ? 'group-hover:text-ink' : ''}`}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-24">
         <Hero onStartClick={() => popularRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      </div>

      <div className="mb-24 pt-12 border-t border-smoke">
        <div className="mb-8 flex justify-between px-2 items-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Today's offers</h2>
          <div className="flex items-center gap-6">
            <button className="text-sm font-bold text-ink/80 hover:text-ink">See all</button>
            <div className="flex gap-2">
              <button onClick={() => scrollOffers('left')} className="h-10 w-10 flex items-center justify-center rounded-full bg-smoke/50 text-ink hover:bg-smoke transition-all shadow-sm group" aria-label="Scroll left"><ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /></button>
              <button onClick={() => scrollOffers('right')} className="h-10 w-10 flex items-center justify-center rounded-full bg-smoke/50 text-ink hover:bg-smoke transition-all shadow-sm group" aria-label="Scroll right"><ArrowRight size={20} className="transition-transform group-hover:translate-x-1" /></button>
            </div>
          </div>
        </div>
        <div ref={offersScrollRef} className="flex gap-8 overflow-x-auto pb-8 no-scrollbar snap-x px-2">
          {providerOffers.map((provider) => {
            const offerService = provider.services.find(s => s.offer);
            const offerText = offerService?.offer || 'Limited Deal';
            return (
              <div key={provider.id} className="flex-shrink-0 w-84 sm:w-96 snap-start">
                <ProviderCard provider={provider} offer={offerText} onClick={(id) => onNavigate('provider', offerService?.category || null, id)} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-24 pt-12 border-t border-smoke" ref={popularRef}>
        <div className="mb-8 flex justify-between px-2">
          <h2 className="text-2xl font-bold">Popular near you</h2>
          <button className="text-sm font-bold text-ink/40 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {popularServices.map(service => (
            <ServiceCard key={service.id} service={service} onClick={() => onServiceClick(service)} />
          ))}
        </div>
      </div>
    </main>
  );
};
