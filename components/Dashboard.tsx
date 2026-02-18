
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Business } from '../types';
import { User } from '@supabase/supabase-js';

interface DashboardProps {
  user: User;
  setActiveTab: (tab: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setActiveTab }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setBusinesses(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart - Area Chart Simulation */}
        <div className="lg:col-span-2 bg-[#0C0C0C] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">CDN usage</h3>
              <p className="text-white/20 text-[10px]">Last 28 days</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white tabular-nums">1.4 K</span>
            </div>
          </div>
          
          {/* Mock Area Chart SVG */}
          <div className="h-48 w-full mt-4">
            <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor:'rgba(255,255,255,0.1)', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'rgba(255,255,255,0)', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <path 
                d="M0 80 Q 50 20, 100 60 T 200 40 T 300 70 T 400 30 V 100 H 0 Z" 
                fill="url(#grad)" 
              />
              <path 
                d="M0 80 Q 50 20, 100 60 T 200 40 T 300 70 T 400 30" 
                fill="none" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeOpacity="0.4"
              />
              {/* Data points */}
              <circle cx="210" cy="45" r="3" fill="white" className="animate-pulse" />
              <rect x="200" y="10" width="40" height="20" rx="4" fill="white" fillOpacity="0.1" />
              <text x="205" y="24" fontSize="8" fill="white" fontWeight="bold">56,000 B</text>
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-[9px] text-white/20 font-bold uppercase tracking-widest px-2">
            <span>Jul 1</span>
            <span>Jul 7</span>
            <span>Jul 14</span>
            <span>Jul 21</span>
            <span>Jul 28</span>
          </div>
        </div>

        {/* Donut Chart - Resource Usage */}
        <div className="bg-[#0C0C0C] rounded-[2.5rem] p-8 border border-white/5 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-10">
            <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest">Resource Usage</h3>
            <span className="text-white/20 text-[9px]">Last 30 days</span>
          </div>
          
          <div className="relative w-40 h-40 mb-8">
             <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1a1a1a" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#FFC300" strokeWidth="3" strokeDasharray="30 70" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4FD1C5" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-30" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F56565" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-50" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-black">74%</span>
                <span className="text-[8px] text-white/20 uppercase font-bold">Used</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[8px] text-white/30 uppercase mb-1">Disk Usage</p>
              <p className="text-xs font-bold">2.56 GB of 10 GB</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[8px] text-white/30 uppercase mb-1">CDN Usage</p>
              <p className="text-xs font-bold">35 MB of 1 GB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Data Transfer Chart */}
        <div className="bg-[#0C0C0C] rounded-[2.5rem] p-8 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Data transfer</h3>
              <p className="text-white/20 text-[9px]">Last 7 days</p>
            </div>
            <span className="text-xl font-black tabular-nums">7.45 KB</span>
          </div>
          <div className="h-24">
             <svg viewBox="0 0 200 40" className="w-full h-full">
                <path d="M0 30 L20 25 L40 35 L60 20 L80 25 L100 15 L120 30 L140 22 L160 28 L180 18 L200 25" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
             </svg>
          </div>
        </div>

        {/* Unique Visits Bar Chart */}
        <div className="bg-[#0C0C0C] rounded-[2.5rem] p-8 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Unique visits</h3>
              <p className="text-white/20 text-[9px]">Last 7 days</p>
            </div>
            <span className="text-xl font-black tabular-nums">1242</span>
          </div>
          <div className="flex items-end justify-between h-24 gap-2">
            {[40, 70, 30, 90, 60, 45, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-white/10 rounded-t-lg relative group transition-all hover:bg-white/20" style={{ height: `${h}%` }}>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h * 12}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section: Your Sites */}
      <div className="bg-[#0C0C0C] rounded-[3rem] p-8 border border-white/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black tracking-tight">Your Sites</h3>
          <button onClick={() => setActiveTab('businesses')} className="text-white/20 text-xs font-bold hover:text-brand-gold transition-colors">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-white/20 text-[10px] uppercase tracking-widest border-b border-white/5">
                <th className="pb-4 font-black">Name</th>
                <th className="pb-4 font-black">Location</th>
                <th className="pb-4 font-black text-left">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {businesses.slice(0, 4).map(site => (
                <tr key={site.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 font-bold text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-brand-gold group-hover:text-black transition-colors">{site.business_name[0]}</div>
                      {site.business_name}
                    </div>
                  </td>
                  <td className="py-6 text-xs text-white/40">{site.city}</td>
                  <td className="py-6 text-left">
                    <span className="bg-brand-gold/10 text-brand-gold text-[11px] font-black px-3 py-1.5 rounded-full border border-brand-gold/20">
                      {site.score}%
                    </span>
                  </td>
                </tr>
              ))}
              {businesses.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-20 text-center text-white/20 font-bold italic">
                    No active sites found. Add your first business to start monitoring.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
