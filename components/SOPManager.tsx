
import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  category: string;
  title: string;
  description: string;
  longDescription: string;
  impact: 'عالي' | 'متوسط' | 'أساسي';
  tip: string;
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  { 
    id: '1', 
    category: 'أساسيات', 
    title: 'تأكيد ملكية النشاط', 
    description: 'تأكد من تفعيل حسابك رسمياً عبر كود جوجل.',
    longDescription: 'بدون هذه الخطوة، يعتبر نشاطك "غير موثق" وقد يتم حذفه أو تغييره من قبل الغرباء. التوثيق يمنحك السيطرة الكاملة ويفتح لك ميزات الإحصائيات.',
    impact: 'أساسي',
    tip: 'إذا تأخر وصول الكود البريدي، استخدم خيار "الدعم الفني" لتوثيق النشاط عبر فيديو للمكان.',
    completed: false 
  },
  { 
    id: '2', 
    category: 'أساسيات', 
    title: 'تحديث ساعات العمل', 
    description: 'أضف ساعات العمل بدقة، بما في ذلك الاستراحات.',
    longDescription: 'جوجل يعطي أولوية للنشاطات "المفتوحة الآن". دقة المواعيد تمنع التقييمات السلبية الناتجة عن ذهاب الزبون ووجد المكان مغلقاً.',
    impact: 'عالي',
    tip: 'لا تنسَ تحديث المواعيد في أيام العطل الرسمية والمناسبات مثل عيد الفطر أو محرم.',
    completed: false 
  },
  { 
    id: '3', 
    category: 'محتوى', 
    title: 'رفع 10 صور احترافية', 
    description: 'الصور الواضحة تزيد التفاعل بنسبة 35% في العراق.',
    longDescription: 'الزبون العراقي "يشتري بعينه". رفع صور للواجهة، الديكور الداخلي، والمنتجات يبني ثقة فورية قبل أن يزورك الزبون.',
    impact: 'عالي',
    tip: 'تأكد من تصوير "الواجهة الخارجية" في ضوء النهار ليتمكن الزبائن من التعرف على مكانك بسهولة عند الوصول.',
    completed: false 
  },
  { 
    id: '4', 
    category: 'محتوى', 
    title: 'كتابة وصف SEO ذكي', 
    description: 'استخدم كلمات يبحث عنها الزبائن محلياً.',
    longDescription: 'الوصف هو المكان الذي تخبر فيه محرك البحث عن تخصصك. بدلاً من "مطعم"، اكتب "أفضل مطعم كص ولحم في بغداد المنصور".',
    impact: 'عالي',
    tip: 'تجنب حشو الكلمات بشكل عشوائي. اكتب نصاً طبيعياً يحتوي على اسم منطقتك وأهم 3 خدمات تقدمها.',
    completed: false 
  },
  { 
    id: '5', 
    category: 'تفاعل', 
    title: 'الرد على كافة التقييمات', 
    description: 'استخدم الذكاء الاصطناعي للرد بلهجة محببة.',
    longDescription: 'تفاعل صاحب العمل مع التقييمات يرسل إشارة لجوجل أن هذا النشاط حي ويهتم بالزبائن، مما يرفع ترتيبك في القائمة.',
    impact: 'متوسط',
    tip: 'حتى لو كان التقييم سلبياً، رد ببرود وبأخلاق عالية. هذا يظهر للزبائن الجدد أنك شخص محترف.',
    completed: false 
  },
  { 
    id: '6', 
    category: 'متقدم', 
    title: 'إضافة المنتجات والخدمات', 
    description: 'حول صفحتك إلى متجر رقمي متكامل.',
    longDescription: 'تتيح لك هذه الميزة عرض أسعارك وقائمة خدماتك مباشرة في نتائج البحث، مما يقلل من أسئلة "بكم هذا؟" ويزيد من جاهزية الزبون للشراء.',
    impact: 'متوسط',
    tip: 'أضف صوراً مخصصة لكل منتج مع وصف مختصر وسعر واضح لجذب الانتباه.',
    completed: false 
  },
];

const SOPManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('rankly_sop_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks(INITIAL_TASKS);
    }
  }, []);

  const toggleTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(newTasks);
    localStorage.setItem('rankly_sop_tasks', JSON.stringify(newTasks));
  };

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-12 page-transition pb-32" dir="rtl">
      {/* Header Section */}
      <header className="relative p-10 bg-[#0C0C0C] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-gold/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-right space-y-4">
            <h2 className="text-4xl font-black tracking-tight text-white flex items-center gap-4">
              خارطة طريق Rankly
              <span className="text-brand-gold">IQ</span>
            </h2>
            <p className="text-white/50 text-lg max-w-lg leading-relaxed font-medium">
              هذا الدليل مصمم بناءً على تحليل أكثر من <span className="text-brand-gold">1000 نشاط تجاري</span> ناجح في العراق. اتبع الخطوات لتتصدر منطقتك.
            </p>
          </div>
          
          <div className="relative w-40 h-40 flex items-center justify-center bg-white/5 rounded-full p-4 border border-white/5 shadow-inner">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="74" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle 
                cx="80" cy="80" r="74" 
                fill="none" 
                stroke="#FFC300" 
                strokeWidth="10" 
                strokeDasharray="465" 
                strokeDashoffset={465 - (465 * progress / 100)} 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{progress}%</span>
              <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">الإنجاز</span>
            </div>
          </div>
        </div>
      </header>

      {/* Information Pillar Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {[
           { label: 'أساسي', color: 'text-blue-400', desc: 'لا يمكن الظهور بدونه' },
           { label: 'عالي الأثر', color: 'text-brand-gold', desc: 'يرفع ترتيبك فوراً' },
           { label: 'متوسط', color: 'text-green-400', desc: 'يحسن تجربة الزبون' }
         ].map(p => (
           <div key={p.label} className="bg-[#0C0C0C] p-4 rounded-2xl border border-white/5 flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${p.color.replace('text', 'bg')}`}></div>
             <div>
               <p className={`text-[10px] font-black uppercase ${p.color}`}>{p.label}</p>
               <p className="text-[11px] text-white/30">{p.desc}</p>
             </div>
           </div>
         ))}
      </section>

      {/* Tasks List */}
      <div className="space-y-12">
        {['أساسيات', 'محتوى', 'تفاعل', 'متقدم'].map(cat => (
          <div key={cat} className="space-y-6">
            <div className="flex items-center gap-4 px-2">
               <h3 className="text-sm font-black text-brand-gold uppercase tracking-[0.4em]">{cat}</h3>
               <div className="flex-1 h-px bg-gradient-to-l from-brand-gold/20 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {tasks.filter(t => t.category === cat).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
                  className={`group relative p-6 rounded-[2.5rem] border transition-all duration-500 overflow-hidden cursor-pointer ${
                    expandedId === task.id 
                    ? 'bg-[#121212] border-brand-gold/30 shadow-2xl scale-[1.01]' 
                    : 'bg-[#0C0C0C] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-6 relative z-10">
                    {/* Checkbox Container */}
                    <button 
                      onClick={(e) => toggleTask(task.id, e)}
                      className={`mt-1 w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        task.completed 
                        ? 'bg-brand-gold border-brand-gold text-black shadow-[0_0_20px_rgba(255,195,0,0.3)]' 
                        : 'border-white/10 group-hover:border-brand-gold/30'
                      }`}
                    >
                      {task.completed ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 bg-white/5 rounded-full group-hover:bg-brand-gold/40"></div>
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                         <h4 className={`text-xl font-black transition-all ${
                           task.completed ? 'text-white/20 line-through' : 'text-white'
                         }`}>
                           {task.title}
                         </h4>
                         <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                           task.impact === 'أساسي' ? 'bg-blue-500/10 text-blue-400' :
                           task.impact === 'عالي' ? 'bg-brand-gold/10 text-brand-gold' :
                           'bg-green-500/10 text-green-400'
                         }`}>
                           {task.impact}
                         </span>
                      </div>
                      <p className={`text-sm font-medium ${task.completed ? 'text-white/10' : 'text-white/40'}`}>
                        {task.description}
                      </p>
                    </div>
                    
                    <div className={`mt-2 transition-transform duration-500 ${expandedId === task.id ? 'rotate-180' : ''}`}>
                       <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div className={`grid transition-all duration-500 ease-in-out ${
                    expandedId === task.id ? 'grid-rows-[1fr] opacity-100 mt-8 pt-8 border-t border-white/5' : 'grid-rows-[0fr] opacity-0'
                  }`}>
                    <div className="overflow-hidden space-y-6">
                       <div className="space-y-3">
                         <h5 className="text-xs font-black text-brand-gold uppercase tracking-widest">لماذا هذه الخطوة؟</h5>
                         <p className="text-white/60 text-sm leading-relaxed text-justify">
                           {task.longDescription}
                         </p>
                       </div>
                       
                       <div className="p-5 bg-brand-gold/5 rounded-3xl border border-brand-gold/10 flex gap-4">
                          <div className="w-10 h-10 bg-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold shrink-0">
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-brand-gold uppercase tracking-widest mb-1">نصيحة الخبير</p>
                            <p className="text-xs text-white/80 font-medium leading-relaxed italic">
                              "{task.tip}"
                            </p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Final Footer Call to Action */}
      <div className="text-center space-y-6 pt-10">
         <div className="inline-block px-6 py-2 bg-white/5 rounded-full border border-white/5">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Built for Iraqi Growth 🇮🇶</p>
         </div>
         <p className="text-white/20 text-xs font-medium max-w-sm mx-auto">
           تذكر أن خوارزمية جوجل تتغير باستمرار، لكن الصدق والدقة في المعلومات هما المفتاح الدائم للنجاح.
         </p>
      </div>
    </div>
  );
};

export default SOPManager;
