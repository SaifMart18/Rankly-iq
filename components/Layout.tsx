
import React from 'react';
import { supabase } from '../supabase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  userEmail: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userEmail }) => {
  const handleLogout = async () => {
    try {
      // Signs out and triggers onAuthStateChange in App.tsx
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clean up sensitive local items
      localStorage.removeItem('rankly_sop_tasks');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { id: 'sop', label: 'دليل النجاح', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { id: 'businesses', label: 'النشاطات', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )},
    { id: 'reply', label: 'رد ذكي', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
    )},
    { id: 'post', label: 'منشور AI', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    )},
  ];

  return (
    <div className="flex min-h-screen bg-brand-black flex-col md:flex-row font-sans text-right" dir="rtl">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-brand-gray border-l border-white/5 flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10">
          <h1 className="text-2xl font-black text-brand-gold tracking-tighter">Rankly IQ</h1>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Google Maps Expert</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-brand-gold text-brand-black font-black shadow-[0_10px_25px_-5px_rgba(255,195,0,0.3)]' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={activeTab === item.id ? 'scale-110' : ''}>{item.icon}</span>
              <span className="text-sm font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <div className="mb-4 px-4 overflow-hidden">
            <p className="text-[10px] font-black text-white/20 truncate uppercase tracking-widest">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-black"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-32 md:pb-8 custom-scrollbar overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-brand-gray/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-6 py-4 flex justify-between items-center z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              activeTab === item.id ? 'text-brand-gold scale-110' : 'text-white/20'
            }`}
          >
            {item.icon}
            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
