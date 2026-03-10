
import React from 'react';
import { X, Star, Clock, ShieldCheck, Plus } from 'lucide-react';
import { Service } from '../types';

interface ServiceDetailProps {
  service: Service | null;
  onClose: () => void;
  onAddToBasket: (service: Service) => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose, onAddToBasket }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div 
        className="absolute inset-0 bg-ink/80 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-500 flex flex-col md:flex-row max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-ink transition-all"
        >
          <X size={24} />
        </button>

        <div className="w-full md:w-1/2 h-64 md:h-auto bg-white relative overflow-hidden">
          <img 
            src={service.image} 
            className="h-full w-full object-contain p-12" 
            alt={service.name} 
          />
          <div className="absolute bottom-8 left-8 right-8 flex gap-3">
             <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                <Star size={14} className="fill-lemon text-lemon" />
                <span className="text-xs font-bold">{service.rating?.toFixed(1)}</span>
             </div>
             <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                <Clock size={14} className="text-ink/40" />
                <span className="text-xs font-bold">{service.time}</span>
             </div>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="flex items-center gap-2 text-ink/30 mb-4 font-bold text-[11px]">
            <ShieldCheck size={14} className="text-ink" /> Premium Service
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight tracking-tight">
            {service.name}
          </h2>

          <div className="flex items-center gap-4 mb-8">
             <span className="text-3xl font-bold text-[#32C5D2]">{service.price}/-</span>
             {service.offer && (
               <span className="bg-lemon px-3 py-1 rounded-lg text-[10px] font-bold">{service.offer}</span>
             )}
          </div>

          <div className="space-y-6 mb-12">
            <div>
              <h4 className="text-xs font-bold text-ink/20 mb-3">Description</h4>
              <p className="text-sm md:text-base text-ink/60 leading-relaxed font-medium">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-pearl border border-smoke">
                  <h5 className="text-[10px] font-bold text-ink/20 mb-1">Reviews</h5>
                  <p className="text-sm font-bold">{service.reviews} Verified</p>
               </div>
               <div className="p-4 rounded-2xl bg-pearl border border-smoke">
                  <h5 className="text-[10px] font-bold text-ink/20 mb-1">Guarantee</h5>
                  <p className="text-sm font-bold">100% Responsible</p>
               </div>
            </div>
          </div>

          <button 
            onClick={() => {
              onAddToBasket(service);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-ink py-6 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-ink/20"
          >
            Add to basket <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
