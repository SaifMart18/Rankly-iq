
import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BusinessManager from './components/BusinessManager';
import AIReplyGenerator from './components/AIReplyGenerator';
import AIPostGenerator from './components/AIPostGenerator';
import SOPManager from './components/SOPManager';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sop' | 'businesses' | 'reply' | 'post'>('dashboard');

  useEffect(() => {
    // 1. Initial session check
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

    // 2. Continuous listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);

      if (_event === 'SIGNED_IN') {
        setActiveTab('dashboard');
      }
      if (_event === 'SIGNED_OUT') {
        setActiveTab('dashboard'); // Reset tab on logout
        localStorage.removeItem('rankly_sop_tasks'); // Clean up local storage if desired
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Full screen loader to prevent UI flickering
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-black" dir="rtl">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-brand-gold/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-brand-gold font-bold text-lg animate-pulse tracking-widest">تحميل رانكلي IQ...</p>
      </div>
    );
  }

  // If no session, show Auth screen
  if (!session) {
    return <Auth />;
  }

  // Protected application shell
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
      </div>
    </Layout>
  );
};

export default App;
