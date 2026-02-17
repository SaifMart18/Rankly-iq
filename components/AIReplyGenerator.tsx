
import React, { useState } from 'react';
import { generateReviewReply } from '../geminiService';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';

const AIReplyGenerator: React.FC<{ user: User }> = ({ user }) => {
  const [review, setReview] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!review) return;
    setLoading(true);
    try {
      const result = await generateReviewReply(review);
      if (result) {
        setReply(result);
        // Save log to Supabase
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
    alert('تم النسخ إلى الحافظة!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold">مولد الردود الذكي</h2>
        <p className="text-white/60">حول التقييمات السلبية إلى إيجابية والرد بسرعة فائقة</p>
      </div>

      <div className="bg-brand-gray p-6 rounded-2xl border border-white/5 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">الصق تقييم العميل هنا:</label>
          <textarea 
            className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-3 h-32 focus:outline-none focus:border-brand-gold resize-none"
            placeholder="مثال: الطعام كان بارداً والخدمة بطيئة جداً..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !review}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            loading || !review ? 'bg-white/5 text-white/20' : 'bg-brand-gold text-brand-black hover:bg-yellow-400'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-brand-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>توليد الرد بالذكاء الاصطناعي</span>
            </>
          )}
        </button>
      </div>

      {reply && (
        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-brand-gold">الرد المقترح:</h3>
            <button onClick={copyToClipboard} className="text-xs bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-lg hover:bg-brand-gold/30 transition-colors">نسخ النص</button>
          </div>
          <div className="text-white/90 whitespace-pre-wrap leading-relaxed text-right">
            {reply}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReplyGenerator;
