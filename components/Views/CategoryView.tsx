import React from 'react';
import { ProviderCard } from '../ProviderCard';
import { ShieldCheck, Shield, Award, CheckCircle2 } from 'lucide-react';
import { CategoryData, Service } from '../../types';
import { SUB_SERVICE_ICONS } from '../../constants';

interface CategoryViewProps {
  category: CategoryData;
  location: string;
  onNavigate: (view: 'home' | 'category' | 'provider' | 'jobs' | 'admin', categoryId?: string | null, providerId?: string | null) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category, location, onNavigate }) => {
  return (
    <main className="mx-auto max-w-[1472px] px-6 pt-32 pb-24 md:px-12 lg:px-24">
      <div className="relative h-[45vh] w-full rounded-[3.5rem] overflow-hidden mb-12 border border-smoke shadow-xl">
        <img src={category.heroImage} className="absolute inset-0 h-full w-full object-cover" alt={category.name} referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent flex flex-col justify-end p-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white">{category.name}</h1>
        </div>
      </div>

      {(category.id === 'appliances' || category.id === 'gadgets' || category.id === 'advice') && (
        <div className="mb-20 px-2">
          <h2 className="text-2xl font-bold mb-10">Select specialized service</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {category.subCategories.map((sub) => (
              <div key={sub} className="flex flex-col items-center gap-4 group cursor-pointer" onClick={() => {
                const bestProvider = category.providers.find(p => p.services.some(s => s.subCategory === sub));
                if (bestProvider) onNavigate('provider', category.id, bestProvider.id);
              }}>
                <div className="h-24 w-24 sm:h-32 sm:w-32 bg-pearl rounded-3xl border border-smoke flex items-center justify-center p-6 group-hover:border-lemon group-hover:bg-lemon transition-all shadow-sm">
                  <img src={SUB_SERVICE_ICONS[sub] || SUB_SERVICE_ICONS['Computer']} className="h-full w-full object-contain drop-shadow-md" alt={sub} referrerPolicy="no-referrer" />
                </div>
                <span className="text-sm font-bold text-ink/60 group-hover:text-ink text-center leading-tight">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-16 bg-pearl/60 border border-smoke rounded-[2.5rem] p-8 md:p-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-ink/30 mb-4 font-bold text-[11px]">
            <ShieldCheck size={14} className="text-ink" /> Local artisan network
          </div>
          <h2 className="text-3xl font-bold text-ink mb-4 leading-tight">Verified {category.name} experts in {location.split(',')[0]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="flex gap-4 items-start"><div className="h-10 w-10 shrink-0 rounded-xl bg-lemon flex items-center justify-center text-ink"><Shield size={20} /></div><div><h4 className="text-sm font-bold text-ink mb-1">100% Responsible</h4><p className="text-[11px] text-ink/40 font-medium leading-normal">Full corporate responsibility.</p></div></div>
            <div className="flex gap-4 items-start"><div className="h-10 w-10 shrink-0 rounded-xl bg-lemon flex items-center justify-center text-ink"><Award size={20} /></div><div><h4 className="text-sm font-bold text-ink mb-1">Service guarantee</h4><p className="text-[11px] text-ink/40 font-medium leading-normal">Execution or refund.</p></div></div>
            <div className="flex gap-4 items-start"><div className="h-10 w-10 shrink-0 rounded-xl bg-lemon flex items-center justify-center text-ink"><CheckCircle2 size={20} /></div><div><h4 className="text-sm font-bold text-ink mb-1">Vetted professionals</h4><p className="text-[11px] text-ink/40 font-medium leading-normal">Top 3% network.</p></div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[...category.providers].sort((a, b) => {
          if (a.isActive === false && b.isActive !== false) return 1;
          if (a.isActive !== false && b.isActive === false) return -1;
          return 0;
        }).map(provider => (
          <ProviderCard key={provider.id} provider={provider} onClick={(id) => onNavigate('provider', category.id, id)} />
        ))}
      </div>
    </main>
  );
};
