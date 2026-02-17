
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // مؤقت للعد التنازلي عند حدوث حظر مؤقت
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || cooldown > 0) return;
    
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ 
          email: email.trim(), 
          password 
        });
        if (loginError) throw loginError;
      } else {
        const { data, error: signupError } = await supabase.auth.signUp({ 
          email: email.trim(), 
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (signupError) throw signupError;
        
        if (!data.session) {
          setError('تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى تفعيل الحساب.');
        }
      }
    } catch (err: any) {
      console.error('Auth Error Details:', err);
      
      const msg = err.message?.toLowerCase() || '';
      const status = err.status;

      if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
        setCooldown(60); // إجبار المستخدم على الانتظار دقيقة
        setError('لقد تجاوزت عدد المحاولات المسموح بها. يرجى الانتظار دقيقة واحدة قبل المحاولة مجدداً حمايةً لحسابك.');
      } else if (msg.includes('failed to fetch') || msg.includes('network error')) {
        setError('عذراً، فشل الاتصال بالخادم. تأكد من جودة الإنترنت في منطقتك.');
      } else if (msg.includes('invalid login credentials')) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (msg.includes('email not confirmed')) {
        setError('لم يتم تأكيد بريدك الإلكتروني بعد. يرجى مراجعة صندوق الوارد.');
      } else {
        setError(err.message || 'حدث خطأ فني غير متوقع. يرجى المحاولة لاحقاً.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md page-transition">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black text-brand-gold mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(255,195,0,0.3)]">Rankly IQ</h1>
          <p className="text-white/40 font-medium tracking-wide">الخبير العراقي لخرائط جوجل</p>
        </div>

        <div className="bg-brand-gray p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {loading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold/10 overflow-hidden">
              <div className="h-full bg-brand-gold w-1/3 animate-loading-bar"></div>
            </div>
          )}
          
          <h2 className="text-3xl font-black mb-8 text-center text-white">
            {isLogin ? 'دخول النظام' : 'حساب جديد'}
          </h2>
          
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex flex-col gap-2 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 p-2 rounded-xl">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="font-bold leading-relaxed">{error}</span>
              </div>
              {cooldown > 0 && (
                <div className="text-center mt-2 bg-red-500/20 py-1 rounded-lg font-black text-xs">
                  يرجى الانتظار: {cooldown} ثانية
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-xs font-black mb-2 text-white/20 uppercase tracking-[0.2em] mr-1">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@company.iq" 
                disabled={loading || cooldown > 0}
                className="w-full bg-brand-black border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/5 transition-all text-white placeholder:text-white/10 disabled:opacity-50" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-black mb-2 text-white/20 uppercase tracking-[0.2em] mr-1">كلمة المرور</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                disabled={loading || cooldown > 0}
                className="w-full bg-brand-black border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/5 transition-all text-white placeholder:text-white/10 disabled:opacity-50" 
                required 
              />
            </div>

            <button 
              disabled={loading || !email || !password || cooldown > 0} 
              className="w-full mt-4 py-5 bg-brand-gold text-brand-black font-black rounded-2xl hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xl shadow-brand-gold/10 active:scale-[0.98] text-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-brand-black border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحقق...</span>
                </>
              ) : cooldown > 0 ? (
                `انتظر ${cooldown}ث`
              ) : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-sm text-white/30 hover:text-brand-gold transition-colors font-bold disabled:opacity-50"
              disabled={loading}
            >
              {isLogin ? 'لا تملك حساباً؟ انضم للمحترفين' : 'لديك حساب بالفعل؟ سجل دخولك'}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(250%); }
          100% { transform: translateX(-100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Auth;
