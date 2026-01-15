
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  LineChart,
  Line,
  Legend,
  Cell
} from 'recharts';
import { Activity, Clock, Server, Zap, ShieldCheck, Database, Play, Download, BarChart2, Network, Globe, Cpu } from 'lucide-react';

const latencyComparison = [
  { metric: 'Initial Handshake', edge: 45, cloud: 450 },
  { metric: 'Token Stream', edge: 12, cloud: 85 },
  { metric: 'Context Loading', edge: 120, cloud: 1100 },
  { metric: 'Total Inference', edge: 480, cloud: 2800 },
];

const coherenceHistory = [
  { day: 'Mon', coherence: 0.94 },
  { day: 'Tue', coherence: 0.95 },
  { day: 'Wed', coherence: 0.92 },
  { day: 'Thu', coherence: 0.98 },
  { day: 'Fri', coherence: 0.97 },
];

// Generating a 12x12 grid representing 144 edge nodes for visualization
const generateNodes = () => {
  return Array.from({ length: 144 }, (_, i) => ({
    id: i,
    status: Math.random() > 0.05 ? 'active' : 'standby',
    latency: Math.floor(Math.random() * 20) + 10
  }));
};

const Dashboard: React.FC = () => {
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  const nodes = useMemo(() => generateNodes(), []);

  const runBenchmark = () => {
    setIsRunningBenchmark(true);
    setTimeout(() => setIsRunningBenchmark(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">System Validation Node-01</h2>
          <p className="text-slate-500 text-sm font-medium">Monitoring 144 Local Inference Nodes across the regional mesh.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={runBenchmark}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
          >
            {isRunningBenchmark ? <Activity className="animate-spin" size={18} /> : <Play size={18} />}
            Force Sync
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Diagnostic Report
          </button>
        </div>
      </div>

      {/* Network Topology Viewer */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
            <Network size={20} className="text-blue-600" />
            Edge Mesh Topology (12x12)
          </h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Active
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-slate-200" /> Standby
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-2 max-w-2xl mx-auto">
          {nodes.map((node) => (
            <div 
              key={node.id}
              className={`aspect-square rounded-md transition-all duration-500 border ${
                node.status === 'active' 
                ? 'bg-emerald-500/10 border-emerald-200 hover:bg-emerald-500/20' 
                : 'bg-slate-50 border-slate-100'
              }`}
              title={`Node ${node.id}: ${node.status} (${node.latency}ms)`}
            />
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-8 justify-center">
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">138 / 144</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nodes Engaged</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">98.4%</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mesh Stability</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-slate-900">14ms</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Pulse</div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest">
            <Clock size={18} className="text-blue-600" />
            Inference Latency Delta
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyComparison} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="metric" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#64748b'}} width={100} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="edge" name="Edge Node" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="cloud" name="Cloud Baseline" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest">
            <BarChart2 size={18} className="text-indigo-600" />
            Coherence Index (κ)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={coherenceHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#64748b'}} />
                <YAxis hide domain={[0.8, 1.0]} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Line type="stepAfter" dataKey="coherence" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg"><Cpu size={20} /></div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-400">Processor Utilization</span>
           </div>
           <div className="text-2xl font-black">24%</div>
           <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-500 h-full w-[24%] transition-all duration-1000" />
           </div>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500 rounded-lg"><Database size={20} /></div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Node Stability</span>
           </div>
           <div className="text-2xl font-black">99.99%</div>
           <div className="mt-3 text-[10px] font-bold text-emerald-500 uppercase">Uptime protocol active</div>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500 rounded-lg"><Globe size={20} /></div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Regional Coverage</span>
           </div>
           <div className="text-2xl font-black">12 Zones</div>
           <div className="mt-3 text-[10px] font-bold text-indigo-400 uppercase">Isolated Edge Active</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
