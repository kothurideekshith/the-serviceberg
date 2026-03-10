
import React, { useState } from 'react';
import { ChevronRight, Upload, CheckCircle2, User, Mail, Phone, Briefcase, FileText, Calendar, MapPin, Award, IndianRupee, Clock, ChevronLeft, ShieldCheck, Globe } from 'lucide-react';
import { TRAIN_SERVICES } from '../constants';

interface JobApplicationViewProps {
  onBack: () => void;
}

export const JobApplicationView: React.FC<JobApplicationViewProps> = ({ onBack }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    location: '',
    category: '',
    experience: '',
    skills: '',
    previousWork: '',
    description: '',
    availability: '',
    expectedRate: '',
    cv: null as File | null,
    portfolio: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const inputClass = "w-full bg-pearl border border-smoke rounded-xl py-3.5 px-5 text-sm font-medium outline-none focus:ring-4 focus:ring-lemon/10 focus:border-lemon transition-all placeholder:text-ink/20";
  const labelClass = "text-[10px] font-bold text-ink/40 mb-2 block ml-1";
  const sectionTitleClass = "text-xl font-bold tracking-tight text-ink mb-6 flex items-center gap-3 border-b border-smoke pb-4";

  if (isSubmitted) {
    return (
      <main className="mx-auto max-w-[1472px] px-6 pt-40 pb-24 md:px-12 lg:px-24 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="h-28 w-28 bg-lemon rounded-full flex items-center justify-center text-ink shadow-2xl shadow-lemon/30 mb-10 animate-bounce">
          <CheckCircle2 size={56} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-6 text-center">Summit application received</h1>
        <p className="text-lg font-medium text-ink/40 max-w-xl text-center leading-relaxed">
          The recruitment desk has received your dossier, <b>{formData.name}</b>. Our vetting team will analyze your background and contact you for a technical assessment within 48 business hours.
        </p>
        <div className="mt-12 flex gap-4">
          <button 
            onClick={onBack}
            className="px-12 py-5 bg-ink text-white rounded-2xl font-bold text-xs hover:bg-ink/90 active:scale-95 transition-all shadow-xl"
          >
            Return to marketplace
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1472px] px-6 pt-32 pb-24 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-ink/30 mb-6 font-bold text-[11px]">
            <ShieldCheck size={14} className="text-ink" /> Recruitment desk
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-ink mb-6">
            Join the <span className="text-ink/20">artisan guild.</span>
          </h1>
          <p className="text-lg font-medium text-ink/40 leading-relaxed max-w-2xl">
            Serviceberg is looking for the top 1% of service professionals. Provide your comprehensive professional details below to begin the elite vetting process.
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Section: Personal Dossier */}
          <section>
            <h2 className={sectionTitleClass}>
              <User size={20} className="text-ink/30" /> Personal dossier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className={labelClass}>Full legal name</label>
                <div className="relative">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input required type="text" placeholder="e.g. Rahul Sharma" className={`${inputClass} pl-14`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input required type="email" placeholder="you@domain.com" className={`${inputClass} pl-14`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Direct phone number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input required type="tel" placeholder="+91" className={`${inputClass} pl-14`} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Age</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input required type="number" min="18" max="75" placeholder="Years" className={`${inputClass} pl-14`} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Gender identity</label>
                <select required className={inputClass} value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Current residential location (applying from)</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input required type="text" placeholder="Full address, city, pincode" className={`${inputClass} pl-14`} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Professional Profile */}
          <section>
            <h2 className={sectionTitleClass}>
              <Briefcase size={20} className="text-ink/30" /> Professional profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Primary job category</label>
                <select required className={inputClass} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">Select specialty</option>
                  {TRAIN_SERVICES.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Years of professional experience</label>
                <div className="relative">
                  <Award size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input required type="number" min="0" placeholder="e.g. 5" className={`${inputClass} pl-14`} value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Core skills & tools</label>
                <input required type="text" placeholder="e.g. Advanced electrical diagnostics, soldering, solar panel installation" className={inputClass} value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
                <p className="text-[10px] text-ink/30 mt-2 font-bold tracking-wider">Separate skills with commas</p>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Previous employer / work history</label>
                <textarea rows={3} placeholder="Name of agencies or clients you've worked with previously..." className={`${inputClass} resize-none`} value={formData.previousWork} onChange={e => setFormData({...formData, previousWork: e.target.value})} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Executive professional summary</label>
                <textarea required rows={4} placeholder="Introduce yourself. Why are you a good fit for Serviceberg's premium standards?" className={`${inputClass} resize-none`} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Section: Logistics & Compensation */}
          <section>
            <h2 className={sectionTitleClass}>
              <Clock size={20} className="text-ink/30" /> Logistics & compensation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Expected hourly / monthly rate</label>
                <div className="relative">
                  <IndianRupee size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input required type="text" placeholder="e.g. ₹500/hr or ₹25,000/mo" className={`${inputClass} pl-14`} value={formData.expectedRate} onChange={e => setFormData({...formData, expectedRate: e.target.value})} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Work availability</label>
                <select required className={inputClass} value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})}>
                  <option value="">Select availability</option>
                  <option value="immediate">Immediate joiner</option>
                  <option value="1week">1 Week notice</option>
                  <option value="2weeks">2 Weeks notice</option>
                  <option value="parttime">Part-time only</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Portfolio / website URL (optional)</label>
                <div className="relative">
                  <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input type="url" placeholder="https://..." className={`${inputClass} pl-14`} value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Documentation */}
          <section>
            <h2 className={sectionTitleClass}>
              <FileText size={20} className="text-ink/30" /> Documentation
            </h2>
            <div>
              <label className={labelClass}>Upload curriculum vitae (CV) / resume</label>
              <div className="relative group">
                <input 
                  required
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={e => setFormData({...formData, cv: e.target.files?.[0] || null})}
                />
                <div className="border-2 border-dashed border-smoke rounded-2xl p-16 flex flex-col items-center justify-center gap-4 group-hover:border-lemon group-hover:bg-pearl/30 transition-all">
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-ink/10 group-hover:text-ink transition-colors shadow-lg shadow-black/5">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-ink">
                      {formData.cv ? formData.cv.name : "Click to select file or drag & drop"}
                    </p>
                    <p className="text-xs font-medium text-ink/30 mt-2">PDF, DOC, DOCX • MAX 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="pt-10 border-t border-smoke flex flex-col md:flex-row items-center gap-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto md:px-20 bg-ink text-white py-6 rounded-2xl font-bold text-sm hover:bg-ink/90 active:scale-[0.98] transition-all shadow-2xl shadow-ink/20 flex items-center justify-center gap-4"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-white/20 border-t-white" />
              ) : (
                <>Submit professional application <ChevronRight size={18} /></>
              )}
            </button>
            <button 
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-ink/30 hover:text-ink transition-colors"
            >
              Cancel and return
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
