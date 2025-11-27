
import React from 'react';
import { Video, BookOpen, Trophy, ClipboardList, Calendar, User, ShieldCheck, Activity, Users, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { TESTIMONIALS } from '../../constants';

interface Props {
  onNavigate: (view: string) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const LandingPage: React.FC<Props> = ({ onNavigate, darkMode, toggleTheme }) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} overflow-x-hidden font-sans`}>
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass px-6 py-4 flex justify-between items-center transition-all duration-300">
         <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">E</div>
            <div className="text-3xl font-black font-edupro tracking-tighter">Edu<span className="text-blue-600">Pro</span></div>
         </div>
         <div className="flex gap-4">
             <button onClick={() => onNavigate('auth')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-100 px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-500/25">Login / Sign Up</button>
         </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-blob"/>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"/>
          
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div className="animate-slide-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6 border border-blue-100 dark:border-slate-700">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                      AI-Powered Adaptive Learning v2.0
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black leading-tight mb-6 font-edupro tracking-tight">
                      Master <br/>
                      <span className="text-gradient">Any Skill.</span>
                  </h1>
                  <p className="text-xl text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
                      Experience the future of education with real-time AI proctoring, personalized learning paths, and advanced analytics.
                  </p>
                  <div className="flex flex-wrap gap-4">
                      <button onClick={() => onNavigate('auth')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                          Get Started Free <ArrowRight size={20}/>
                      </button>
                      <button onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                          Live Demo
                      </button>
                  </div>
                  <div className="mt-10 flex items-center gap-4 text-sm font-medium text-slate-500">
                      <div className="flex -space-x-3">
                          {[1,2,3,4].map(i => (
                              <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center overflow-hidden">
                                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                              </div>
                          ))}
                      </div>
                      <div className="flex flex-col">
                          <div className="flex text-yellow-500"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                          <span>Trusted by 10,000+ Students</span>
                      </div>
                  </div>
              </div>
              
              <div className="relative animate-float">
                  <div className="glass-card p-4 rounded-[2rem] relative z-10 transform rotate-[-2deg] hover:rotate-0 transition-all duration-500">
                      <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Dashboard Preview" className="rounded-3xl w-full object-cover shadow-2xl" />
                      
                      {/* Floating Badge 1 */}
                      <div className="absolute -top-8 -right-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce duration-[3000ms]">
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600"><ShieldCheck size={24}/></div>
                          <div>
                              <div className="font-bold text-slate-800 dark:text-white">Secure Exam</div>
                              <div className="text-xs text-slate-500">Face Detection Active</div>
                          </div>
                      </div>

                      {/* Floating Badge 2 */}
                      <div className="absolute -bottom-8 -left-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce duration-[4000ms]">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600"><Activity size={24}/></div>
                          <div>
                              <div className="font-bold text-slate-800 dark:text-white">Real-time Data</div>
                              <div className="text-xs text-slate-500">Tracking Progress</div>
                          </div>
                      </div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -z-10 top-10 right-10 w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2.5rem] transform rotate-3"></div>
              </div>
          </div>
      </section>

      {/* Functional Modules Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/50 relative">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                  <h2 className="text-4xl font-black font-edupro mb-4">Everything You Need To Excel</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">Our platform combines state-of-the-art technology with pedagogical expertise to deliver an unmatched learning experience.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                  <FeatureIcon icon={<Video size={32} className="text-white"/>} color="bg-red-500" title="Live Classes" onClick={() => onNavigate('auth')} delay={0} />
                  <FeatureIcon icon={<BookOpen size={32} className="text-white"/>} color="bg-blue-500" title="Digital Library" onClick={() => onNavigate('auth')} delay={100} />
                  <FeatureIcon icon={<Trophy size={32} className="text-white"/>} color="bg-yellow-500" title="Leaderboard" onClick={() => onNavigate('auth')} delay={200} />
                  <FeatureIcon icon={<ClipboardList size={32} className="text-white"/>} color="bg-purple-500" title="Quizzes" onClick={() => onNavigate('auth')} delay={300} />
                  <FeatureIcon icon={<Calendar size={32} className="text-white"/>} color="bg-green-500" title="Scheduling" onClick={() => onNavigate('auth')} delay={400} />
                  <FeatureIcon icon={<User size={32} className="text-white"/>} color="bg-pink-500" title="Student Profile" onClick={() => onNavigate('auth')} delay={500} />
                  <FeatureIcon icon={<Activity size={32} className="text-white"/>} color="bg-orange-500" title="Analytics" onClick={() => onNavigate('auth')} delay={600} />
                  <FeatureIcon icon={<Users size={32} className="text-white"/>} color="bg-teal-500" title="Parent Portal" onClick={() => onNavigate('auth')} delay={700} />
              </div>
          </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-black font-edupro text-center mb-16">Community Success</h2>
              <div className="grid md:grid-cols-3 gap-8">
                  {TESTIMONIALS.slice(0, 3).map((t, i) => (
                      <div key={i} className="glass p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-2 transition duration-300">
                          <div className="flex gap-1 mb-6">
                              {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-yellow-400" fill="currentColor"/>)}
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">"{t.text}"</p>
                          <div className="flex items-center gap-4">
                              <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-white dark:ring-slate-800"/>
                              <div>
                                  <div className="font-bold text-lg">{t.name}</div>
                                  <div className="text-xs text-blue-500 font-bold uppercase tracking-wider">{t.role}</div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
                     <div className="text-2xl font-black text-white font-edupro">EduPro</div>
                  </div>
                  <p className="leading-relaxed mb-6">Empowering the next generation of learners with AI-driven education technology.</p>
                  <div className="flex gap-4">
                      {/* Social placeholders */}
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">X</div>
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">in</div>
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">fb</div>
                  </div>
              </div>
              <div>
                  <h4 className="text-white font-bold mb-6 font-edupro text-lg">Platform</h4>
                  <ul className="space-y-4">
                      <li className="hover:text-white cursor-pointer transition">Browse Courses</li>
                      <li className="hover:text-white cursor-pointer transition">Live Proctoring</li>
                      <li className="hover:text-white cursor-pointer transition">Pricing Plans</li>
                      <li className="hover:text-white cursor-pointer transition">For Schools</li>
                  </ul>
              </div>
              <div>
                  <h4 className="text-white font-bold mb-6 font-edupro text-lg">Resources</h4>
                  <ul className="space-y-4">
                      <li className="hover:text-white cursor-pointer transition">Documentation</li>
                      <li className="hover:text-white cursor-pointer transition">Help Center</li>
                      <li className="hover:text-white cursor-pointer transition">Community</li>
                      <li className="hover:text-white cursor-pointer transition">Developer API</li>
                  </ul>
              </div>
              <div>
                  <h4 className="text-white font-bold mb-6 font-edupro text-lg">Legal</h4>
                  <ul className="space-y-4">
                      <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
                      <li className="hover:text-white cursor-pointer transition">Terms of Service</li>
                      <li className="hover:text-white cursor-pointer transition">Cookie Settings</li>
                  </ul>
              </div>
          </div>
          <div className="text-center pt-8 border-t border-slate-800 text-sm">
              © 2024 EduPro Systems Inc. All rights reserved.
          </div>
      </footer>
    </div>
  );
};

const FeatureIcon = ({ icon, color, title, onClick, delay }: any) => (
    <div 
        onClick={onClick} 
        style={{ animationDelay: `${delay}ms` }}
        className="bg-white dark:bg-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center gap-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl animate-fade-in group border border-slate-100 dark:border-slate-700"
    >
        <div className={`p-5 ${color} rounded-2xl shadow-lg group-hover:scale-110 transition duration-300`}>{icon}</div>
        <div className="font-bold text-lg text-slate-800 dark:text-slate-200">{title}</div>
    </div>
);

export default LandingPage;
