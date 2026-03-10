import React, { useState, useRef } from 'react';
import { Star, ShieldCheck, Phone, Navigation, MessageCircle, CreditCard, Instagram, Twitter, Facebook, Globe, Search, Menu, X, Plus } from 'lucide-react';
import { Provider, Service } from '../../types';

interface ProviderViewProps {
  provider: Provider;
  basket: Service[];
  onAddToBasket: (service: Service) => void;
  onRemoveFromBasket: (serviceId: string) => void;
  onServiceClick: (service: Service) => void;
}

export const ProviderView: React.FC<ProviderViewProps> = ({
  provider,
  basket,
  onAddToBasket,
  onRemoveFromBasket,
  onServiceClick
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeMenuCategory, setActiveMenuCategory] = useState<string | null>(provider.services[0]?.subCategory || null);
  const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const menuCategories = Array.from(new Set(provider.services.map(s => s.subCategory).filter(Boolean))) as string[];
  if (menuCategories.length === 0) menuCategories.push('Services');

  const scrollToSection = (category: string) => {
    setActiveMenuCategory(category);
    const element = sectionRefs.current[category];
    if (element) {
      const navHeight = 160; 
      const top = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <main className="mx-auto max-w-[1472px] px-6 pt-32 pb-24 md:px-12 lg:px-24">
      <div className="mb-12 px-2">
        <div className="relative h-64 md:h-96 w-full rounded-[2.5rem] overflow-hidden border border-smoke bg-pearl mb-10">
          <img src={provider.coverImage || provider.image} className="h-full w-full object-cover" alt="banner" referrerPolicy="no-referrer" />
        </div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">{provider.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1 font-bold text-sm">{provider.rating.toFixed(1)} <Star size={14} className="fill-ink" /><span className="text-ink/40 ml-1">({provider.reviews})</span></div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100"><ShieldCheck size={12} /> Verified</div>
            </div>
            <div className="relative">
              <p className={`text-[13px] font-normal text-ink/60 leading-relaxed mb-8 ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                {provider.description}
              </p>
              {!isDescriptionExpanded && provider.description.length > 120 && (
                <button 
                  onClick={() => setIsDescriptionExpanded(true)}
                  className="text-blue-600 font-bold text-[13px] hover:underline -mt-6 mb-8 block"
                >
                  ...more
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-8 shrink-0">
            <a 
              href={provider.phone ? `tel:${provider.phone.replace(/[^\d+]/g, '')}` : '#'}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="h-14 w-14 rounded-3xl bg-ink text-white flex items-center justify-center shadow-lg shadow-ink/10 group-hover:scale-110 transition-all active:scale-95">
                <Phone size={20} />
              </div>
              <span className="text-[10px] font-bold text-ink/40 group-hover:text-ink">Call</span>
            </a>
            <a 
              href={provider.lat && provider.lng ? `https://www.google.com/maps/search/?api=1&query=${provider.lat},${provider.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="h-14 w-14 rounded-3xl bg-[#F0F8FF] border border-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-all active:scale-95 shadow-sm">
                <Navigation size={20} />
              </div>
              <span className="text-[10px] font-bold text-ink/40 group-hover:text-ink">Directions</span>
            </a>
            <a 
              href={provider.whatsapp ? `https://wa.me/${provider.whatsapp.replace(/\D/g, '')}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={(e) => {
                if (!provider.whatsapp) {
                  e.preventDefault();
                  alert("WhatsApp number not provided.");
                }
              }}
            >
              <div className="h-14 w-14 rounded-3xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-all active:scale-95">
                <MessageCircle size={20} />
              </div>
              <span className="text-[10px] font-bold text-ink/40 group-hover:text-ink">WhatsApp</span>
            </a>
            <a 
              href={provider.paymentUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="h-14 w-14 rounded-3xl bg-lemon text-ink flex items-center justify-center shadow-lg shadow-lemon/20 group-hover:scale-110 transition-all active:scale-95">
                <CreditCard size={20} />
              </div>
              <span className="text-[10px] font-bold text-ink/40 group-hover:text-ink">Pay Now</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-10 mt-10 border-t border-smoke">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <a href={provider.instagram || '#'} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-smoke flex items-center justify-center text-ink/40 hover:text-ink hover:border-ink transition-all"><Instagram size={18} /></a>
              <a href={provider.twitter || '#'} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-smoke flex items-center justify-center text-ink/40 hover:text-ink hover:border-ink transition-all"><Twitter size={18} /></a>
              <a href={provider.facebook || '#'} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-smoke flex items-center justify-center text-ink/40 hover:text-ink hover:border-ink transition-all"><Facebook size={18} /></a>
            </div>
            <div className="h-8 w-[1px] bg-smoke"></div>
            <a href={provider.website || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all">
              <Globe size={18} /> visit website
            </a>
          </div>

          <div className="flex items-center gap-3 bg-pearl border border-smoke rounded-2xl px-5 py-3 flex-1 max-w-md focus-within:border-lemon transition-all">
            <Search size={18} className="text-ink/30" />
            <input 
              type="text" 
              placeholder="search for services" 
              className="bg-transparent border-none outline-none text-sm font-bold text-ink w-full"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-24 z-30 mb-12 flex items-center gap-4 px-2 py-4 bg-white/80 backdrop-blur-md overflow-x-auto no-scrollbar border-b border-transparent">
        <button 
          onClick={() => setIsCategoryListOpen(!isCategoryListOpen)}
          className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-pearl border border-smoke text-ink hover:bg-lemon transition-all"
        >
          <Menu size={20} />
        </button>
        {menuCategories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => scrollToSection(cat)} 
            className={`px-6 py-2.5 rounded-2xl text-[12px] font-bold whitespace-nowrap transition-all border ${activeMenuCategory === cat ? 'bg-ink text-white border-ink' : 'bg-white text-ink/40 border-smoke hover:border-ink hover:text-ink'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-20 pb-20">
        {menuCategories.map((sectionTitle) => {
          const sectionServices = provider.services.filter(s => s.subCategory === sectionTitle || (!s.subCategory && sectionTitle === menuCategories[0]));
          return (
            <div 
              key={sectionTitle} 
              ref={(el) => { sectionRefs.current[sectionTitle] = el; }} 
              className="px-2 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-32"
            >
              <h2 className="text-2xl font-bold mb-8">{sectionTitle}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sectionServices.map((service, idx) => (
                  <div 
                    key={`${sectionTitle}-${service.id}-${idx}`} 
                    onClick={() => onServiceClick(service)} 
                    className="group bg-white border border-smoke rounded-xl p-4 flex gap-4 hover:border-ink/10 transition-all cursor-pointer relative overflow-hidden items-start"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg overflow-hidden shrink-0 p-2">
                      <img src={service.image} className="h-full w-full object-contain" alt={service.name} referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col py-1">
                      <h3 className="text-lg md:text-xl font-medium text-ink tracking-tight mb-0 leading-tight">{service.name}</h3>
                      <p className="text-[12px] md:text-[13px] text-ink/60 leading-snug mt-2 line-clamp-3">{service.description}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 w-24 md:w-32 py-1 self-stretch justify-between">
                      <div className="text-right">
                        <span className="text-xl md:text-2xl font-medium text-[#32C5D2] leading-none">{service.price.replace('₹', '')}/-</span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto self-end">
                        {basket.some(s => s.id === service.id) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveFromBasket(service.id);
                            }}
                            className="h-8 w-8 md:h-10 md:w-10 rounded-xl border border-smoke bg-white text-ink hover:bg-red-50 hover:text-red-500 hover:border-red-100 flex items-center justify-center transition-all"
                          >
                            <X size={18} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToBasket(service);
                          }}
                          className={`h-8 w-8 md:h-10 md:w-10 rounded-xl border border-smoke flex items-center justify-center transition-all ${basket.some(s => s.id === service.id) ? 'bg-lemon text-ink border-lemon' : 'bg-white text-ink hover:bg-ink hover:text-white'}`}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
