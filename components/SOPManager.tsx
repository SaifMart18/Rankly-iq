
import React, { useState, useEffect } from 'react';

const INITIAL_TASKS = [
  { id: '1', category: 'أساسيات', title: 'تأكيد ملكية النشاط', description: 'تأكد من طلب كود التحقق من جوجل وتفعيل حسابك رسمياً.', completed: false },
  { id: '2', category: 'أساسيات', title: 'تحديث ساعات العمل', description: 'أضف ساعات العمل بدقة، بما في ذلك أوقات الاستراحة وأيام العطل.', completed: false },
  { id: '3', category: 'محتوى', title: 'رفع 10 صور احترافية', description: 'الصور الواضحة تزيد التفاعل بنسبة 35% في السوق العراقي.', completed: false },
  { id: '4', category: 'محتوى', title: 'كتابة وصف SEO', description: 'استخدم كلمات يبحث عنها العراقيون (مثلاً: أفضل مطعم في المنصور).', completed: false },
  { id: '5', category: 'تفاعل', title: 'الرد على كافة التقييمات', description: 'استخدم "مولد الردود" للرد على الزبائن فوراً وبلهجة عراقية محببة.', completed: false },
  { id: '6', category: 'متقدم', title: 'إضافة المنتجات والخدمات', description: 'حول صفحتك إلى متجر متكامل يعرض ما تقدمه مع الأسعار.', completed: false },
];

const SOPManager: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('rankly_sop_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks(INITIAL_TASKS);
    }
  }, []);

  const toggleTask = (id: string) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(newTasks);
    localStorage.setItem('rankly_sop_tasks', JSON.stringify(newTasks));
  };

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-transition">
      <header className="relative p-8 bg-brand-gray rounded-3xl border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">خطة النجاح (SOP) 🚀</h2>
          <p className="text-white/50 mb-6">اتبع هذه الخطوات للسيطرة على نتائج البحث في منطقتك.</p>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-brand-black rounded-full overflow-hidden">
              <div className="h-full bg-brand-gold transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="font-black text-brand-gold">{progress}%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {['أساسيات', 'محتوى', 'تفاعل', 'متقدم'].map(cat => (
          <div key={cat} className="space-y-3">
            <h3 className="text-sm font-bold text-white/30 mr-2 uppercase tracking-widest">{cat}</h3>
            {tasks.filter(t => t.category === cat).map(task => (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`group cursor-pointer p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  task.completed ? 'bg-brand-gold/5 border-brand-gold/20 opacity-60' : 'bg-brand-gray border-white/5 hover:border-brand-gold/30'
                }`}
              >
                <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  task.completed ? 'bg-brand-gold border-brand-gold text-brand-black' : 'border-white/10 group-hover:border-brand-gold/50'
                }`}>
                  {task.completed && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOPManager;
