
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  Save, 
  X, 
  Image as ImageIcon,
  Star,
  MapPin,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Camera,
  Phone,
  MessageCircle,
  CreditCard,
  Instagram,
  Twitter,
  Facebook,
  Globe,
  Navigation,
  RefreshCw,
  ShieldCheck,
  Package
} from 'lucide-react';
import { CategoryData, Provider, Service } from '../types';

interface AdminPanelProps {
  data: Record<string, CategoryData>;
  onUpdateData: (newData: Record<string, CategoryData>) => void;
  areas: { state: string; district: string; town: string }[];
  onUpdateAreas: (newAreas: { state: string; district: string; town: string }[]) => void;
  onViewDashboard: (providerId: string) => void;
  onClose: () => void;
}

const ImageInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  aspectRatio?: string;
  preview?: boolean;
  className?: string;
}> = ({ label, value, onChange, aspectRatio = "aspect-video", preview = true, className = "" }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-normal text-ink/40 ml-1">{label}</label>
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-[10px] font-normal text-ink/60 hover:text-ink transition-all"
        >
          <Camera size={12} />
          Upload File
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      <div className="flex gap-4 items-center">
        {preview && (
          <div className={`${aspectRatio} h-12 rounded-xl border border-smoke overflow-hidden shrink-0 bg-pearl`}>
            <img src={value} className="h-full w-full object-cover" alt="preview" />
          </div>
        )}
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 px-5 py-3 bg-pearl border border-smoke rounded-xl text-[10px] font-mono focus:outline-none focus:border-ink transition-all"
        />
      </div>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ data, onUpdateData, areas, onUpdateAreas, onViewDashboard, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<any>({ id: '', name: '', heroImage: '', providers: [], subCategories: [] });
  const [newArea, setNewArea] = useState({ state: '', district: '', town: '' });
  const [areaSearch, setAreaSearch] = useState('');
  const [editingProvider, setEditingProvider] = useState<{ catId: string; provider: Provider } | null>(null);
  const [editingService, setEditingService] = useState<{ service: Service; index: number } | null>(null);
  const [activeMenuCategory, setActiveMenuCategory] = useState<string | null>(null);
  const [providerEditTab, setProviderEditTab] = useState<'menu' | 'settings'>('menu');
  const [showSuccess, setShowSuccess] = useState(false);

  const stats = useMemo(() => {
    const allProviders = (Object.values(data) as CategoryData[]).flatMap(c => c.providers);
    const allServices = allProviders.flatMap(p => p.services);
    return {
      totalProviders: allProviders.length,
      totalServices: allServices.length,
      totalCategories: Object.keys(data).length,
      avgRating: (allProviders.reduce((acc, p) => acc + p.rating, 0) / (allProviders.length || 1)).toFixed(1)
    };
  }, [data]);

  const filteredProviders = useMemo(() => {
    const list: { catId: string; provider: Provider }[] = [];
    (Object.entries(data) as [string, CategoryData][]).forEach(([catId, cat]) => {
      if (selectedCategory && selectedCategory !== 'all' && catId !== selectedCategory) return;
      
      cat.providers.forEach(p => {
        if (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          list.push({ catId, provider: p });
        }
      });
    });
    return list;
  }, [data, searchQuery, selectedCategory]);

  const handleSaveProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;

    const { catId, provider } = editingProvider;
    const cat = data[catId];
    if (!cat) return;

    const providerIndex = cat.providers.findIndex(p => p.id === provider.id);
    let newProviders;
    
    if (providerIndex !== -1) {
      newProviders = cat.providers.map(p => p.id === provider.id ? provider : p);
    } else {
      newProviders = [...cat.providers, provider];
    }

    const newData = {
      ...data,
      [catId]: {
        ...cat,
        providers: newProviders
      }
    };

    onUpdateData(newData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setEditingProvider(null);
  };

  const handleAddProvider = () => {
    const catId = selectedCategory || Object.keys(data)[0];
    const newProvider: Provider = {
      id: `p-${Date.now()}`,
      name: 'New Provider',
      location: 'Location...',
      image: 'https://picsum.photos/seed/provider/400/400',
      coverImage: 'https://picsum.photos/seed/cover/1200/400',
      rating: 5.0,
      reviews: '0 reviews',
      description: 'New provider description...',
      services: []
    };
    setEditingProvider({ catId, provider: newProvider });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;

    if (newCategory.id) {
      const newData = {
        ...data,
        [newCategory.id]: {
          ...data[newCategory.id],
          name: newCategory.name,
          heroImage: newCategory.heroImage,
          isActive: newCategory.isActive !== false
        }
      };
      onUpdateData(newData);
    } else {
      const catId = newCategory.name.toLowerCase().replace(/\s+/g, '-');
      const newData = {
        ...data,
        [catId]: {
          id: catId,
          name: newCategory.name,
          heroImage: newCategory.heroImage || 'https://picsum.photos/seed/category/800/600',
          providers: [],
          subCategories: ['General'],
          isActive: newCategory.isActive !== false
        }
      };
      onUpdateData(newData);
    }
    setIsAddingCategory(false);
    setNewCategory({ id: '', name: '', heroImage: '', providers: [], subCategories: [] });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArea.state || !newArea.district || !newArea.town) return;
    onUpdateAreas([...areas, newArea]);
    setNewArea({ state: '', district: '', town: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const filteredAreas = useMemo(() => {
    return areas.filter(a => 
      a.state.toLowerCase().includes(areaSearch.toLowerCase()) ||
      a.district.toLowerCase().includes(areaSearch.toLowerCase()) ||
      a.town.toLowerCase().includes(areaSearch.toLowerCase())
    );
  }, [areas, areaSearch]);

  const handleProviderChange = (field: keyof Provider, value: any) => {
    setEditingProvider(prev => {
      if (!prev) return null;
      return {
        ...prev,
        provider: { ...prev.provider, [field]: value }
      };
    });
  };

  const handleServiceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider || !editingService) return;

    const newServices = [...editingProvider.provider.services];
    newServices[editingService.index] = editingService.service;
    
    handleProviderChange('services', newServices);
    setEditingService(null);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col font-sans text-ink">
      {/* Sidebar & Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-right border-smoke bg-pearl flex flex-col">
          <div className="p-6 border-bottom border-smoke flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-ink flex items-center justify-center text-white">
              <Settings size={18} />
            </div>
            <span className="font-bold tracking-tight">Admin Console</span>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <button 
              onClick={() => {
                setActiveTab('categories');
                setSelectedCategory(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-ink text-white shadow-lg shadow-black/10' : 'text-ink/50 hover:bg-smoke hover:text-ink'}`}
            >
              <LayoutDashboard size={18} />
              Categories
            </button>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-ink text-white shadow-lg shadow-black/10' : 'text-ink/50 hover:bg-smoke hover:text-ink'}`}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>
          </nav>

          <div className="p-4 border-top border-smoke">
            <button 
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <ArrowLeft size={18} />
              Exit Admin
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-bottom border-smoke px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold tracking-tight capitalize">{activeTab}</h1>
              <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-medium tracking-tight">Server Sync Active</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-pearl border border-smoke rounded-xl text-xs font-bold hover:bg-smoke transition-all"
              >
                <RefreshCw size={14} /> Refresh
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
                <input 
                  type="text" 
                  placeholder="Search everything..." 
                  className="pl-10 pr-4 py-2 bg-pearl border border-smoke rounded-xl text-sm font-medium focus:outline-none focus:border-ink transition-all w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="h-10 w-10 rounded-full bg-pearl border border-smoke flex items-center justify-center hover:bg-smoke transition-all relative">
                <div className="h-2 w-2 bg-lemon rounded-full absolute top-2 right-2 border border-white"></div>
                <ImageIcon size={18} className="text-ink/60" />
              </button>
            </div>
          </header>

          <div className="p-8 max-w-6xl mx-auto">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Providers', value: stats.totalProviders, icon: Users, color: 'bg-blue-500' },
                    { label: 'Active Services', value: stats.totalServices, icon: CheckCircle2, color: 'bg-emerald-500' },
                    { label: 'Categories', value: stats.totalCategories, icon: LayoutDashboard, color: 'bg-purple-500' },
                    { label: 'Avg Rating', value: stats.avgRating, icon: Star, color: 'bg-lemon' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-pearl border border-smoke p-6 rounded-2xl group hover:border-ink transition-all cursor-default">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                          <stat.icon size={20} />
                        </div>
                        <span className="text-xs font-medium text-ink/20">Live</span>
                      </div>
                      <div className="text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
                      <div className="text-sm font-medium text-ink/40">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-pearl border border-smoke rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold tracking-tight">Area Management</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={14} />
                        <input 
                          type="text" 
                          placeholder="Search areas..." 
                          className="pl-9 pr-4 py-1.5 bg-white border border-smoke rounded-lg text-xs font-medium focus:outline-none focus:border-ink transition-all w-48"
                          value={areaSearch}
                          onChange={(e) => setAreaSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <form onSubmit={handleAddArea} className="grid grid-cols-3 gap-3 mb-6">
                      <input 
                        type="text" 
                        placeholder="State" 
                        className="px-3 py-2 bg-white border border-smoke rounded-lg text-xs font-bold focus:outline-none focus:border-ink"
                        value={newArea.state}
                        onChange={(e) => setNewArea({ ...newArea, state: e.target.value })}
                      />
                      <input 
                        type="text" 
                        placeholder="District" 
                        className="px-3 py-2 bg-white border border-smoke rounded-lg text-xs font-bold focus:outline-none focus:border-ink"
                        value={newArea.district}
                        onChange={(e) => setNewArea({ ...newArea, district: e.target.value })}
                      />
                      <input 
                        type="text" 
                        placeholder="Town" 
                        className="px-3 py-2 bg-white border border-smoke rounded-lg text-xs font-bold focus:outline-none focus:border-ink"
                        value={newArea.town}
                        onChange={(e) => setNewArea({ ...newArea, town: e.target.value })}
                      />
                      <button type="submit" className="col-span-3 bg-ink text-white py-2 rounded-lg text-xs font-bold hover:bg-ink/90 transition-all">
                        Add New Area
                      </button>
                    </form>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                      {filteredAreas.map((area, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-smoke rounded-xl group">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-smoke flex items-center justify-center text-ink/40">
                              <MapPin size={14} />
                            </div>
                            <div>
                              <div className="text-xs font-bold">{area.town}</div>
                              <div className="text-[10px] font-medium text-ink/40">{area.district}, {area.state}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-ink text-white rounded-3xl p-8 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold tracking-tight mb-2">Platform Health</h3>
                      <p className="text-white/60 text-sm mb-8">System performance is at peak levels today.</p>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-xs font-medium mb-2 opacity-60">
                            <span>Server Load</span>
                            <span>24%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-lemon w-[24%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-medium mb-2 opacity-60">
                            <span>API Latency</span>
                            <span>12ms</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 w-[12%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-lemon/10 rounded-full blur-3xl" />
                  </div>
                  <div className="bg-pearl border border-smoke rounded-3xl p-8">
                    <h3 className="text-lg font-bold tracking-tight mb-6">Database Health</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white border border-smoke rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <ShieldCheck size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">Persistent Storage</p>
                            <p className="text-[10px] font-bold text-ink/40">Server-side data.json active</p>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Secure</div>
                      </div>
                      <div className="p-4 bg-white border border-smoke rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <RefreshCw size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">Auto-Backup System</p>
                            <p className="text-[10px] font-bold text-ink/40">Redundant copies enabled</p>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Active</div>
                      </div>
                      <div className="pt-4 border-t border-smoke flex gap-3">
                        <button 
                          onClick={() => {
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `serviceberg_backup_${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-ink text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all active:scale-95"
                        >
                          <Package size={16} /> Export Backup
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight">Service Categories</h2>
                    <p className="text-sm font-medium text-ink/40">Manage your service ecosystem</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedCategory('all')}
                      className="bg-pearl border border-smoke px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-smoke transition-all"
                    >
                      <Users size={18} />
                      All Providers
                    </button>
                  </div>
                </div>
                
                {selectedCategory === 'all' || selectedCategory ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setSelectedCategory(null)}
                          className="h-10 w-10 rounded-full border border-smoke flex items-center justify-center hover:bg-smoke transition-all"
                        >
                          <ArrowLeft size={18} />
                        </button>
                        <h3 className="text-xl font-bold tracking-tight">
                          {selectedCategory === 'all' ? 'All Providers' : `${data[selectedCategory!]?.name} Providers`}
                        </h3>
                      </div>
                      <button 
                        onClick={handleAddProvider}
                        className="bg-ink text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:scale-105 transition-all active:scale-95"
                      >
                        <Plus size={18} />
                        Add Provider
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(selectedCategory === 'all' ? (Object.values(data) as CategoryData[]).flatMap(c => c.providers.map(p => ({ catId: c.id, provider: p }))) : (data[selectedCategory!]?.providers.map(p => ({ catId: selectedCategory!, provider: p })) || [])).map(({ catId, provider }) => (
                        <div key={provider.id} className="group bg-pearl border border-smoke rounded-[32px] overflow-hidden hover:border-ink/20 transition-all flex flex-col">
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <img src={provider.coverImage || provider.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt={provider.name} />
                            <div className="absolute top-4 right-4 flex gap-2">
                              <button 
                                onClick={() => setEditingProvider({ catId, provider })}
                                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-smoke flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all shadow-lg"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={() => onViewDashboard(provider.id)}
                                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-smoke flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                                title="View Dashboard"
                              >
                                <LayoutDashboard size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xl font-bold tracking-tight truncate">{provider.name}</h4>
                              <div className="flex items-center gap-1 bg-lemon px-2 py-1 rounded-lg text-xs font-bold">
                                <Star size={12} className="fill-ink" />
                                {Number(provider.rating).toFixed(1)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-ink/40">
                              <MapPin size={14} />
                              {provider.location}
                            </div>
                            <div className="mt-auto pt-4 flex items-center justify-between border-top border-smoke/50">
                              <span className="text-[10px] font-medium text-ink/20">{data[catId]?.name}</span>
                              <span className="text-[10px] font-medium text-ink/20">{provider.services.length} Services</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {(Object.values(data) as CategoryData[]).map((cat) => (
                      <div 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.id)}
                        className="group cursor-pointer space-y-3"
                      >
                        <div className="aspect-[4/3] w-full rounded-2xl border border-smoke overflow-hidden bg-pearl transition-all group-hover:border-ink group-hover:-translate-y-1 shadow-sm relative">
                          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setNewCategory(cat);
                                setIsAddingCategory(true);
                              }}
                              className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm border border-smoke flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all shadow-lg"
                            >
                              <Edit3 size={14} />
                            </button>
                          </div>
                          <img 
                            src={cat.heroImage} 
                            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all" 
                            alt={cat.name} 
                          />
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-bold tracking-tight text-ink/60 group-hover:text-ink transition-all">
                            {cat.name}
                          </span>
                          <div className="text-[10px] font-medium text-ink/20 mt-0.5">
                            {cat.providers.length} Profiles
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Provider Modal */}
      {editingProvider && (
        <div className="fixed inset-0 z-[70] bg-ink/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <header className="px-10 py-8 border-bottom border-smoke flex items-center justify-between shrink-0">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Edit Profile</h2>
                  <p className="text-sm font-medium text-ink/40">Modifying {editingProvider.provider.name}</p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-pearl rounded-2xl w-fit">
                  <button 
                    onClick={() => setProviderEditTab('menu')}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${providerEditTab === 'menu' ? 'bg-black text-white shadow-sm' : 'text-ink/40 hover:text-ink'}`}
                  >
                    Menu
                  </button>
                  <button 
                    onClick={() => setProviderEditTab('settings')}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${providerEditTab === 'settings' ? 'bg-black text-white shadow-sm' : 'text-ink/40 hover:text-ink'}`}
                  >
                    Settings
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    const newService: Service = {
                      id: `s-${editingProvider.provider.id}-${Date.now()}`,
                      name: 'New Service',
                      description: 'Service description...',
                      price: '₹0',
                      image: 'https://img.icons8.com/isometric/512/sparkling.png',
                      category: editingProvider.catId,
                      subCategory: activeMenuCategory || data[editingProvider.catId]?.subCategories[0] || 'General',
                      icon: 'Sparkles'
                    };
                    setEditingService({ service: newService, index: editingProvider.provider.services.length });
                    setEditingProvider({
                      ...editingProvider,
                      provider: {
                        ...editingProvider.provider,
                        services: [...editingProvider.provider.services, newService]
                      }
                    });
                  }}
                  className="bg-pearl border border-smoke px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-smoke transition-all"
                >
                  <Plus size={18} />
                  Add Service
                </button>
                <button 
                  onClick={() => setEditingProvider(null)}
                  className="h-12 w-12 rounded-full bg-pearl border border-smoke flex items-center justify-center hover:bg-smoke transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto">
              <div className="p-10 space-y-12">
                {providerEditTab === 'settings' ? (
                  <>
                    {/* Visual Assets First */}
                    <section className="space-y-6">
                      <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-4">
                          <label className="text-[11px] font-bold text-black ml-1">Profile Display (16:9)</label>
                          <div className="aspect-[16/9] w-full rounded-[32px] overflow-hidden border border-smoke bg-pearl relative group">
                            <img 
                              src={editingProvider.provider.coverImage || editingProvider.provider.image} 
                              className="h-full w-full object-cover" 
                              alt="preview" 
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-normal shadow-xl">Customer View Preview</span>
                            </div>
                          </div>
                          <ImageInput 
                            label="Cover Image URL"
                            value={editingProvider.provider.coverImage || ''}
                            onChange={(val) => handleProviderChange('coverImage', val)}
                            preview={false}
                          />
                        </div>
                      </div>
                    </section>

                    {/* Status Toggle */}
                    <section className="bg-pearl/50 p-6 rounded-3xl border border-smoke flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-black">Profile Status</h3>
                        <p className="text-xs text-ink/40">Toggle to show as "Coming Soon" and dim on main profile</p>
                      </div>
                      <button 
                        onClick={() => handleProviderChange('isActive', !editingProvider.provider.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${editingProvider.provider.isActive !== false ? 'bg-emerald-500' : 'bg-ink/20'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editingProvider.provider.isActive !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </section>

                    {/* Basic Info */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-black ml-1">Provider Name</label>
                        <input 
                          type="text" 
                          value={editingProvider.provider.name}
                          onChange={(e) => handleProviderChange('name', e.target.value)}
                          className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-black ml-1">Location</label>
                        <input 
                          type="text" 
                          value={editingProvider.provider.location}
                          onChange={(e) => handleProviderChange('location', e.target.value)}
                          className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-black ml-1">Description</label>
                        <textarea 
                          rows={3}
                          value={editingProvider.provider.description}
                          onChange={(e) => handleProviderChange('description', e.target.value)}
                          className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all resize-none"
                        />
                      </div>
                    </section>

                    {/* Contact & Links */}
                    <section className="space-y-6">
                      <h3 className="text-sm font-bold text-black border-bottom border-smoke pb-4">Contact & Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-black ml-1 flex items-center gap-2">
                            <Phone size={12} /> Phone Number
                          </label>
                          <input 
                            type="tel" 
                            value={editingProvider.provider.phone || ''}
                            onChange={(e) => handleProviderChange('phone', e.target.value)}
                            placeholder="+91..."
                            className="w-full px-5 py-3 bg-pearl border border-smoke rounded-xl text-xs font-normal focus:outline-none focus:border-ink transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-black ml-1 flex items-center gap-2">
                            <MessageCircle size={12} /> WhatsApp Number
                          </label>
                          <input 
                            type="tel" 
                            value={editingProvider.provider.whatsapp || ''}
                            onChange={(e) => handleProviderChange('whatsapp', e.target.value)}
                            placeholder="+91..."
                            className="w-full px-5 py-3 bg-pearl border border-smoke rounded-xl text-xs font-normal focus:outline-none focus:border-ink transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-black ml-1 flex items-center gap-2">
                            <CreditCard size={12} /> Payment URL
                          </label>
                          <input 
                            type="url" 
                            value={editingProvider.provider.paymentUrl || ''}
                            onChange={(e) => handleProviderChange('paymentUrl', e.target.value)}
                            placeholder="https://pay..."
                            className="w-full px-5 py-3 bg-pearl border border-smoke rounded-xl text-xs font-normal focus:outline-none focus:border-ink transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-black ml-1 flex items-center gap-2">
                            <Globe size={12} /> Website URL
                          </label>
                          <input 
                            type="url" 
                            value={editingProvider.provider.website || ''}
                            onChange={(e) => handleProviderChange('website', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-5 py-3 bg-pearl border border-smoke rounded-xl text-xs font-normal focus:outline-none focus:border-ink transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-black ml-1 flex items-center gap-2">
                            <Instagram size={12} /> Instagram
                          </label>
                          <input 
                            type="url" 
                            value={editingProvider.provider.instagram || ''}
                            onChange={(e) => handleProviderChange('instagram', e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="w-full px-5 py-3 bg-pearl border border-smoke rounded-xl text-xs font-normal focus:outline-none focus:border-ink transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-black ml-1 flex items-center gap-2">
                            <Twitter size={12} /> Twitter
                          </label>
                          <input 
                            type="url" 
                            value={editingProvider.provider.twitter || ''}
                            onChange={(e) => handleProviderChange('twitter', e.target.value)}
                            placeholder="https://twitter.com/..."
                            className="w-full px-5 py-3 bg-pearl border border-smoke rounded-xl text-xs font-normal focus:outline-none focus:border-ink transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-black ml-1 flex items-center gap-2">
                            <Facebook size={12} /> Facebook
                          </label>
                          <input 
                            type="url" 
                            value={editingProvider.provider.facebook || ''}
                            onChange={(e) => handleProviderChange('facebook', e.target.value)}
                            placeholder="https://facebook.com/..."
                            className="w-full px-5 py-3 bg-pearl border border-smoke rounded-xl text-xs font-normal focus:outline-none focus:border-ink transition-all"
                          />
                        </div>
                      </div>
                    </section>

                    {/* Geolocation */}
                    <section className="space-y-6">
                      <h3 className="text-sm font-bold text-black border-bottom border-smoke pb-4">Geolocation</h3>
                      <div className="bg-pearl rounded-2xl p-6 border border-smoke">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-ink text-white flex items-center justify-center">
                              <Navigation size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-black">Precise Coordinates</h4>
                              <p className="text-[10px] font-normal text-ink/40">Used for directions and maps</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              if ("geolocation" in navigator) {
                                navigator.geolocation.getCurrentPosition(
                                  (position) => {
                                    setEditingProvider(prev => {
                                      if (!prev) return null;
                                      return {
                                        ...prev,
                                        provider: { 
                                          ...prev.provider, 
                                          lat: position.coords.latitude,
                                          lng: position.coords.longitude
                                        }
                                      };
                                    });
                                    alert("Location detected successfully!");
                                  },
                                  (error) => {
                                    let msg = "Unknown error";
                                    switch(error.code) {
                                      case error.PERMISSION_DENIED: msg = "Permission denied"; break;
                                      case error.POSITION_UNAVAILABLE: msg = "Position unavailable"; break;
                                      case error.TIMEOUT: msg = "Timeout"; break;
                                    }
                                    alert(`Geolocation error: ${msg}`);
                                  },
                                  { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                                );
                              } else {
                                alert("Geolocation is not supported by this browser.");
                              }
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-xl text-[10px] font-normal hover:scale-105 transition-all active:scale-95"
                          >
                            <MapPin size={12} /> Locate Me
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-black ml-1">Latitude</label>
                            <input 
                              type="number" 
                              step="any"
                              value={editingProvider.provider.lat || ''}
                              onChange={(e) => handleProviderChange('lat', parseFloat(e.target.value))}
                              className="w-full px-4 py-2.5 bg-white border border-smoke rounded-xl text-xs font-mono focus:outline-none focus:border-ink transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-black ml-1">Longitude</label>
                            <input 
                              type="number" 
                              step="any"
                              value={editingProvider.provider.lng || ''}
                              onChange={(e) => handleProviderChange('lng', parseFloat(e.target.value))}
                              className="w-full px-4 py-2.5 bg-white border border-smoke rounded-xl text-xs font-mono focus:outline-none focus:border-ink transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Stats */}
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-black ml-1">Rating</label>
                        <input 
                          type="number" 
                          step="0.1"
                          max="5"
                          min="1"
                          value={editingProvider.provider.rating}
                          onChange={(e) => handleProviderChange('rating', parseFloat(e.target.value))}
                          className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-black ml-1">Reviews</label>
                        <input 
                          type="text" 
                          value={editingProvider.provider.reviews}
                          onChange={(e) => handleProviderChange('reviews', e.target.value)}
                          className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all"
                        />
                      </div>
                    </section>
                  </>
                ) : (
                  /* Grouped Services Menu (Customer View Style) */
                  <section className="space-y-8">
                    <div className="flex items-center justify-between border-bottom border-smoke pb-4">
                      <h3 className="text-xl font-bold text-black">Services Menu</h3>
                    </div>

                    {/* Sub-category Menu */}
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                      {(data[editingProvider.catId]?.subCategories || ['General']).map((cat) => (
                        <button 
                          key={cat}
                          type="button"
                          onClick={() => setActiveMenuCategory(cat)}
                          className={`px-5 py-2 rounded-full text-xs font-normal whitespace-nowrap transition-all border ${activeMenuCategory === cat || (!activeMenuCategory && cat === data[editingProvider.catId]?.subCategories[0]) ? 'bg-ink text-white border-ink' : 'bg-pearl text-ink/40 border-smoke hover:border-ink hover:text-ink'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Grouped Services */}
                    <div className="space-y-12">
                      {(data[editingProvider.catId]?.subCategories || ['General']).map((sectionTitle) => {
                        const sectionServices = editingProvider.provider.services.filter(s => s.subCategory === sectionTitle || (!s.subCategory && sectionTitle === (data[editingProvider.catId]?.subCategories?.[0] || 'General')));
                        if (sectionServices.length === 0) return null;

                        return (
                          <div key={sectionTitle} className="space-y-6">
                            <h4 className="text-xl font-normal tracking-tight">{sectionTitle}</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {sectionServices.map((service) => {
                                const sIdx = editingProvider.provider.services.findIndex(s => s.id === service.id);
                                return (
                                  <div key={service.id} className="group bg-pearl border border-smoke rounded-2xl p-4 flex gap-4 hover:border-ink/10 transition-all relative overflow-hidden items-start">
                                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl overflow-hidden shrink-0 p-2 border border-smoke">
                                      <img src={service.image} className="h-full w-full object-contain" alt={service.name} />
                                    </div>
                                    <div className="flex-1 flex flex-col py-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-normal text-ink tracking-tight leading-tight">{service.name}</h3>
                                        {service.offer && <span className="px-2 py-0.5 bg-lemon text-[10px] font-normal rounded-md">{service.offer}</span>}
                                      </div>
                                      <p className="text-[12px] text-ink/60 leading-snug mt-2 line-clamp-2">{service.description}</p>
                                      <div className="mt-auto pt-2">
                                        <span className="text-lg font-normal text-[#32C5D2]">{service.price}</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <button 
                                        type="button"
                                        onClick={() => setEditingService({ service, index: sIdx })}
                                        className="h-10 w-10 rounded-xl border border-smoke bg-white flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all shadow-sm"
                                      >
                                        <Edit3 size={18} />
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => onViewDashboard(editingProvider.provider.id)}
                                        className="h-10 w-10 rounded-xl border border-smoke bg-white flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                        title="View Dashboard"
                                      >
                                        <LayoutDashboard size={18} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <footer className="px-10 py-8 border-top border-smoke bg-pearl flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
                      // Find the actual category this provider belongs to, just in case catId is stale
                      let targetCatId = editingProvider.catId;
                      if (!data[targetCatId]?.providers.some(p => p.id === editingProvider.provider.id)) {
                        const foundCat = Object.entries(data).find(([_, cat]) => (cat as CategoryData).providers.some(p => p.id === editingProvider.provider.id));
                        if (foundCat) targetCatId = foundCat[0];
                      }

                      const cat = data[targetCatId];
                      if (cat) {
                        const newData = {
                          ...data,
                          [targetCatId]: {
                            ...cat,
                            providers: cat.providers.filter(p => p.id !== editingProvider.provider.id)
                          }
                        };
                        onUpdateData(newData);
                        setEditingProvider(null);
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 3000);
                      }
                    }
                  }}
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Profile
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold text-ink/40 hover:text-ink transition-all"
                >
                  Discard Changes
                </button>
              </div>
              <button 
                onClick={handleSaveProvider}
                className="bg-ink text-white px-10 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-xl shadow-black/20"
              >
                <Save size={18} />
                Save Profile
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-[80] bg-ink/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <header className="px-8 py-6 border-bottom border-smoke flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold tracking-tight">{newCategory.id ? 'Edit Category' : 'New Category'}</h2>
              <button 
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategory({ id: '', name: '', heroImage: '', providers: [], subCategories: [] });
                }}
                className="h-10 w-10 rounded-full bg-pearl border border-smoke flex items-center justify-center hover:bg-smoke transition-all"
              >
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleCreateCategory} className="p-8 space-y-6">
              {/* Status Toggle */}
              <div className="bg-pearl/50 p-6 rounded-3xl border border-smoke flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Category Status</h3>
                  <p className="text-xs text-ink/40">Toggle to enable or disable this category</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, isActive: newCategory.isActive === false ? true : false })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${newCategory.isActive !== false ? 'bg-emerald-500' : 'bg-ink/20'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newCategory.isActive !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-ink/40 ml-1">Category Name</label>
                <input 
                  type="text" 
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g. Home Cleaning"
                  className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all"
                  autoFocus
                />
              </div>
              <ImageInput 
                label="Hero Image URL"
                value={newCategory.heroImage}
                onChange={(val) => setNewCategory({ ...newCategory, heroImage: val })}
              />

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategory({ id: '', name: '', heroImage: '', providers: [], subCategories: [] });
                  }}
                  className="flex-1 px-8 py-4 rounded-2xl text-sm font-bold text-ink/40 hover:text-ink transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-ink text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-black/20 hover:scale-[1.02] transition-all"
                >
                  {newCategory.id ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Sub-Modal */}
      {editingService && (
        <div className="fixed inset-0 z-[80] bg-ink/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <header className="px-10 py-8 border-bottom border-smoke flex items-center justify-between shrink-0">
              <h2 className="text-2xl font-bold tracking-tight">Edit Service</h2>
              <button 
                onClick={() => setEditingService(null)}
                className="h-12 w-12 rounded-full bg-pearl border border-smoke flex items-center justify-center hover:bg-smoke transition-all"
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleServiceUpdate} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-ink/40 ml-1">Service Name</label>
                      <input 
                        type="text" 
                        value={editingService.service.name}
                        onChange={(e) => setEditingService({ ...editingService, service: { ...editingService.service, name: e.target.value } })}
                        className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-medium text-ink/40 ml-1">Price</label>
                      <input 
                        type="text" 
                        value={editingService.service.price}
                        onChange={(e) => setEditingService({ ...editingService, service: { ...editingService.service, price: e.target.value } })}
                        className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all"
                      />
                    </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-ink/40 ml-1">Description</label>
                <textarea 
                  rows={3}
                  value={editingService.service.description}
                  onChange={(e) => setEditingService({ ...editingService, service: { ...editingService.service, description: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-ink/40 ml-1">Sub-Category</label>
                  <select 
                    value={editingService.service.subCategory}
                    onChange={(e) => setEditingService({ ...editingService, service: { ...editingService.service, subCategory: e.target.value } })}
                    className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all"
                  >
                    {(data[editingProvider!.catId]?.subCategories || ['General']).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-ink/40 ml-1">Offer Tag</label>
                  <input 
                    type="text" 
                    value={editingService.service.offer || ''}
                    placeholder="e.g. 20% Off"
                    onChange={(e) => setEditingService({ ...editingService, service: { ...editingService.service, offer: e.target.value } })}
                    className="w-full px-5 py-3.5 bg-pearl border border-smoke rounded-2xl text-sm font-normal focus:outline-none focus:border-ink transition-all"
                  />
                </div>
              </div>

              <ImageInput 
                label="Service Image URL"
                value={editingService.service.image}
                onChange={(val) => setEditingService({ ...editingService, service: { ...editingService.service, image: val } })}
                aspectRatio="aspect-square"
              />

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 px-8 py-4 rounded-2xl text-sm font-bold text-ink/40 hover:text-ink transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleServiceUpdate}
                  className="flex-1 bg-ink text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-black/20 hover:scale-[1.02] transition-all"
                >
                  Update Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 z-[100] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 size={20} />
          <span className="text-sm font-bold">Changes saved successfully!</span>
        </div>
      )}
    </div>
  );
};
