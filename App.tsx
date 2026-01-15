
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ClipboardList, 
  Users, 
  Activity, 
  Search,
  Lock,
  Cpu,
  LogOut,
  ChevronRight,
  Shield,
  Network,
  Settings
} from 'lucide-react';
import ClinicalWorkspace from './components/ClinicalWorkspace';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: <ClipboardList size={22} />, label: 'Data Intake' },
    { path: '/patients', icon: <Users size={22} />, label: 'Patient Store' },
    { path: '/dashboard', icon: <Activity size={22} />, label: 'System Validation' },
  ];

  return (
    <aside className="w-24 lg:w-64 bg-slate-950 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-900 z-50 transition-all">
      <div className="p-8 flex items-center gap-4">
        <div className="bg-slate-800 p-2.5 rounded-[16px] shadow-lg border border-slate-700">
          <Shield className="text-white" size={24} />
        </div>
        <div className="hidden lg:block">
          <h1 className="font-black text-white text-xl tracking-tighter uppercase">Sentinel</h1>
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <Network size={10} /> Local Node v1.0
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 group ${
              isActive(item.path) 
                ? 'bg-white text-slate-950 shadow-xl' 
                : 'hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span className={isActive(item.path) ? 'text-slate-950' : 'text-slate-500 group-hover:text-slate-300'}>
              {item.icon}
            </span>
            <span className="font-black text-xs hidden lg:block uppercase tracking-wide">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 hidden lg:block">
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 mb-2 uppercase tracking-widest">
            <Lock size={12} className="text-emerald-500" /> Offline Verified
          </div>
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">
            Data Persistence: <span className="text-white">Encrypted</span><br/>
            Sync Status: <span className="text-emerald-400">Isolated</span>
          </p>
        </div>
        <button className="flex items-center gap-3 w-full px-4 py-4 mt-4 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
          <Settings size={18} /> Settings
        </button>
      </div>
    </aside>
  );
};

const Header = () => {
  return (
    <header className="h-20 glass-effect fixed top-0 right-0 left-24 lg:left-64 z-40 flex items-center justify-between px-10 border-b border-slate-100">
      <div className="flex items-center gap-4 text-slate-400">
        <span className="text-[10px] font-black uppercase tracking-widest">Node 01-HULSE</span>
        <ChevronRight size={14} className="text-slate-200" />
        <span className="text-sm font-bold text-slate-900">Zachary Hulse, Clinical Lead</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search local records..." 
            className="pl-12 pr-6 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-900 transition-all w-80 font-medium"
          />
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          Stability: Stable
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex bg-white selection:bg-slate-900 selection:text-white">
        <Sidebar />
        <div className="flex-1 ml-24 lg:ml-64 transition-all">
          <Header />
          <main className="pt-28 p-10 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<ClinicalWorkspace />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
