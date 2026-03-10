
import React, { useState } from 'react';
import { Service } from '../types';
import { Heart, Star, ShieldCheck } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      onClick={() => onClick(service)}
      className="group relative cursor-pointer transition-all active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-pearl border border-smoke transition-all group-hover:border-lemon">
        <img src={service.image} alt={service.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur hover:scale-110 active:scale-90 transition-all"
        >
          <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : "text-ink/40"} />
        </button>
        {service.offer && (
          <div className="absolute left-0 bottom-6 bg-ink px-4 py-1.5 text-[9px] font-bold text-white shadow-xl">
            {service.offer}
          </div>
        )}
      </div>
      
      <div className="mt-4 px-1">
        <div className="flex items-center justify-between mb-1">
           <h3 className="text-lg font-bold tracking-tight truncate">{service.name}</h3>
           <span className="text-base font-bold">{service.price}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-ink/30">
          <span className="flex items-center gap-1 text-ink px-2 py-0.5 bg-lemon rounded">
            {service.rating ? service.rating.toFixed(1) : '4.5'} <Star size={10} className="fill-ink" />
          </span>
          <span className="flex items-center gap-1 opacity-60"><ShieldCheck size={10} /> Verified</span>
          <span className="h-1 w-1 rounded-full bg-smoke" />
          <span>{service.time || '60 min'}</span>
        </div>
      </div>
    </div>
  );
};
