
import React, { useEffect, useState } from 'react';
import { supabase } from './supabase.ts';
import Auth from './components/Auth.tsx';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import BusinessManager from './components/BusinessManager.tsx';
import AIReplyGenerator from './components/AIReplyGenerator.tsx';
import AIPostGenerator from './components/AIPostGenerator.tsx';
import SOPManager from './components/SOPManager.tsx';
import Profile from './components/Profile.tsx';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sop' | 'businesses' | 'reply' | 'post' | 'profile'>('dashboard');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);

      if (_event === 'SIGNED_IN') {
        setActiveTab('dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505]" dir="rtl">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-brand-gold/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-brand-gold font-bold text-lg animate-pulse tracking-widest">RANKLY IQ</p>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userEmail={session.user.email || ''}
    >
      <div className="page-transition">
        {activeTab === 'dashboard' && <Dashboard user={session.user} setActiveTab={setActiveTab} />}
        {activeTab === 'sop' && <SOPManager />}
        {activeTab === 'businesses' && <BusinessManager user={session.user} />}
        {activeTab === 'reply' && <AIReplyGenerator user={session.user} />}
        {activeTab === 'post' && <AIPostGenerator user={session.user} />}
        {activeTab === 'profile' && <Profile user={session.user} />}
      </div>
    </Layout>
  );
};

export default App;
