
import React, { useState } from 'react';
import { generateGMBPost } from '../geminiService';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';

const AIPostGenerator: React.FC<{ user: User }> = ({ user }) => {
  const [businessType, setBusinessType] = useState('');
  const [event, setEvent] = useState('');
  const [city, setCity] = useState('');
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!businessType || !event) return;
    setLoading(true);
    try {
      const result = await generateGMBPost(businessType, event, city);
      if (result) {
        setPost(result);
        // Save log to Supabase
        await supabase.from('ai_logs').insert([{
          user_id: user.id,
          type: 'post',
          content: result
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold">مولد المنشورات الإعلانية</h2>
        <p className="text-white/60">اصنع محتوى إبداعي يزيد من مبيعاتك وظهورك</p>
      </div>

      <div className="bg-brand-gray p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">نوع النشاط</label>
            <input 
              type="text" 
              placeholder="مثال: صيدلية، مطعم برغر"
              className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">المدينة</label>
            <input 
              type="text" 
              placeholder="مثال: البصرة، الحكيمية"
              className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">عن ماذا تريد المنشور؟</label>
          <textarea 
            className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-3 h-24 focus:outline-none focus:border-brand-gold resize-none"
            placeholder="مثال: عرض خصم 20% بمناسبة الافتتاح، أو وصول بضاعة جديدة..."
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !businessType || !event}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            loading || !businessType || !event ? 'bg-white/5 text-white/20' : 'bg-brand-gold text-brand-black hover:bg-yellow-400'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-brand-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              <span>إنشاء منشور احترافي</span>
            </>
          )}
        </button>
      </div>

      {post && (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl animate-in zoom-in duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C13.9124 14 13.017 13.1046 13.017 12V6C13.017 4.89543 13.9124 4 15.017 4H21.017C22.1216 4 23.017 4.89543 23.017 6V12C23.017 13.1046 22.1216 14 21.017 14V16C21.017 18.7614 18.7784 21 16.017 21H14.017ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8V14H4C2.89543 14 2 13.1046 2 12V6C2 4.89543 2.89543 4 4 4H10C11.1046 4 12 4.89543 12 6V12C12 13.1046 11.1046 14 10 14V16C10 18.7614 7.76142 21 5 21H3Z" /></svg>
          </div>
          <div className="flex justify-between items-center mb-6">
             <span className="text-xs bg-brand-gold text-brand-black px-2 py-1 rounded font-bold uppercase tracking-wider">المنشور المقترح</span>
             <button onClick={() => {navigator.clipboard.writeText(post); alert('تم نسخ المنشور!');}} className="text-brand-gold text-sm hover:underline">نسخ النص</button>
          </div>
          <div className="text-white/90 whitespace-pre-wrap leading-loose text-right">
            {post}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPostGenerator;
