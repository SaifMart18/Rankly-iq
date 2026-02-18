
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase.ts';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<{ message: string; type?: 'error' | 'warning' | 'info' } | null>(null);
  const [cooldown, setCooldown] = useState(0);

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

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ 
          email: cleanEmail, 
          password 
        });
        if (loginError) throw loginError;
      } else {
        const { data, error: signupError } = await supabase.auth.signUp({ 
          email: cleanEmail, 
          password 
        });
        if (signupError) throw signupError;
        
        if (!data.session && !data.user) {
          setError({ message: 'حدث خطأ غير متوقع أثناء إنشاء الحساب.', type: 'error' });
        } else if (!data.session && data.user) {
          // هذي الحالة لما يكون الايميل غير مفعل ولكن تم إنشاء اليوزر
          setError({ 
            message: 'تم إنشاء الحساب! يرجى مراجعة بريدك الإلكتروني لتأكيده، أو انتظر قليلاً.', 
            type: 'info' 
          });
        }
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      const msg = err.message?.toLowerCase() || '';

      if (err.status === 429 || msg.includes('rate limit')) {
        setCooldown(60);
        setError({ message: 'محاولات كثيرة جداً. انتظر دقيقة واحدة وارتاح شوية.', type: 'warning' });
      } else if (msg.includes('invalid login credentials')) {
        setError({ message: 'الإيميل أو الرمز السري خطأ. تأكد منهم عيني.', type: 'error' });
      } else if (msg.includes('user already registered')) {
        setError({ 
          message: 'هذا الإيميل مسجل مسبقاً! جرب سجل دخول بدلاً من فتح حساب جديد.', 
          type: 'info' 
        });
        // تلقائياً نحوله لصفحة تسجيل الدخول عشان نسهل عليه
        setTimeout(() => setIsLogin(true), 2000);
      } else if (msg.includes('email not confirmed')) {
        setError({ message: 'يرجى تأكيد بريدك الإلكتروني أولاً. شيك على الـ Inbox والـ Spam.', type: 'warning' });
      } else {
        setError({ message: err.message || 'صار خطأ فني، جرب مرة ثانية.', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans relative overflow-hidden" dir="rtl">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10 page-transition">
        <div className="text-center mb-10">
          <div className="inline-block w-16 h-16 bg-brand-gold rounded-[2rem] mb-6 flex items-center justify-center text-black font-black text-3xl shadow-[0_0_50px_rgba(255,195,0,0.2)]">R</div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tighter">Rankly IQ</h1>
          <p className="text-white/30 font-bold tracking-[0.2em] uppercase text-[10px] italic">Premium Google Business Solution</p>
        </div>

        <div className="bg-[#0C0C0C] p-10 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative">
          <h2 className="text-2xl font-black mb-10 text-center text-white">
            {isLogin ? 'تسجيل الدخول' : 'فتح حساب جديد'}
          </h2>
          
          {error && (
            <div className={`mb-8 p-5 rounded-3xl border animate-in zoom-in duration-300 flex items-start gap-4 ${
              error.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              error.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
              'bg-brand-gold/10 border-brand-gold/20 text-brand-gold'
            }`}>
              <div className="mt-1">
                {error.type === 'error' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
              </div>
              <div>
                <p className="font-black text-sm leading-relaxed">{error.message}</p>
                {cooldown > 0 && <p className="mt-2 text-xs opacity-70">الوقت المتبقي: {cooldown} ثانية</p>}
              </div>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black mb-3 text-white/30 uppercase tracking-[0.2em] mr-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="example@mail.com" 
                className="w-full bg-brand-black border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-brand-gold transition-all text-white placeholder:text-white/10 font-medium" 
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black mb-3 text-white/30 uppercase tracking-[0.2em] mr-2">كلمة المرور</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-brand-black border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-brand-gold transition-all text-white placeholder:text-white/10 font-medium" 
                required 
              />
            </div>

            <button 
              disabled={loading || cooldown > 0} 
              className="w-full mt-6 py-5 bg-brand-gold text-brand-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-30 transition-all shadow-2xl shadow-brand-gold/10 text-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>لحظة من فضلك...</span>
                </div>
              ) : (isLogin ? 'دخول' : 'إنشاء الحساب')}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-xs text-white/40 hover:text-brand-gold transition-all font-black uppercase tracking-widest"
            >
              {isLogin ? 'ماعندك حساب؟ سجل الآن' : 'عندك حساب؟ سجل دخول'}
            </button>
          </div>
        </div>
        
        <p className="mt-10 text-center text-white/10 text-[9px] font-black uppercase tracking-[0.4em]">Designed & Developed for Iraq Business Owners</p>
      </div>
    </div>
  );
};

export default Auth;
