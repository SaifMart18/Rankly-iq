
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase.ts';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        
        // إذا كان خيار Confirm Email معطلاً في Supabase، سيعود data.session مليئاً
        // إذا كان لا يزال يطلب تأكيد، سننبه المستخدم
        if (!data.session && !data.user) {
          setError('حدث خطأ أثناء إنشاء الحساب.');
        } else if (!data.session && data.user) {
          setError('تم إنشاء الحساب، لكن إعدادات النظام تتطلب تأكيد البريد. يرجى مراجعة بريدك أو تعطيل خيار Confirm Email من إعدادات Supabase.');
        }
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      const msg = err.message?.toLowerCase() || '';

      if (err.status === 429 || msg.includes('rate limit')) {
        setCooldown(60);
        setError('محاولات كثيرة جداً. انتظر دقيقة واحدة وارتاح شوية.');
      } else if (msg.includes('invalid login credentials')) {
        setError('الإيميل أو الرمز السري خطأ. تأكد منهم عيني.');
      } else if (msg.includes('user already registered')) {
        setError('هذا الإيميل مسجل مسبقاً. جرب سجل دخول.');
      } else {
        setError(err.message || 'صار خطأ فني، جرب مرة ثانية.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 font-sans" dir="rtl">
      <div className="w-full max-w-md page-transition">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-brand-gold mb-2 tracking-tighter">Rankly IQ</h1>
          <p className="text-white/40 font-medium tracking-wide italic">دليلك للسيطرة على خرائط جوجل</p>
        </div>

        <div className="bg-brand-gray p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
          <h2 className="text-2xl font-black mb-8 text-center text-white">
            {isLogin ? 'تسجيل الدخول' : 'فتح حساب جديد'}
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl animate-in zoom-in duration-300">
              <p className="font-bold leading-relaxed">{error}</p>
              {cooldown > 0 && <p className="mt-2 text-xs opacity-70">الوقت المتبقي: {cooldown} ثانية</p>}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black mb-2 text-white/30 uppercase tracking-widest mr-1">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="example@mail.com" 
                className="w-full bg-brand-black border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-gold transition-all text-white placeholder:text-white/10" 
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black mb-2 text-white/30 uppercase tracking-widest mr-1">كلمة المرور</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-brand-black border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-gold transition-all text-white placeholder:text-white/10" 
                required 
              />
            </div>

            <button 
              disabled={loading || cooldown > 0} 
              className="w-full mt-4 py-4 bg-brand-gold text-brand-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-30 transition-all shadow-xl shadow-brand-gold/10 text-lg"
            >
              {loading ? 'جاري التحميل...' : (isLogin ? 'دخول' : 'إنشاء الحساب')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-sm text-white/40 hover:text-brand-gold transition-colors font-bold"
            >
              {isLogin ? 'ماعندك حساب؟ سجل الآن' : 'عندك حساب؟ سجل دخول'}
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-white/10 text-[10px] font-bold uppercase tracking-[0.3em]">Built for Iraqi Business Owners</p>
      </div>
    </div>
  );
};

export default Auth;
