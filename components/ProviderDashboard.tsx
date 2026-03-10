
import React, { useMemo, useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Download,
  Filter,
  Search,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
  ChevronDown,
  Phone,
  MessageSquare
} from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Provider, Order } from '../types';

interface ProviderDashboardProps {
  provider: Provider;
  onBack: () => void;
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', serviceName: 'Premium Laundry', customerName: 'Rahul Sharma', date: '2024-03-06', amount: 450, status: 'completed', details: '15 items, express delivery' },
  { id: 'ORD-002', serviceName: 'Dry Cleaning', customerName: 'Priya Patel', date: '2024-03-06', amount: 850, status: 'pending', details: '3 suits, 2 sarees' },
  { id: 'ORD-003', serviceName: 'Ironing Service', customerName: 'Amit Verma', date: '2024-03-05', amount: 120, status: 'completed', details: '10 shirts' },
  { id: 'ORD-004', serviceName: 'Shoe Cleaning', customerName: 'Sneha Reddy', date: '2024-03-05', amount: 300, status: 'cancelled', details: '2 pairs of sneakers' },
  { id: 'ORD-005', serviceName: 'Curtain Cleaning', customerName: 'Vikram Singh', date: '2024-03-04', amount: 1200, status: 'completed', details: 'Full house curtains' },
  { id: 'ORD-006', serviceName: 'Premium Laundry', customerName: 'Ananya Rao', date: '2024-03-04', amount: 550, status: 'pending', details: '20 items' },
];

const REVENUE_DATA = [
  { name: 'Mon', revenue: 2400 },
  { name: 'Tue', revenue: 1398 },
  { name: 'Wed', revenue: 9800 },
  { name: 'Thu', revenue: 3908 },
  { name: 'Fri', revenue: 4800 },
  { name: 'Sat', revenue: 3800 },
  { name: 'Sun', revenue: 4300 },
];

const ORDER_TREND_DATA = [
  { name: 'Mon', orders: 12 },
  { name: 'Tue', orders: 8 },
  { name: 'Wed', orders: 25 },
  { name: 'Thu', orders: 15 },
  { name: 'Fri', orders: 18 },
  { name: 'Sat', orders: 22 },
  { name: 'Sun', orders: 20 },
];

const RevenueCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  viewMonth, 
  viewYear, 
  onMonthChange 
}: { 
  selectedDate: string; 
  onDateSelect: (date: string) => void;
  viewMonth: number;
  viewYear: number;
  onMonthChange: (direction: 'prev' | 'next') => void;
}) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === viewMonth && today.getFullYear() === viewYear;
  const todayDate = today.getDate();

  const calendarDays = [];
  for (let i = 0; i < startOffset; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <div className="w-full bg-white select-none">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Earnings</h3>
          <p className="text-sm font-bold text-ink/40">Daily revenue breakdown</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#48B8B8] tracking-tight">{monthNames[viewMonth]}</h2>
            <h2 className="text-xl font-bold text-[#FF8B7D] tracking-tight">{viewYear}</h2>
          </div>
          <div className="flex items-center gap-4 text-[#D1D1D1] ml-4">
            <button 
              onClick={() => onMonthChange('prev')}
              className="hover:text-ink transition-all active:scale-90 cursor-pointer"
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <button 
              onClick={() => onMonthChange('next')}
              className="hover:text-ink transition-all active:scale-90 cursor-pointer"
            >
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4">
        {days.map((day, i) => (
          <div key={i} className="text-center text-sm font-bold text-[#FF8B7D] mb-2">
            {day}
          </div>
        ))}
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          
          const isToday = isCurrentMonth && day === todayDate;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          
          // Only show earnings for past and today
          const hasEarnings = !isCurrentMonth || day <= todayDate || viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth < today.getMonth());
          const mockValue = Math.floor(Math.random() * 2000) + 500;

          return (
            <div 
              key={day} 
              onClick={() => onDateSelect(dateStr)}
              className={`flex flex-col items-center justify-center group cursor-pointer py-3 rounded-full transition-all aspect-square w-full max-w-[64px] mx-auto ${
                isToday 
                  ? 'bg-[#48B8B8] text-white shadow-lg shadow-[#48B8B8]/20' 
                  : isSelected 
                    ? 'bg-pearl' 
                    : 'hover:bg-pearl/50'
              }`}
            >
              <span className={`text-xl font-bold leading-none mb-1 ${isToday ? 'text-white' : 'text-[#888888] group-hover:text-ink'}`}>
                {day}
              </span>
              {hasEarnings && (
                <span className={`text-[10px] font-bold flex items-center tracking-tight ${isToday ? 'text-white/80' : 'text-[#48B8B8]'}`}>
                  <span className={`mr-0.5 text-[10px] font-bold ${isToday ? 'text-white' : 'text-[#E8C55E]'}`}>₹</span>
                  {mockValue}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CompactOrderList = ({ selectedDate }: { selectedDate: string }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const displayDate = useMemo(() => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, [selectedDate]);

  return (
    <div className="bg-white rounded-[40px] border border-smoke p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight">{displayDate}</h3>
          <p className="text-sm font-bold text-ink/40">Orders for this day</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="border border-smoke rounded-2xl overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-pearl/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-smoke flex items-center justify-center text-xs font-bold">
                  {order.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold tracking-tight">{order.customerName}</h4>
                  <p className="text-[10px] font-bold text-ink/40 flex items-center gap-1">
                    <Clock size={10} /> 10:30 AM
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: expandedId === order.id ? 180 : 0 }}
                  className="text-ink/30"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </div>
            </button>
            
            <AnimatePresence>
              {expandedId === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-pearl/20"
                >
                  <div className="p-4 border-t border-smoke space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-ink/40">Service</span>
                      <span className="text-xs font-bold">{order.serviceName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-ink/40">Amount</span>
                      <span className="text-xs font-bold text-emerald-600">₹{order.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-ink/40">Date</span>
                      <span className="text-xs font-bold">{order.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-ink/40">Order ID</span>
                      <span className="text-xs font-bold font-mono">{order.id}</span>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        order.status === 'pending' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {order.status}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm">
                          <Phone size={14} fill="currentColor" />
                        </button>
                        <button className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm">
                          <MessageSquare size={14} fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ provider, onBack }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'customers' | 'settings'>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-03-06');
  const [viewMonth, setViewMonth] = useState(2); // March
  const [viewYear, setViewYear] = useState(2026);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    } else {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
    }
  };

  const stats = useMemo(() => {
    const totalRevenue = REVENUE_DATA.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalOrders = ORDER_TREND_DATA.reduce((acc, curr) => acc + curr.orders, 0);
    return {
      totalRevenue,
      totalOrders,
      avgOrderValue: (totalRevenue / totalOrders).toFixed(0),
      growth: '+12.5%'
    };
  }, []);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-ink font-sans">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-24' : 'w-72'} bg-white border-r border-smoke flex flex-col sticky top-0 h-screen z-40 transition-all duration-300 ease-in-out`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-ink rounded-xl flex items-center justify-center text-white">
                  <ShoppingBag size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight">ServiceBerg</span>
              </div>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`h-8 w-8 rounded-lg border border-smoke flex items-center justify-center hover:bg-smoke transition-all ${isCollapsed ? 'mx-auto' : ''}`}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-ink text-white shadow-xl shadow-ink/10' 
                    : 'text-ink/40 hover:bg-smoke hover:text-ink'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-2">
            <button 
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-ink/40 hover:bg-smoke hover:text-ink transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? 'Support' : ''}
            >
              <HelpCircle size={20} />
              {!isCollapsed && <span>Support</span>}
            </button>
            <button 
              onClick={onBack}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? 'Exit Dashboard' : ''}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Exit Dashboard</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-10 py-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-3xl overflow-hidden border-2 border-white shadow-xl">
              <img src={provider.image} className="h-full w-full object-cover" alt="" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{provider.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-medium text-ink/40">Provider Dashboard</span>
                <div className="h-1 w-1 rounded-full bg-ink/20" />
                <span className="text-xs font-medium text-emerald-500">Live Updates Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="h-12 w-12 rounded-2xl border border-smoke flex items-center justify-center hover:bg-smoke transition-all relative group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <div className="h-12 w-12 rounded-2xl bg-ink text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-ink/20">
              {provider.name[0]}
            </div>
          </div>
        </header>

        <main className="px-10 pb-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+8.2%' },
                    { label: 'Avg. Order', value: `₹${stats.avgOrderValue}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+4.1%' },
                    { label: 'Active Customers', value: '1,284', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+15.3%' },
                  ].map((stat, i) => (
                    <div 
                      key={i} 
                      className="bg-white p-6 rounded-[32px] border border-smoke shadow-sm hover:shadow-xl hover:border-ink/5 transition-all group cursor-default"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                          <stat.icon size={24} />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-emerald-500">{stat.trend}</span>
                          <span className="text-[8px] font-medium text-ink/20">vs last month</span>
                        </div>
                      </div>
                      <div className="text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
                      <div className="text-sm font-medium text-ink/40">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[40px] border border-smoke p-12 shadow-sm">
                    <RevenueCalendar 
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      viewMonth={viewMonth}
                      viewYear={viewYear}
                      onMonthChange={handleMonthChange}
                    />
                  </div>

                  <div className="h-full">
                    <CompactOrderList selectedDate={selectedDate} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[40px] border border-smoke overflow-hidden shadow-sm"
              >
                <div className="px-8 py-6 border-b border-smoke flex items-center justify-between bg-white sticky top-0 z-10">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Recent Orders</h3>
                    <p className="text-sm font-bold text-ink/40">Manage and track your latest service requests</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search orders..." 
                        className="pl-10 pr-4 py-2 bg-pearl border border-smoke rounded-xl text-xs font-bold focus:outline-none focus:border-ink transition-all w-64"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-pearl border border-smoke rounded-xl text-xs font-bold hover:bg-smoke transition-all">
                      <Filter size={14} /> Filter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-pearl/50">
                        <th className="px-8 py-4 text-[10px] font-bold text-ink/40 border-b border-smoke">Order ID</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-ink/40 border-b border-smoke">Customer</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-ink/40 border-b border-smoke">Service</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-ink/40 border-b border-smoke">Date</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-ink/40 border-b border-smoke">Amount</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-ink/40 border-b border-smoke">Status</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-ink/40 border-b border-smoke"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-smoke">
                      {MOCK_ORDERS.map((order) => (
                        <tr key={order.id} className="hover:bg-pearl/30 transition-all group">
                          <td className="px-8 py-5 text-xs font-bold tracking-tight">{order.id}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-smoke flex items-center justify-center text-[10px] font-bold">
                                {order.customerName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-xs font-bold">{order.customerName}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">{order.serviceName}</span>
                              <span className="text-[10px] font-medium text-ink/40">{order.details}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2 text-xs font-bold text-ink/40">
                              <Clock size={12} />
                              {order.date}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-xs font-bold">₹{order.amount}</td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                                order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                order.status === 'pending' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                'bg-red-50 text-red-600 border border-red-100'
                              }`}>
                                {order.status === 'completed' && <CheckCircle2 size={10} />}
                                {order.status === 'pending' && <Clock size={10} />}
                                {order.status === 'cancelled' && <AlertCircle size={10} />}
                                {order.status}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all">
                                  <Phone size={12} fill="currentColor" />
                                </button>
                                <button className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all">
                                  <MessageSquare size={12} fill="currentColor" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="h-8 w-8 rounded-lg hover:bg-smoke flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="px-8 py-6 bg-pearl/30 border-t border-smoke flex items-center justify-between">
                  <span className="text-[10px] font-bold text-ink/40">Showing 6 of 142 orders</span>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-smoke rounded-xl text-[10px] font-bold hover:bg-smoke transition-all disabled:opacity-50" disabled>Previous</button>
                    <button className="px-4 py-2 bg-white border border-smoke rounded-xl text-[10px] font-bold hover:bg-smoke transition-all">Next</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'customers' && (
              <motion.div
                key="customers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[40px] border border-smoke p-12 shadow-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Active Customers</h3>
                    <p className="text-sm font-bold text-ink/40">Manage your customer base</p>
                  </div>
                  <button className="px-6 py-3 bg-ink text-white rounded-2xl text-xs font-bold hover:shadow-xl hover:shadow-ink/20 transition-all">
                    Export List
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['Rahul Sharma', 'Priya Patel', 'Amit Verma', 'Sneha Reddy', 'Vikram Singh', 'Ananya Rao'].map((name, i) => (
                    <div key={i} className="p-6 rounded-[32px] border border-smoke hover:border-ink/10 hover:shadow-xl transition-all group flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-pearl flex items-center justify-center text-lg font-bold">
                        {name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold tracking-tight">{name}</h4>
                        <p className="text-[10px] font-bold text-ink/40">{Math.floor(Math.random() * 20) + 1} Orders</p>
                      </div>
                      <button className="ml-auto h-10 w-10 rounded-xl hover:bg-smoke flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[40px] border border-smoke p-12 shadow-sm"
              >
                <h3 className="text-xl font-bold tracking-tight mb-8">Provider Settings</h3>
                <div className="space-y-8 max-w-2xl">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-medium text-ink/40">Business Name</label>
                      <input type="text" defaultValue={provider.name} className="w-full px-4 py-3 bg-pearl border border-smoke rounded-2xl text-sm font-medium focus:outline-none focus:border-ink transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-medium text-ink/40">Contact Email</label>
                      <input type="email" defaultValue="contact@serviceberg.com" className="w-full px-4 py-3 bg-pearl border border-smoke rounded-2xl text-sm font-medium focus:outline-none focus:border-ink transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium text-ink/40">Business Description</label>
                    <textarea rows={4} className="w-full px-4 py-3 bg-pearl border border-smoke rounded-2xl text-sm font-medium focus:outline-none focus:border-ink transition-all resize-none" defaultValue="Providing top-tier services across the region with a focus on quality and customer satisfaction." />
                  </div>
                  <button className="px-8 py-4 bg-ink text-white rounded-2xl text-sm font-bold hover:shadow-xl hover:shadow-ink/20 transition-all">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
