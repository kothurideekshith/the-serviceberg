
import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, CreditCard, ChevronRight, CheckCircle2, User, Phone, Mail, MapPin, Plus, Search } from 'lucide-react';
import { Service } from '../types';

interface BookingDrawerProps {
  isOpen: boolean;
  service: Service | null;
  basket: Service[];
  location: string;
  coords: { lat: number; lng: number } | null;
  onLocationChange: (loc: string) => void;
  onRemoveFromBasket: (serviceId: string) => void;
  onClose: () => void;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({ isOpen, service, basket, location, coords, onLocationChange, onRemoveFromBasket, onClose }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: ''
  });
  const [addressDetails, setAddressDetails] = useState({
    houseNumber: '',
    area: '',
    landmark: '',
    details: '',
    saveAs: 'home' // 'home', 'work', 'others'
  });

  const checkoutItems = basket.length > 0 ? basket : (service ? [service] : []);
  const isDhobi = checkoutItems.some(item => item.category === 'dhobi');
  const totalSteps = isDhobi ? 3 : 4;
  const totalPrice = checkoutItems.reduce((sum, item) => sum + parseInt(item.price.replace('₹', '')), 0);
  const finalTotal = totalPrice + 4.50;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep(1), 300);
    }
  }, [isOpen]);

  if (checkoutItems.length === 0) return null;

  const handleBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(5); // Success step
    }, 2000);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-[60] bg-ink/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <aside 
        className={`fixed bottom-0 right-0 top-0 z-[70] w-full max-w-md bg-[#F7F7F7] p-10 transition-transform duration-500 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-pearl text-ink/40 transition-all hover:bg-ink hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex h-full flex-col">
          <div className="mb-12 pb-6 border-b border-smoke">
            <span className="text-sm font-bold text-ink/20">Step {step} of {totalSteps}</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {step === 1 ? 'Review Basket' : step === 2 ? 'Select Schedule' : step === 3 ? 'Contact & Location' : step === 4 ? 'Confirm Payment' : 'Dispatch confirmed.'}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  {checkoutItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-pearl border border-smoke group relative">
                      <div className="h-16 w-16 bg-white rounded-xl p-2 shrink-0">
                        <img src={item.image} className="h-full w-full object-contain" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-ink leading-tight">{item.name}</h4>
                        <p className="text-[10px] font-bold text-[#32C5D2] mt-1">{item.price}</p>
                      </div>
                      <button 
                        onClick={() => onRemoveFromBasket(item.id)}
                        className="h-8 w-8 rounded-lg bg-white border border-smoke text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-8 rounded-3xl bg-pearl border border-smoke">
                  <button 
                    onClick={onClose}
                    className="w-full mb-6 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-smoke text-xs font-bold text-ink/60 hover:bg-[#F7F7F7] hover:text-ink transition-all"
                  >
                    <Plus size={14} /> Add more services
                  </button>
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-sm font-bold text-ink/40">Subtotal</span>
                    <span className="text-xl font-bold">₹{totalPrice}</span>
                  </div>
                  <button 
                    onClick={() => setStep(2)}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-ink py-6 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-ink/10"
                  >
                    Proceed to schedule <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="rounded-3xl bg-pearl p-8 border border-smoke">
                  <h4 className="mb-6 flex items-center gap-3 text-xs font-bold text-ink/40">
                    <Calendar size={14} className="text-ink" /> Date selection
                  </h4>
                  <div className="grid grid-cols-4 gap-3">
                    {[12, 13, 14, 15].map(day => (
                      <button key={day} className="flex flex-col items-center rounded-2xl bg-white border border-smoke p-4 hover:border-lemon hover:bg-lemon transition-all group">
                        <span className="text-[10px] font-bold opacity-30 group-hover:opacity-100">May</span>
                        <span className="text-lg font-bold">{day}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-pearl p-8 border border-smoke">
                  <h4 className="mb-6 flex items-center gap-3 text-xs font-bold text-ink/40">
                    <Clock size={14} className="text-ink" /> Arrival window
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['Morning', 'Midday', 'Afternoon', 'Late Shift'].map(time => (
                      <button key={time} className="rounded-2xl bg-white border border-smoke p-4 text-xs font-bold hover:border-lemon hover:bg-lemon transition-all">
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setStep(3)}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-ink py-6 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-ink/10"
                >
                  Confirm window <ChevronRight size={16} />
                </button>
                <button onClick={() => setStep(1)} className="w-full py-2 text-xs font-bold text-ink/40 hover:text-ink transition-all">Back to basket</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="rounded-3xl bg-pearl p-8 border border-smoke">
                  <h4 className="mb-6 flex items-center gap-3 text-xs font-bold text-ink/40">
                    <User size={14} className="text-ink" /> Contact Details
                  </h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
                      <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full rounded-2xl border border-smoke bg-white py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-lemon transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-2xl border border-smoke bg-white py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-lemon transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-pearl p-8 border border-smoke">
                  <h4 className="mb-6 flex items-center gap-3 text-xs font-bold text-ink/40">
                    <MapPin size={14} className="text-ink" /> Service Location
                  </h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
                      <div className="flex items-center w-full rounded-2xl border border-smoke bg-white py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-lemon transition-all group">
                        <input 
                          type="text" 
                          placeholder="Search for your location / place" 
                          className="flex-1 bg-transparent outline-none"
                        />
                        <span className="animate-blink text-ink/40 font-light ml-0.5">|</span>
                      </div>
                    </div>

                    <button className="flex items-center gap-2 text-xs font-bold text-ink hover:text-ink/60 transition-all">
                      <div className="h-6 w-6 rounded-full bg-ink/5 flex items-center justify-center">
                        <MapPin size={12} />
                      </div>
                      Use current location
                    </button>

                    {coords && (
                      <div className="p-4 rounded-xl bg-white border border-smoke flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-ink/20">Detected Coordinates</p>
                          <p className="text-[11px] font-bold text-ink/60">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 pt-4 border-t border-smoke/50">
                      <input 
                        type="text" 
                        placeholder="House or Flat Number" 
                        value={addressDetails.houseNumber}
                        onChange={(e) => setAddressDetails(prev => ({ ...prev, houseNumber: e.target.value }))}
                        className="w-full rounded-2xl border border-smoke bg-white py-4 px-4 text-sm font-bold outline-none focus:border-lemon transition-all"
                      />
                      <input 
                        type="text" 
                        placeholder="House name or Flat name / Road / Area" 
                        value={addressDetails.area}
                        onChange={(e) => setAddressDetails(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full rounded-2xl border border-smoke bg-white py-4 px-4 text-sm font-bold outline-none focus:border-lemon transition-all"
                      />
                      <input 
                        type="text" 
                        placeholder="Landmark" 
                        value={addressDetails.landmark}
                        onChange={(e) => setAddressDetails(prev => ({ ...prev, landmark: e.target.value }))}
                        className="w-full rounded-2xl border border-smoke bg-white py-4 px-4 text-sm font-bold outline-none focus:border-lemon transition-all"
                      />
                      <textarea 
                        placeholder="Location details box to enter text" 
                        value={addressDetails.details}
                        onChange={(e) => setAddressDetails(prev => ({ ...prev, details: e.target.value }))}
                        className="w-full rounded-2xl border border-smoke bg-white p-4 text-sm font-bold outline-none focus:border-lemon transition-all resize-none h-24"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-[10px] font-bold text-ink/40 mr-2">Save as:</span>
                      {['home', 'work', 'others'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setAddressDetails(prev => ({ ...prev, saveAs: type }))}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                            addressDetails.saveAs === type 
                              ? 'bg-ink text-white' 
                              : 'bg-pearl text-ink/40 hover:bg-smoke'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => isDhobi ? handleBooking() : setStep(4)}
                  disabled={!contactInfo.phone || !contactInfo.email || !addressDetails.houseNumber || !addressDetails.area}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-ink py-6 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-ink/10 disabled:opacity-50"
                >
                  {isDhobi ? 'Initialize booking' : 'Continue to payment'} <ChevronRight size={16} />
                </button>
                <button onClick={() => setStep(2)} className="w-full py-2 text-xs font-bold text-ink/40 hover:text-ink transition-all">Back to schedule</button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="rounded-3xl bg-pearl p-8 border border-smoke">
                  <h4 className="mb-6 flex items-center gap-3 text-xs font-bold text-ink/40">
                    <CreditCard size={14} className="text-ink" /> Vault payment
                  </h4>
                  <div className="flex items-center gap-4 rounded-2xl bg-white p-5 border border-lemon shadow-sm">
                    <div className="h-10 w-14 rounded-lg bg-ink flex items-center justify-center font-bold text-[9px] text-white">VISA</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold">Ending in 4242</p>
                      <p className="text-[10px] text-ink/40 font-bold">Verified card</p>
                    </div>
                    <div className="h-5 w-5 rounded-full border-[3px] border-lemon bg-ink" />
                  </div>
                </div>

                <div className="rounded-3xl bg-pearl p-8 border border-smoke">
                  <h4 className="mb-6 text-xs font-bold text-ink/40">Final summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-ink/40">Services ({checkoutItems.length})</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-ink/40">Verified surcharge</span>
                      <span>₹4.50</span>
                    </div>
                    <div className="mt-6 border-t border-smoke pt-6 flex justify-between font-bold text-2xl tracking-tight">
                      <span>Total</span>
                      <span className="text-ink">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-lemon py-6 text-sm font-bold text-ink transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-ink border-t-transparent" />
                  ) : (
                    <>Initialize booking <CheckCircle2 size={18} /></>
                  )}
                </button>
                <button onClick={() => setStep(3)} className="w-full py-2 text-xs font-bold text-ink/40 hover:text-ink transition-all">Back to contact</button>
              </div>
            )}

            {step === 5 && (
              <div className="fixed inset-0 z-[80] bg-[#25D366] flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-500">
                <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-white text-[#25D366] shadow-2xl animate-in zoom-in duration-700 delay-300">
                  <CheckCircle2 size={64} strokeWidth={3} />
                </div>
                <h3 className="mb-4 text-5xl font-bold tracking-tight text-white">Order Confirmed.</h3>
                <p className="text-lg font-bold text-white/80 leading-relaxed max-w-sm">
                  Your artisan has been dispatched. Track their arrival in real-time through your profile dashboard.
                </p>
                <button 
                  onClick={onClose}
                  className="mt-12 rounded-2xl bg-white px-16 py-6 text-sm font-bold text-[#25D366] transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
