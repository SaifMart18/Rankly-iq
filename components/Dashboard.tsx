
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
  const [sopProgress, setSopProgress] = useState(0);

  useEffect(() => {
    fetchBusinesses();
    const savedSop = localStorage.getItem('rankly_sop_tasks');
    if (savedSop) {
      const tasks = JSON.parse(savedSop);
      const progress = Math.round((tasks.filter((t: any) => t.completed).length / tasks.length) * 100);
      setSopProgress(progress);
    }
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
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageScore = () => {
    if (businesses.length === 0) return 0;
    const sum = businesses.reduce((acc, b) => acc + (b.score || 0), 0);
    return Math.round(sum / businesses.length);
  };

  const getTrend = (score: number, id: string) => {
    const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    const isUp = (seed + score) % 2 === 0;
    const value = (seed % 5) + 2;
    
    return {
      isUp,
      value: value + '%',
      color: isUp ? 'text-green-400' : 'text-red-400',
      bg: isUp ? 'bg-green-500/10' : 'bg-red-500/10',
      icon: isUp ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7 7 7M12 3v18" /></svg>
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7-7-7M12 21V3" /></svg>
      )
    };
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto page-transition">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black mb-1">هلا بيك 👋</h2>
          <p className="text-white/40">تابع نمو نشاطك التجاري في {businesses[0]?.city || 'العراق'} اليوم.</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-gray px-4 py-2 rounded-2xl border border-white/5">
          <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
          <span className="text-xs text-white/40 font-bold">مباشر • {new Date().toLocaleTimeString('ar-IQ')}</span>
        </div>
      </header>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-brand-gray border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
             <svg className="w-40 h-40 text-brand-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3v11h8v-2h-6V3h-2zm-2 0H3v2h6v6H3v2h8V3zM3 21h8v-6H3v2h6v4H3v2zm10 0h8v-2h-6v-6h6v-2h-8v8h2v2z"/></svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-4">القوة التسويقية الكلية</h3>
            <div className="text-brand-gold text-8xl font-black mb-6 tabular-nums drop-shadow-2xl">{calculateAverageScore()}<span className="text-3xl font-light opacity-50">%</span></div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-brand-black rounded-full overflow-hidden">
                <div className="h-full bg-brand-gold transition-all duration-1000" style={{ width: `${calculateAverageScore()}%` }}></div>
              </div>
              <p className="text-xs text-white/40 font-medium">هدفنا الوصول إلى 100%</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('sop')}
          className="bg-brand-gold/10 border border-brand-gold/20 p-8 rounded-[2rem] cursor-pointer hover:bg-brand-gold/20 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-brand-gold text-brand-black p-3 rounded-2xl shadow-xl group-hover:rotate-12 transition-transform">
                <svg className="w-6 h-6 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-4xl font-black text-brand-gold">{sopProgress}%</span>
            </div>
            <h3 className="text-xl font-black mb-2">خطة SOP</h3>
            <p className="text-sm text-brand-gold/60 leading-relaxed font-medium">أكمل المهام المتبقية لرفع مستوى ظهورك في الخرائط.</p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-black text-brand-gold underline underline-offset-4 decoration-2 uppercase">
            <span>اكمل الخطة الآن</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7 7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black">نشاطاتك المضافة</h3>
          <button onClick={() => setActiveTab('businesses')} className="text-brand-gold text-sm font-bold hover:underline bg-brand-gold/5 px-4 py-2 rounded-xl border border-brand-gold/10">إدارة الكل</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => <div key={i} className="h-32 bg-brand-gray animate-pulse rounded-3xl"></div>)}
          </div>
        ) : businesses.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-[2.5rem] text-center bg-brand-gray/30">
            <p className="text-white/40 mb-8 text-lg">لا يوجد نشاط تجاري للمتابعة بعد.</p>
            <button onClick={() => setActiveTab('businesses')} className="px-12 py-4 bg-brand-gold text-brand-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-gold/20">ابدأ بإضافة نشاطك الأول</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businesses.map(b => {
              const trend = getTrend(b.score, b.id);
              return (
                <div key={b.id} className="bg-brand-gray border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-brand-gold/30 hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-brand-black rounded-[1.25rem] flex items-center justify-center font-black text-brand-gold text-2xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                      {b.business_name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-xl mb-1">{b.business_name}</h4>
                      <p className="text-sm text-white/30 font-medium">{b.city} • العراق</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-brand-black/50 px-6 py-2 rounded-2xl border border-white/5 text-brand-gold font-black text-xl min-w-[80px] text-center">
                      {b.score}%
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${trend.bg} ${trend.color} text-[10px] font-black`}>
                      {trend.icon}
                      <span>{trend.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
