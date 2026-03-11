
import React, { useState, useCallback, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { BookingDrawer } from './components/BookingDrawer';
import { ServiceDetail } from './components/ServiceDetail';
import { Navbar } from './components/Layout/Navbar';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { BasketButton } from './components/UI/BasketButton';
import { HomeView } from './components/Views/HomeView';
import { CategoryView } from './components/Views/CategoryView';
import { ProviderView } from './components/Views/ProviderView';

const JobApplicationView = lazy(() => import('./components/JobApplicationView').then(m => ({ default: m.JobApplicationView })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const ProviderDashboard = lazy(() => import('./components/ProviderDashboard').then(m => ({ default: m.ProviderDashboard })));
const AuthView = lazy(() => import('./components/AuthView').then(m => ({ default: m.AuthView })));
import { CATEGORY_MAP } from './constants';
import { Service, DrawerState, CategoryData } from './types';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);
  const offersScrollRef = useRef<HTMLDivElement>(null);
  
  const [drawer, setDrawer] = useState<DrawerState>({ isOpen: false, service: null });
  const [detailService, setDetailService] = useState<Service | null>(null);
  const [basket, setBasket] = useState<Service[]>([]);
  const [navigation, setNavigation] = useState<{
    view: 'home' | 'category' | 'provider' | 'jobs' | 'admin' | 'provider-dashboard' | 'auth';
    selectedCategoryId: string | null;
    selectedProviderId: string | null;
    authMode?: 'login' | 'signup' | 'partner';
  }>({ view: 'home', selectedCategoryId: null, selectedProviderId: null });

  const [appData, setAppData] = useState<Record<string, CategoryData>>(CATEGORY_MAP);
  const [areas, setAreas] = useState<{ state: string; district: string; town: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dataRes, areasRes] = await Promise.all([
          fetch('/api/data'),
          fetch('/api/areas')
        ]);
        
        let data = {};
        if (dataRes.ok) {
          data = await dataRes.json();
        }
        
        let areasData = [];
        if (areasRes.ok) {
          areasData = await areasRes.json();
        }

        if (data && Object.keys(data).length > 0) {
          setAppData(data);
        } else {
          console.log("No data on server, seeding default data...");
          await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(CATEGORY_MAP)
          });
          setAppData(CATEGORY_MAP);
        }

        if (areasData && areasData.length > 0) {
          setAreas(areasData);
        } else {
          console.log("No areas on server, seeding default areas...");
          const defaultAreas = [
            { state: 'State 1', district: 'District 1', town: 'Area 1' },
            { state: 'State 1', district: 'District 1', town: 'Area 2' },
            { state: 'State 1', district: 'District 1', town: 'Area 3' }
          ];
          setAreas(defaultAreas);
          await fetch('/api/areas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(defaultAreas)
          });
        }
      } catch (err) {
        console.error("Critical error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateAppData = (newData: Record<string, CategoryData>) => {
    setAppData(newData);
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
  };

  const updateAreas = (newAreas: { state: string; district: string; town: string }[]) => {
    setAreas(newAreas);
    fetch('/api/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAreas)
    });
  };

  const [location, setLocation] = useState<string>("Banjara Hills, Hyderabad");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, (error) => {
        console.log("Geolocation error:", error);
      });
    }
  }, []);

  const allServices = useMemo(() => 
    (Object.values(appData) as CategoryData[]).flatMap(cat => cat.providers.flatMap(p => p.services)),
  [appData]);

  const popularServices = useMemo(() => 
    [...allServices].filter(s => s.offer).sort(() => 0.5 - Math.random()).slice(0, 8),
  [allServices]);
  
  const providerOffers = useMemo(() => {
    const allProviders = (Object.values(appData) as CategoryData[]).flatMap(cat => cat.providers);
    return allProviders.filter(p => p.services.some(s => s.offer)).slice(0, 8);
  }, [appData]);

  const gridCategories = (Object.values(appData) as CategoryData[]).filter(cat => cat.id !== 'appliances' && cat.id !== 'gadgets' && cat.id !== 'advice');
  const masterCategories = (Object.values(appData) as CategoryData[]).filter(cat => (cat.id === 'appliances' || cat.id === 'gadgets' || cat.id === 'advice'));

  const scrollOffers = (direction: 'left' | 'right') => {
    if (offersScrollRef.current) {
      const scrollAmount = 400;
      offersScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const navigateTo = (view: 'home' | 'category' | 'provider' | 'jobs' | 'admin' | 'provider-dashboard' | 'auth', categoryId: string | null = null, providerId: string | null = null, authMode?: 'login' | 'signup' | 'partner') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setNavigation({ view, selectedCategoryId: categoryId, selectedProviderId: providerId, authMode });
  };

  const addToBasket = (service: Service) => {
    setBasket(prev => [...prev, service]);
  };

  const removeFromBasket = (serviceId: string) => {
    setBasket(prev => {
      const index = prev.findIndex(s => s.id === serviceId);
      if (index > -1) {
        const newBasket = [...prev];
        newBasket.splice(index, 1);
        return newBasket;
      }
      return prev;
    });
  };

  const currentCategory = navigation.selectedCategoryId ? appData[navigation.selectedCategoryId] : null;
  const currentProvider = currentCategory?.providers.find(p => p.id === navigation.selectedProviderId);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-lemon selection:text-ink text-ink">
      <LoadingScreen isLoading={isLoading} />
      
      {navigation.view !== 'admin' && navigation.view !== 'provider-dashboard' && (
        <Navbar 
          location={location} 
          onLocationClick={() => {}} // Placeholder for location modal
          onNavigate={navigateTo}
          currentView={navigation.view}
        />
      )}

      {navigation.view === 'admin' && (
        <Suspense fallback={<div className="fixed inset-0 bg-white flex items-center justify-center z-[100]"><div className="h-12 w-12 border-4 border-ink border-t-transparent rounded-full animate-spin" /></div>}>
          <AdminPanel 
            data={appData} 
            onUpdateData={updateAppData} 
            areas={areas}
            onUpdateAreas={updateAreas}
            onViewDashboard={(pId) => navigateTo('provider-dashboard', null, pId)}
            onClose={() => navigateTo('home')} 
          />
        </Suspense>
      )}

      {navigation.view === 'provider-dashboard' && navigation.selectedProviderId && (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="h-12 w-12 border-4 border-ink border-t-transparent rounded-full animate-spin" /></div>}>
          {(() => {
            const provider = (Object.values(appData) as CategoryData[]).flatMap(c => c.providers).find(p => p.id === navigation.selectedProviderId);
            return provider ? <ProviderDashboard provider={provider} onBack={() => navigateTo('admin')} /> : null;
          })()}
        </Suspense>
      )}

      {navigation.view === 'home' && (
        <HomeView 
          gridCategories={gridCategories}
          masterCategories={masterCategories}
          providerOffers={providerOffers}
          popularServices={popularServices}
          onNavigate={navigateTo}
          onServiceClick={(service) => setDrawer({ isOpen: true, service })}
          popularRef={popularRef}
          offersScrollRef={offersScrollRef}
          scrollOffers={scrollOffers}
          categoriesRef={categoriesRef}
        />
      )}

      {navigation.view === 'category' && currentCategory && (
        <CategoryView 
          category={currentCategory}
          location={location}
          onNavigate={navigateTo}
        />
      )}

      {navigation.view === 'provider' && currentProvider && (
        <ProviderView 
          provider={currentProvider}
          basket={basket}
          onAddToBasket={addToBasket}
          onRemoveFromBasket={removeFromBasket}
          onServiceClick={(service) => setDetailService(service)}
        />
      )}

      {navigation.view === 'jobs' && (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="h-12 w-12 border-4 border-ink border-t-transparent rounded-full animate-spin" /></div>}>
          <JobApplicationView onBack={() => navigateTo('home')} />
        </Suspense>
      )}

      {navigation.view === 'auth' && (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="h-12 w-12 border-4 border-ink border-t-transparent rounded-full animate-spin" /></div>}>
          <AuthView 
            initialMode={navigation.authMode || 'login'} 
            onBack={() => navigateTo('home')} 
            onSuccess={() => navigateTo('home')} 
          />
        </Suspense>
      )}

      <footer className="bg-pearl py-20 border-t border-smoke">
        <div className="mx-auto max-w-[1472px] px-12">
          <Zap size={20} fill="currentColor" strokeWidth={0} className="mb-4" />
          <p className="text-sm font-bold text-ink/30">Serviceberg © 2024</p>
        </div>
      </footer>
      
      <BasketButton 
        basketCount={basket.length} 
        onClick={() => setDrawer({ isOpen: true, service: basket[0] })} 
      />

      <BookingDrawer 
        isOpen={drawer.isOpen} 
        service={drawer.service} 
        basket={basket}
        location={location}
        coords={coords}
        onLocationChange={setLocation}
        onRemoveFromBasket={removeFromBasket}
        onClose={() => setDrawer(prev => ({ ...prev, isOpen: false }))} 
      />
      
      <ServiceDetail 
        service={detailService} 
        onClose={() => setDetailService(null)} 
        onAddToBasket={addToBasket}
      />
    </div>
  );
};

export default App;
