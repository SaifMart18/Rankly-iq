
import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';

const Profile: React.FC<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // States for profile fields
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || user.email?.split('@')[0]);
  const [bio, setBio] = useState(user.user_metadata?.bio || 'صاحب عمل طموح يسعى للسيطرة على نتائج البحث.');
  const [avatar, setAvatar] = useState(user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setEditing(true); // Auto-enable edit mode when image changes
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          bio: bio,
          avatar_url: avatar
        }
      });

      if (error) throw error;
      setEditing(false);
      alert('تم تحديث ملفك الشخصي بنجاح! ✨');
    } catch (err: any) {
      alert('خطأ في الحفظ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20" dir="rtl">
      {/* Top Profile Card */}
      <div className="bg-[#0C0C0C] rounded-[3.5rem] p-12 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-gold/10 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] bg-brand-gold/10 border-4 border-white/5 p-1 relative overflow-hidden shadow-2xl">
              <img 
                src={avatar} 
                className="w-full h-full rounded-[2.8rem] object-cover transition-transform duration-500 group-hover:scale-110" 
                alt="Avatar"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
            />
          </div>

          <div className="flex-1 text-center md:text-right space-y-4">
            {editing ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-brand-gold/30 rounded-2xl px-6 py-3 text-2xl font-black text-white focus:outline-none focus:border-brand-gold"
                  placeholder="اسمك الكامل"
                />
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-white/5 border border-brand-gold/30 rounded-2xl px-6 py-3 text-sm text-white/70 focus:outline-none focus:border-brand-gold h-24 resize-none"
                  placeholder="اكتب نبذة قصيرة عن نشاطك..."
                />
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-4xl font-black mb-2 tracking-tight">{fullName}</h2>
                  <p className="text-white/40 font-medium">{user.email}</p>
                </div>
                <p className="text-white/60 text-lg leading-relaxed max-w-lg">
                  {bio}
                </p>
              </>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <span className="bg-brand-gold text-black text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-brand-gold/10 border border-brand-gold/20">Pro Member</span>
              <button 
                onClick={() => editing ? saveProfile() : setEditing(true)}
                disabled={loading}
                className={`text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest border transition-all ${
                  editing 
                  ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                }`}
              >
                {loading ? 'جاري الحفظ...' : (editing ? 'حفظ التعديلات' : 'تعديل الملف')}
              </button>
              {editing && (
                <button 
                  onClick={() => setEditing(false)}
                  className="text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20"
                >
                  إلغاء
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'إجمالي التفاعلات', value: '482', icon: '🔥' },
          { label: 'عمليات الذكاء الاصطناعي', value: '124', icon: '🧠' },
          { label: 'تاريخ الانضمام', value: new Date(user.created_at).toLocaleDateString('ar-IQ'), icon: '📅' }
        ].map(stat => (
          <div key={stat.label} className="bg-[#0C0C0C] p-8 rounded-[2.5rem] border border-white/5 group hover:border-brand-gold/20 transition-all">
            <div className="text-3xl mb-4">{stat.icon}</div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-3xl font-black text-white group-hover:text-brand-gold transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Account Settings */}
      <div className="bg-[#0C0C0C] rounded-[3.5rem] p-12 border border-white/5 space-y-10">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-black">إعدادات الحساب الآمنة</h3>
           <div className="w-12 h-px bg-white/10"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-[1.5rem] flex items-center justify-center text-brand-gold shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <p className="font-black text-lg">الأمان</p>
                <p className="text-xs text-white/30 font-medium tracking-tight">كلمة المرور محمية بنظام تشفير 256-bit</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center text-blue-400 shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="font-black text-lg">البريد المعتمد</p>
                <p className="text-xs text-white/30 font-medium tracking-tight">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-6 bg-red-500/5 border border-red-500/10 text-red-500/60 font-black rounded-[2rem] hover:bg-red-500 hover:text-white transition-all shadow-2xl hover:shadow-red-500/20 uppercase tracking-widest text-xs"
        >
          تسجيل الخروج الآمن
        </button>
      </div>
    </div>
  );
};

export default Profile;
