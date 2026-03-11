import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Globe,
  Info,
  Briefcase,
  User,
  Eye,
  EyeOff
} from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'partner';

interface AuthViewProps {
  initialMode?: AuthMode;
  onBack: () => void;
  onSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login', onBack, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'partner') {
        alert('Partner application submitted successfully!');
        setMode('login');
      } else if (mode === 'signup') {
        alert('Account created successfully!');
        setMode('login');
      } else {
        onSuccess();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white flex flex-col">
      {/* Header / Navigation */}
      <nav className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-medium tracking-tighter cursor-pointer" onClick={onBack}>Serviceberg</span>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button className="hover:text-gray-600 transition-colors">Services</button>
            <button className="hover:text-gray-600 transition-colors">Safety</button>
            <button className="hover:text-gray-600 transition-colors">Help</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <Globe className="w-4 h-4" />
            EN
          </button>
          {mode !== 'partner' ? (
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm font-medium px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          ) : (
            <button 
              onClick={() => setMode('login')}
              className="text-sm font-medium px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Customer Login
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-start justify-between gap-16 flex-1">
        {/* Left Side: Content */}
        <div className="w-full md:w-1/2 space-y-8 sticky top-24">
          <motion.div
            key={mode === 'partner' ? 'partner-title' : 'customer-title'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
              {mode === 'partner' 
                ? 'Partner with Serviceberg' 
                : mode === 'login' 
                  ? 'Log in to see your services' 
                  : 'Get started with Serviceberg'}
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              {mode === 'partner' 
                ? 'Join our network of skilled professionals and grow your business with India\'s most reliable service platform.'
                : 'Professional home services delivered to your doorstep. Reliable, safe, and transparent.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 max-w-md">
            {mode !== 'partner' ? (
              <div 
                onClick={() => setMode('partner')}
                className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors cursor-pointer group bg-gray-50/50"
              >
                <h3 className="font-medium mb-2 flex items-center justify-between text-black">
                  Become a Partner
                  <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </h3>
                <p className="text-sm text-gray-500">Earn more by providing your professional services.</p>
              </div>
            ) : (
              <div 
                onClick={() => setMode('login')}
                className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors cursor-pointer group bg-gray-50/50"
              >
                <h3 className="font-medium mb-2 flex items-center justify-between text-black">
                  Book a Service
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </h3>
                <p className="text-sm text-gray-500">Looking for help? Switch to customer mode.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-medium mb-8 text-black">
                  {mode === 'partner' 
                    ? 'Partner Application' 
                    : mode === 'login' 
                      ? 'What\'s your phone number or email?' 
                      : 'Create your account'}
                </h2>

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-black transition-all placeholder:text-gray-500 text-black"
                      required
                    />
                  </div>
                )}

                {mode === 'partner' && (
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Email address"
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-black transition-all placeholder:text-gray-500 text-black"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Interested Profession (e.g. Plumber, Electrician)"
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-black transition-all placeholder:text-gray-500 text-black"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex bg-gray-100 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black transition-all">
                    <div className="px-4 py-3 flex items-center justify-center font-medium text-gray-600 border-r border-gray-200">
                      +91
                    </div>
                    <input 
                      type="tel" 
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 transition-all placeholder:text-gray-500 text-black"
                      required
                    />
                  </div>
                </div>

                {mode !== 'partner' && (
                  <>
                    <div className="space-y-2 relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-black transition-all placeholder:text-gray-500 pr-12 text-black"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {mode === 'signup' && (
                      <div className="space-y-2 relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-black transition-all placeholder:text-gray-500 pr-12 text-black"
                          required
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {mode === 'partner' && (
                  <div className="space-y-2">
                    <textarea 
                      placeholder="Brief description of your experience"
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-black transition-all placeholder:text-gray-500 resize-none text-black"
                      required
                    />
                  </div>
                )}

                {mode !== 'login' && (
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from Serviceberg and its affiliates to the number provided.
                  </p>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white font-medium py-4 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {mode === 'partner' ? 'Submit Application' : 'Continue'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {mode !== 'partner' && (
                  <button 
                    type="button"
                    onClick={() => alert('Continuing as guest...')}
                    className="w-full bg-white text-black border border-gray-200 font-medium py-4 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    Continue as guest
                  </button>
                )}
              </form>

              {mode !== 'partner' && (
                <>
                  <p className="mt-6 text-sm text-gray-600">
                    {mode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button 
                          onClick={() => setMode('signup')}
                          className="font-medium underline hover:text-black transition-colors"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button 
                          onClick={() => setMode('login')}
                          className="font-medium underline hover:text-black transition-colors"
                        >
                          Log in
                        </button>
                      </>
                    )}
                  </p>

                  <div className="mt-8 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs font-medium text-gray-400 bg-white px-4">
                      OR
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-black">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                      Continue with Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-black">
                      <img src="https://www.svgrepo.com/show/475633/apple-color.svg" className="w-5 h-5" alt="Apple" />
                      Continue with Apple
                    </button>
                  </div>
                </>
              )}

              <div className="mt-12 flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  {mode === 'partner' 
                    ? 'Our team will review your application and get back to you within 2-3 business days.'
                    : 'If you are having trouble logging in, please visit our Help Center or contact support.'}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-100 py-12 px-6 md:px-12 shrink-0">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <span className="text-xl font-medium tracking-tighter text-black">Serviceberg</span>
            <p className="text-sm text-gray-500">© 2026 Serviceberg Technologies Inc.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-black">Company</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="hover:text-black cursor-pointer">About us</li>
                <li className="hover:text-black cursor-pointer">Newsroom</li>
                <li className="hover:text-black cursor-pointer">Careers</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-black">Products</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="hover:text-black cursor-pointer">Cleaning</li>
                <li className="hover:text-black cursor-pointer">Repair</li>
                <li className="hover:text-black cursor-pointer">Beauty</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-black">Global</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="hover:text-black cursor-pointer">Cities</li>
                <li className="hover:text-black cursor-pointer">Safety</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
