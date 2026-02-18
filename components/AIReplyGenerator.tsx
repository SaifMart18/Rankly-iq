
import React, { useState } from 'react';
import { generateReviewReply, ReplyTone } from '../geminiService';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';

const AIReplyGenerator: React.FC<{ user: User }> = ({ user }) => {
  const [review, setReview] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<ReplyTone>('iraqi');
  const [copyStatus, setCopyStatus] = useState(false);

  const handleGenerate = async () => {
    if (!review) return;
    setLoading(true);
    setReply('');
    try {
      const result = await generateReviewReply(review, tone);
      if (result) {
        setReply(result);
        await supabase.from('ai_logs').insert([{
          user_id: user.id,
          type: 'reply',
          content: result
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reply);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const tones: { id: ReplyTone; label: string; icon: string }[] = [
    { id: 'iraqi', label: 'لهجة عراقية', icon: '🇮🇶' },
    { id: 'professional', label: 'رسمي', icon: '💼' },
    { id: 'friendly', label: 'ودود', icon: '😊' },
    { id: 'short', label: 'مختصر', icon: '⚡' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom duration-700 pb-20">
      {/* Header */}
      <div className="text-right space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tight">مولد الردود الذكي <span className="text-brand-gold">Pro</span></h2>
        <p className="text-white/40 font-medium">حول كل تقييم إلى فرصة ذهبية لبناء ثقة الزبائن.</p>
      </div>

      <div className="bg-[#0C0C0C] rounded-[3rem] p-8 border border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

        {/* Input Section */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">نص تقييم العميل</label>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${review.length > 0 ? 'bg-brand-gold/20 text-brand-gold' : 'text-white/10'}`}>
              {review.length} حرف
            </span>
          </div>
          <textarea 
            className="w-full bg-[#050505] border border-white/5 rounded-[2rem] px-8 py-6 h-40 focus:outline-none focus:border-brand-gold/50 transition-all text-white placeholder:text-white/10 font-medium text-lg leading-relaxed resize-none shadow-inner"
            placeholder="انسخ التقييم من خرائط جوجل والصقه هنا..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        {/* Tone Selector */}
        <div className="relative z-10 space-y-4">
           <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-2">اختر أسلوب الرد</label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all font-bold text-sm ${
                    tone === t.id 
                    ? 'bg-brand-gold text-black border-brand-gold shadow-lg shadow-brand-gold/20' 
                    : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
           </div>
        </div>

        {/* Action Button */}
        <div className="relative z-10 pt-4">
          <button 
            onClick={handleGenerate}
            disabled={loading || !review}
            className={`w-full py-6 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-4 group overflow-hidden relative ${
              loading || !review ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-brand-gold text-black hover:scale-[1.02] active:scale-95 shadow-2xl shadow-brand-gold/10'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <span className="animate-pulse">جاري التحليل والتوليد...</span>
              </div>
            ) : (
              <>
                <svg className="w-6 h-6 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>توليد رد احترافي فوري</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {reply && (
        <div className="bg-[#0C0C0C] border border-brand-gold/20 p-10 rounded-[3rem] animate-in zoom-in duration-500 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"></div>
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
              <h3 className="font-black text-brand-gold uppercase tracking-widest text-xs">الرد المقترح بواسطة AI</h3>
            </div>
            <button 
              onClick={copyToClipboard} 
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-xs transition-all ${
                copyStatus ? 'bg-green-500 text-white' : 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20'
              }`}
            >
              {copyStatus ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  تم النسخ
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  نسخ الرد
                </>
              )}
            </button>
          </div>

          <div className="text-white text-xl font-medium leading-[2] text-right bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 select-all">
            {reply}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-30 group-hover:opacity-100 transition-opacity">
             <p className="text-[10px] font-bold text-white uppercase tracking-widest italic">ملاحظة: يمكنك التعديل على النص قبل استخدامه</p>
          </div>
        </div>
      )}

      {/* Empty State / Tips */}
      {!reply && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-40">
           <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-brand-gold uppercase mb-2">لماذا ترد بسرعة؟</p>
              <p className="text-xs text-white/60">الرد في أقل من 24 ساعة يزيد من احتمالية عودة الزبون بنسبة 80%.</p>
           </div>
           <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-brand-gold uppercase mb-2">قوة اللهجة المحلية</p>
              <p className="text-xs text-white/60">الزبون العراقي يقدر جداً الكلام "العفوي" والودود أكثر من الكلام الرسمي الجاف.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AIReplyGenerator;
