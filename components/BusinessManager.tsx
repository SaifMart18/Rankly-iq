
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Business } from '../types';
import { User } from '@supabase/supabase-js';

const BusinessManager: React.FC<{ user: User }> = ({ user }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [score, setScore] = useState(50);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setBusinesses(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city) return;

    const { data, error } = await supabase
      .from('businesses')
      .insert([{
        business_name: name,
        city,
        score,
        user_id: user.id
      }])
      .select();

    if (data) {
      setBusinesses([data[0], ...businesses]);
      setName('');
      setCity('');
      setScore(50);
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setBusinesses(businesses.filter(b => b.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">إدارة النشاطات</h2>
          <p className="text-white/60">أضف أو عدل معلومات مشاريعك التجارية</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-gold text-brand-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform"
        >
          {showForm ? 'إلغاء' : 'نشاط جديد'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-brand-gray p-6 rounded-2xl border border-brand-gold/20 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">اسم النشاط</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: مطعم النوارس"
                className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المدينة</label>
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: بغداد، الكرادة"
                className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-right">قوة النشاط التقديرية (Score: {score}%)</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
              className="w-full accent-brand-gold bg-white/10 h-2 rounded-lg"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-brand-gold text-brand-black font-black rounded-xl hover:bg-yellow-400">
            حفظ النشاط
          </button>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">جاري التحميل...</div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-white/40">لا توجد نشاطات مضافة.</p>
          </div>
        ) : (
          businesses.map(b => (
            <div key={b.id} className="bg-brand-gray border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:border-white/20 transition-all shadow-lg group">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-bold text-brand-gold">
                  {b.business_name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{b.business_name}</h3>
                  <p className="text-sm text-white/50">{b.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:block text-right">
                  <div className="text-xs text-white/40">قوة النشاط</div>
                  <div className="text-brand-gold font-black">{b.score}%</div>
                </div>
                <button 
                  onClick={() => handleDelete(b.id)}
                  className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessManager;
