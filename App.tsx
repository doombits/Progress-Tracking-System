
import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, LayoutDashboard, UserCheck, ShieldAlert, TrendingUp, 
  MessageSquare, Award, Menu, Bell, LogOut, CheckCircle, 
  AlertTriangle, PlayCircle, Star, Video, Mic, MicOff, PhoneOff,
  ChevronLeft, Timer, Lock, Users, BarChart2, Library, GraduationCap, 
  Download, FileText, Mail, FileBarChart, Clock, Moon, Sun, ArrowRight,
  Monitor, Smartphone, Globe, Activity, Eye, Play, X, VideoOff, Settings,
  Calendar, Info, List, Send, Flag, CheckSquare, XCircle, User as UserIcon, Lock as LockIcon, Trophy, Bot, HelpCircle
} from 'lucide-react';
import { db } from './services/dbService';
import { generateQuizQuestions, chatWithTutor } from './services/geminiService';
import { User, UserRole, Course, Topic, Message, Book, Recording, ExamSchedule, QuizResult, ReportCard, AttendanceRecord } from './types';
import { MOCK_USERS, DAILY_STUDY_GOAL_HOURS, MOCK_BOOKS, MOCK_RECORDINGS, MOCK_TUTORS, TESTIMONIALS, MOCK_COURSES, MOCK_REPORT_CARDS, MOCK_MESSAGES } from './constants';
import ProctoringModule from './components/ProctoringModule';
import { StudyTrendChart, PerformanceRadar, ActivityHeatmap, DifficultyScatter, WeeklyProgressChart, TimeSpentChart, LearningMasteryChart, StreakAreaChart, RankRadialChart } from './components/Charts';

// New Modular Components
import Header from './components/common/Header';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import LandingPage from './components/landing/LandingPage';
import LiveClassRoom from './components/live-class/LiveClassRoom';
import LibraryView from './components/library/LibraryView';

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState('landing'); 
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeExamSchedule, setActiveExamSchedule] = useState<ExamSchedule | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<string[]>(['landing']);
  const [darkMode, setDarkMode] = useState(false);
  const studyTimerRef = useRef<any>(null);

  // --- DARK MODE LOGIC ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- GLOBAL STUDY TIMER ---
  useEffect(() => {
    if (currentUser && currentUser.role === UserRole.STUDENT) {
        studyTimerRef.current = setInterval(() => {
            db.logStudyTime(currentUser.id, 1); // Log 1 minute
            
            // Check 8-Hour Rule
            const minutesToday = db.getStudyTimeToday(currentUser.id);
            if (minutesToday < (DAILY_STUDY_GOAL_HOURS * 60) && minutesToday % 60 === 0 && minutesToday > 0) {
                 db.createNotification(currentUser.id, "Study Goal Alert", "You are lagging behind your 8-hour daily goal.", 'WARNING');
            }
        }, 60000);
    } else {
        if (studyTimerRef.current) clearInterval(studyTimerRef.current);
    }
    return () => { if (studyTimerRef.current) clearInterval(studyTimerRef.current); };
  }, [currentUser]);

  // --- NAVIGATION LOGIC ---
  const navigate = (newView: string) => {
    if (newView === view) return;
    setHistory(prev => [...prev, newView]);
    setView(newView);
    setSidebarOpen(false);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); 
      const prev = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setView(prev);
    } else {
      if (currentUser) {
          if (currentUser.role === UserRole.STUDENT) navigate('dashboard');
          else if (currentUser.role === UserRole.PARENT) navigate('parent');
          else if (currentUser.role === UserRole.TEACHER) navigate('admin');
          else navigate('admin');
      } else navigate('landing');
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.STUDENT) navigate('dashboard');
    else if (user.role === UserRole.PARENT) navigate('parent');
    else if (user.role === UserRole.TEACHER) navigate('admin');
    else navigate('admin');
    
    // Log attendance
    db.logAttendance(user.id, 'LOGIN', 0);
  };

  const logout = () => {
    setCurrentUser(null);
    setHistory(['landing']);
    setView('landing');
    setSidebarOpen(false);
  };

  // --- RENDER VIEWS ---
  if (view === 'landing') return <LandingPage onNavigate={navigate} darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />;
  if (view === 'auth') return <AuthPage onLogin={handleLoginSuccess} onBack={goBack} darkMode={darkMode} />;
  
  // FULL SCREEN LIVE CLASS MODE (No Sidebar/Header)
  if (view === 'live' && currentUser) {
      return (
        <LiveClassRoom 
            user={currentUser} 
            facultyName="Prof. Narshimha"
            onLeave={() => goBack()} 
        />
      );
  }

  // FULL SCREEN ACTIVE EXAM MODE
  if (view === 'active-exam' && activeExamSchedule && currentUser) {
      return <ActiveExamPlayer user={currentUser} schedule={activeExamSchedule} onBack={() => { navigate('dashboard'); }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-300">
      
      {/* Role-Based Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out w-64 bg-slate-900 text-white z-40 flex flex-col h-full shadow-xl`}>
        <div className="p-6 border-b border-slate-700 hidden md:flex justify-between items-center">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('dashboard')}>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">E</div>
                <div className="text-xl font-black font-edupro tracking-tight">Edu<span className="text-blue-400">Pro</span></div>
            </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {currentUser?.role === UserRole.STUDENT && (
                <>
                    <NavItem icon={<LayoutDashboard/>} label="Dashboard" active={view === 'dashboard'} onClick={() => navigate('dashboard')}/>
                    <NavItem icon={<BookOpen/>} label="My Courses" active={view === 'courses' || view === 'course-player'} onClick={() => navigate('courses')}/>
                    <NavItem icon={<Library/>} label="Library" active={view === 'library'} onClick={() => navigate('library')}/>
                    <NavItem icon={<PlayCircle/>} label="Recorded Lectures" active={view === 'recordings'} onClick={() => navigate('recordings')}/>
                    <NavItem icon={<Video/>} label="Live Classes" active={view === 'live'} onClick={() => navigate('live')}/>
                    <NavItem icon={<ShieldAlert/>} label="Exams & Quizzes" active={view === 'quizzes'} onClick={() => navigate('quizzes')}/>
                    <NavItem icon={<Award/>} label="Leaderboard" active={view === 'leaderboard'} onClick={() => navigate('leaderboard')}/>
                    <NavItem icon={<MessageSquare/>} label="Message Tutor" active={view === 'chat'} onClick={() => navigate('chat')}/>
                </>
            )}
            {currentUser?.role === UserRole.TEACHER && (
                <>
                    <NavItem icon={<LayoutDashboard/>} label="Faculty Dashboard" active={view === 'admin'} onClick={() => navigate('admin')}/>
                    <NavItem icon={<Video/>} label="Take Live Class" active={view === 'live'} onClick={() => navigate('live')}/>
                    <NavItem icon={<Calendar/>} label="Schedule Exam" active={view === 'schedule-exam'} onClick={() => navigate('schedule-exam')}/>
                    <NavItem icon={<BookOpen/>} label="Manage Library" active={view === 'library'} onClick={() => navigate('library')}/>
                    <NavItem icon={<Users/>} label="Student List" active={view === 'student-list'} onClick={() => navigate('student-list')}/>
                    <NavItem icon={<Mail/>} label="Talk to Parents" active={view === 'messages'} onClick={() => navigate('messages')}/>
                </>
            )}
            {currentUser?.role === UserRole.PARENT && (
                <>
                    <NavItem icon={<LayoutDashboard/>} label="Parent Dashboard" active={view === 'parent'} onClick={() => navigate('parent')}/>
                    <NavItem icon={<AlertTriangle/>} label="Alerts & Logs" active={view === 'alerts'} onClick={() => navigate('alerts')}/>
                    <NavItem icon={<FileBarChart/>} label="Report Card" active={view === 'report-card'} onClick={() => navigate('report-card')}/>
                    <NavItem icon={<Clock/>} label="Attendance" active={view === 'attendance'} onClick={() => navigate('attendance')}/>
                    <NavItem icon={<MessageSquare/>} label="Talk to Tutor" active={view === 'messages'} onClick={() => navigate('messages')}/>
                </>
            )}
            {currentUser?.role === UserRole.ADMIN && (
                <>
                    <NavItem icon={<LayoutDashboard/>} label="Admin Panel" active={view === 'admin'} onClick={() => navigate('admin')}/>
                    <NavItem icon={<Users/>} label="Manage Users" active={false} onClick={() => {}}/>
                    <NavItem icon={<ShieldAlert/>} label="Proctoring Logs" active={false} onClick={() => {}}/>
                </>
            )}
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-900">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">{currentUser?.name[0]}</div>
                <div>
                    <div className="text-sm font-medium">{currentUser?.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{currentUser?.role.toLowerCase()}</div>
                </div>
            </div>
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 transition p-2 hover:bg-slate-800 rounded"><LogOut size={16}/> Sign Out</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-slate-50 dark:bg-slate-900 relative">
         <Header 
            user={currentUser} 
            darkMode={darkMode} 
            toggleTheme={() => setDarkMode(!darkMode)} 
            toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
            canGoBack={history.length > 2 && view !== 'dashboard' && view !== 'admin' && view !== 'parent'}
            onGoBack={goBack}
            onLogout={logout}
         />

         <div className="p-4 md:p-8 w-full mx-auto max-w-7xl">
            {view === 'dashboard' && currentUser && <StudentDashboard user={currentUser} onViewCourse={() => navigate('courses')} />}
            {view === 'courses' && <CourseList onSelect={(c: any) => { setActiveCourse(c); navigate('course-player'); }} />}
            {view === 'library' && <LibraryView user={currentUser} />}
            {view === 'recordings' && <RecordingsView />}
            {view === 'quizzes' && currentUser && <ExamListView user={currentUser} onSelect={(s) => { setActiveExamSchedule(s); navigate('exam-instruction'); }} />}
            {view === 'exam-instruction' && activeExamSchedule && <ExamInstructionView schedule={activeExamSchedule} onStart={() => navigate('active-exam')} onBack={() => goBack()} />}
            {view === 'course-player' && activeCourse && currentUser && <CoursePlayer user={currentUser} course={activeCourse} onBack={() => goBack()} />}
            {view === 'chat' && currentUser && <MessagingSystem user={currentUser} />}
            {view === 'admin' && currentUser && <TeacherDashboard user={currentUser} onNavigate={navigate} />}
            {view === 'parent' && currentUser && <ParentDashboard user={currentUser} />}
            {view === 'alerts' && currentUser && <ParentAlertsView user={currentUser} />}
            {view === 'report-card' && currentUser && <ReportCardView user={currentUser}/>}
            {view === 'attendance' && currentUser && <AttendanceView user={currentUser}/>}
            {view === 'messages' && currentUser && <MessagingSystem user={currentUser} />}
            {view === 'student-list' && <StudentListView />}
            {view === 'leaderboard' && <LeaderboardView />}
            {view === 'schedule-exam' && <TeacherExamScheduler onSchedule={() => { alert('Exam Scheduled Successfully!'); navigate('admin'); }} />}
         </div>

         {/* AI TUTOR WIDGET (Always present for students) */}
         {currentUser?.role === UserRole.STUDENT && <AITutorWidget user={currentUser} />}
      </main>
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        {icon} <span className="font-medium">{label}</span>
    </button>
)

// --- AI TUTOR WIDGET ---
const AITutorWidget = ({user}: {user: User}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
        {role: 'model', text: `Hi ${user.name}! I'm your AI Tutor. Need help with Python, Math, or Physics?`}
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if(!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
        setInput('');
        setLoading(true);

        const aiResponse = await chatWithTutor(
            messages.map(m => ({role: m.role, parts: [{text: m.text}]})),
            userMsg
        );
        
        setMessages(prev => [...prev, {role: 'model', text: aiResponse}]);
        setLoading(false);
    }

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
            {isOpen && (
                <div className="bg-white dark:bg-slate-800 w-80 md:w-96 h-[400px] rounded-2xl shadow-2xl border dark:border-slate-700 flex flex-col mb-4 pointer-events-auto animate-slide-up overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex justify-between items-center">
                        <div className="flex items-center gap-2"><Bot size={20}/> AI Tutor</div>
                        <button onClick={() => setIsOpen(false)}><X size={18}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm rounded-bl-none'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-xs text-slate-400 ml-2 animate-pulse">AI is typing...</div>}
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 border-t dark:border-slate-700 flex gap-2">
                        <input 
                            className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-lg px-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                            placeholder="Ask a doubt..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} disabled={loading} className="p-2 bg-blue-600 text-white rounded-lg"><Send size={16}/></button>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:scale-105 transition pointer-events-auto flex items-center gap-2 font-bold">
                 {isOpen ? <X size={24}/> : <><Bot size={28}/> <span className="hidden md:inline">Ask AI Tutor</span></>}
            </button>
        </div>
    )
}

// --- DASHBOARD ---
const StudentDashboard = ({ user, onViewCourse }: { user: User, onViewCourse: () => void }) => {
    const studyMinutes = db.getStudyTimeToday(user.id);
    const studyHours = (studyMinutes / 60).toFixed(1);
    const goalMet = studyMinutes >= (DAILY_STUDY_GOAL_HOURS * 60);
    
    // Calculate Mock Rank based on XP (Simulated 100 students)
    const rank = Math.max(1, 100 - Math.floor((user.xp / 5000) * 100));

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {!goalMet && (
                <div className="bg-red-500 text-white p-4 rounded-xl flex items-center justify-between shadow-lg animate-pulse">
                     <div className="flex items-center gap-3 font-bold">
                        <AlertTriangle />
                        Warning: You haven't completed your daily 8-hour study streak! ({studyHours}/8 hrs)
                     </div>
                </div>
            )}
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Welcome, {user.name} 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400">Your AI learning path is optimized. Let's get to work.</p>
                </div>
                <button onClick={onViewCourse} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/30 flex items-center gap-2">
                    <PlayCircle size={20}/> Resume Learning
                </button>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. RANK CARD */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={80}/></div>
                    <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 w-full">Class Rank</h3>
                    <div className="flex-1 w-full flex items-center justify-center">
                        <RankRadialChart rank={rank} total={100} />
                    </div>
                </div>

                {/* 2. STREAK CARD */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden lg:col-span-2">
                    <div className="flex justify-between items-start mb-2">
                         <div>
                            <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">Study Streak</h3>
                            <div className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                {user.streakDays} Days <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-lg font-bold">Top 5%</span>
                            </div>
                         </div>
                         <div className="p-3 bg-orange-100 text-orange-500 rounded-xl"><TrendingUp size={24}/></div>
                    </div>
                    <div className="h-48 w-full -ml-2">
                         <StreakAreaChart />
                    </div>
                </div>

                {/* 3. XP CARD */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div>
                        <h3 className="text-blue-100 font-bold mb-1">Total XP</h3>
                        <div className="text-4xl font-black">{user.xp.toLocaleString()}</div>
                    </div>
                    <div className="mt-6">
                        <div className="flex justify-between text-xs font-bold mb-1 opacity-80">
                            <span>Level 12</span>
                            <span>Level 13</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs mt-2 opacity-70">350 XP to next level</p>
                    </div>
                </div>

                {/* 4. PERFORMANCE RADAR */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 lg:col-span-2">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="text-purple-500"/> Skill Proficiency
                    </h3>
                    <PerformanceRadar />
                </div>

                {/* 5. LEARNING VELOCITY */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 lg:col-span-2">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart2 className="text-blue-500"/> Subject Mastery
                    </h3>
                    <WeeklyProgressChart />
                </div>
            </div>
        </div>
    );
}

// --- NEW TEACHER EXAM SCHEDULER (ADVANCED) ---

const TeacherExamScheduler = ({ onSchedule }: { onSchedule: () => void }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('45');
    const [strictMode, setStrictMode] = useState(true);
    const [questionCount, setQuestionCount] = useState('10');
    const [topic, setTopic] = useState('General');

    const handleSchedule = () => {
        if (!title || !date || !time) {
            alert("Please fill all required fields: Title, Date, and Start Time.");
            return;
        }
        
        try {
            const startDateTime = new Date(`${date}T${time}`);
            if(isNaN(startDateTime.getTime())) {
                alert("Invalid Date or Time.");
                return;
            }
            const endDateTime = new Date(startDateTime.getTime() + parseInt(duration) * 60000);

            const newExam: ExamSchedule = {
                id: Date.now().toString(),
                courseId: 'c1', // Mock linking
                title,
                description,
                createdBy: 't1',
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                durationMinutes: parseInt(duration),
                questionCount: parseInt(questionCount),
                strictMode,
                topic,
                isActive: true
            };
            
            db.createExamSchedule(newExam);
            onSchedule();
        } catch (err) {
            console.error(err);
            alert("Error scheduling exam. Please check your inputs.");
        }
    }

    const inputClasses = "w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 dark:text-white";

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2"><Calendar className="text-blue-600"/> Schedule New Exam</h1>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border dark:border-slate-700 space-y-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-500">Exam Title</label>
                        <input className={`${inputClasses} text-lg font-bold`} placeholder="e.g. Advanced AI Mid-Term" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-500">Description</label>
                        <textarea className={`${inputClasses} h-24`} placeholder="Instructions for students..." value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-500">Date</label>
                        <input type="date" className={inputClasses} value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-500">Start Time</label>
                        <input type="time" className={inputClasses} value={time} onChange={e => setTime(e.target.value)} />
                    </div>
                </div>

                {/* Config */}
                <div className="grid grid-cols-3 gap-6">
                     <div>
                        <label className="block text-sm font-bold mb-2 text-slate-500">Duration (mins)</label>
                        <input type="number" className={inputClasses} value={duration} onChange={e => setDuration(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-500">Questions</label>
                        <input type="number" className={inputClasses} value={questionCount} onChange={e => setQuestionCount(e.target.value)} />
                    </div>
                     <div>
                        <label className="block text-sm font-bold mb-2 text-slate-500">Topic Area</label>
                        <select className={inputClasses} value={topic} onChange={e => setTopic(e.target.value)}>
                            <option>Python</option>
                            <option>AI/ML</option>
                            <option>Data Structures</option>
                            <option>Web Dev</option>
                            <option>General</option>
                        </select>
                    </div>
                </div>

                {/* Advanced Toggles */}
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-between border dark:border-slate-600">
                    <div>
                        <h4 className="font-bold flex items-center gap-2"><ShieldAlert size={18}/> Strict Proctoring Mode</h4>
                        <p className="text-xs text-slate-500">Enables Face Detection, Fullscreen enforcement, and Tab-switch blocking.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={strictMode} onChange={e => setStrictMode(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <button onClick={handleSchedule} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition transform hover:scale-[1.01] text-lg">
                    Publish Exam Schedule
                </button>
            </div>
        </div>
    )
}

// --- UPDATED EXAM SYSTEM (INSTRUCTIONS + PLAYER) ---

const ExamListView = ({ user, onSelect }: { user: User, onSelect: (s: ExamSchedule) => void }) => {
    const exams = db.getAvailableExams();
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><ShieldAlert className="text-blue-600"/> Scheduled Exams & Quizzes</h2>
                <div className="text-sm text-slate-500">Auto-synced with Faculty Portal</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed dark:border-slate-700">
                        <Calendar size={48} className="mx-auto text-slate-300 mb-4"/>
                        <p className="text-slate-500 font-bold">No exams scheduled by your teachers yet.</p>
                    </div>
                )}
                {exams.map(e => {
                    const now = new Date();
                    const start = new Date(e.startTime);
                    const end = new Date(e.endTime);
                    const isLocked = now < start;
                    const isExpired = now > end;
                    const hasAttempted = db.hasStudentAttemptedExam(user.id, e.id);
                    
                    return (
                        <div key={e.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700 relative overflow-hidden hover:-translate-y-1 transition group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                            <div className="flex justify-between items-start mb-4 pl-4">
                                <div>
                                    <h3 className="font-bold text-lg leading-tight mb-1">{e.title}</h3>
                                    <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">{e.topic}</span>
                                </div>
                                {hasAttempted ? <CheckCircle className="text-green-500"/> : isLocked ? <Lock className="text-slate-400"/> : isExpired ? <FileText className="text-slate-400"/> : <PlayCircle className="text-green-500"/>}
                            </div>
                            <div className="pl-4 text-sm space-y-3 mb-6 text-slate-600 dark:text-slate-300">
                                <div className="flex items-center gap-2"><Calendar size={14}/> {start.toLocaleDateString()}</div>
                                <div className="flex items-center gap-2"><Clock size={14}/> {start.toLocaleTimeString()} - {end.toLocaleTimeString()}</div>
                                <div className="flex items-center gap-2"><Timer size={14}/> {e.durationMinutes} Mins • {e.questionCount} Qs</div>
                            </div>
                            <div className="pl-4">
                                <button 
                                    onClick={() => !isLocked && !isExpired && !hasAttempted && onSelect(e)}
                                    disabled={isLocked || isExpired || hasAttempted}
                                    className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                                        hasAttempted 
                                        ? 'bg-green-100 text-green-700 cursor-not-allowed dark:bg-green-900/30 dark:text-green-400' 
                                        : isLocked || isExpired 
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-700' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                                    }`}
                                >
                                    {hasAttempted ? <><CheckCircle size={16}/> Submitted</> : isLocked ? `Starts in ${Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60))} hrs` : isExpired ? 'Expired' : <>Start Exam <ArrowRight size={16}/></>}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const ExamInstructionView = ({ schedule, onStart, onBack }: { schedule: ExamSchedule, onStart: () => void, onBack: () => void }) => {
    const [agreed, setAgreed] = useState(false);
    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl animate-fade-in mt-10 border dark:border-slate-700">
             <h1 className="text-3xl font-black mb-2 dark:text-white">{schedule.title}</h1>
             <p className="text-slate-500 mb-8">{schedule.description || 'No description provided.'}</p>
             
             <div className="grid grid-cols-3 gap-4 mb-8">
                 <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl text-center">
                     <div className="text-xs uppercase font-bold text-slate-400">Duration</div>
                     <div className="text-2xl font-black text-slate-800 dark:text-white">{schedule.durationMinutes}m</div>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl text-center">
                     <div className="text-xs uppercase font-bold text-slate-400">Questions</div>
                     <div className="text-2xl font-black text-slate-800 dark:text-white">{schedule.questionCount}</div>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl text-center">
                     <div className="text-xs uppercase font-bold text-slate-400">Mode</div>
                     <div className={`text-xl font-black ${schedule.strictMode ? 'text-red-500' : 'text-green-500'}`}>{schedule.strictMode ? 'Strict' : 'Open'}</div>
                 </div>
             </div>

             <div className="space-y-4 text-slate-700 dark:text-slate-300 mb-10 bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
                 <p className="flex gap-3 font-bold text-red-600"><AlertTriangle className="flex-shrink-0"/> EXAM RULES & REGULATIONS</p>
                 <ul className="list-disc pl-10 space-y-2 text-sm">
                     <li>The exam will run in <b>Full Screen Mode</b>. Exiting full screen will be logged as a violation.</li>
                     <li>Do not switch tabs. The screen will freeze if you leave the tab.</li>
                     <li>Ensure your face is visible at all times. Looking away or covering the camera triggers an alert.</li>
                     <li><b>3 Violations</b> will result in immediate termination of the exam.</li>
                     <li>The exam will auto-submit when the timer ends.</li>
                 </ul>
             </div>
             
             <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer" onClick={() => setAgreed(!agreed)}>
                 <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-400'}`}>
                     {agreed && <CheckSquare size={16} className="text-white"/>}
                 </div>
                 <label className="font-bold cursor-pointer select-none">I have read and agree to the exam rules.</label>
             </div>
             
             <div className="flex gap-4">
                 <button onClick={onBack} className="flex-1 bg-slate-200 dark:bg-slate-700 py-4 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition">Cancel</button>
                 <button onClick={onStart} disabled={!agreed} className={`flex-1 py-4 rounded-xl font-bold text-white transition shadow-lg ${agreed ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1' : 'bg-slate-400 cursor-not-allowed'}`}>Start Exam Now</button>
             </div>
        </div>
    )
}

const ActiveExamPlayer = ({ user, schedule, onBack }: { user: User, schedule: ExamSchedule, onBack: () => void }) => {
    // Dynamically create a topic wrapper for the exam content
    const tempTopic: Topic = { 
        id: schedule.id, 
        title: schedule.title, 
        difficulty: 'Advanced', 
        content: schedule.description, 
        estimatedMinutes: schedule.durationMinutes 
    };
    const tempCourse: Course = { 
        id: 'exam', 
        title: schedule.title, 
        category: 'Exam', 
        description: '', 
        topics: [tempTopic], 
        thumbnail: '', 
        level: 'N/A' 
    };
    
    return (
        <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-900 flex flex-col">
            <div className="p-4 bg-red-600 text-white font-bold flex justify-between items-center shadow-lg">
                <span className="flex items-center gap-2"><Lock size={16}/> SECURE EXAM BROWSER</span>
                <span>{user.name}</span>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
                <CoursePlayer 
                    user={user} 
                    course={tempCourse} 
                    onBack={onBack} 
                    initialMode="quiz" 
                    forceExam={true} 
                    duration={schedule.durationMinutes * 60} 
                />
            </div>
        </div>
    )
}

// --- ADVANCED AUTH PAGE (HIGH GRAPHIC) ---
const AuthPage = ({ onLogin, onBack, darkMode }: { onLogin: (u: User) => void, onBack: () => void, darkMode: boolean }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
    
    // Login Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Strict Signup Fields
    const [sName, setSName] = useState('');
    const [sEmail, setSEmail] = useState('');
    const [pName, setPName] = useState('');
    const [pEmail, setPEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            if (mode === 'signup') {
                if (!validateEmail(sEmail)) {
                    alert("Invalid email format.");
                    setLoading(false);
                    return;
                }

                if (role === UserRole.TEACHER) {
                    const newTeacher = db.createTeacherAccount({ name: sName, email: sEmail, password: newPassword });
                    alert("Faculty Account Created!");
                    onLogin(newTeacher);
                } else {
                    if (!validateEmail(pEmail)) {
                         alert("Parent email required.");
                         setLoading(false);
                         return;
                    }
                    const newUser = db.createLinkedAccounts(
                        { name: sName, email: sEmail, password: newPassword },
                        { name: pName, email: pEmail, password: newPassword }
                    );
                    alert("Account Created! Parent account has been auto-generated and linked.");
                    onLogin(newUser);
                }
            } else {
                const users = db.getUsers();
                const user = users.find(u => u.email === email && u.role === role); 
                
                if (user) {
                    onLogin(user);
                } else {
                    alert("User not found or credentials mismatch. Ensure you selected the correct Role.");
                    setLoading(false);
                }
            }
        }, 1000);
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            const users = db.getUsers();
            const user = users[0];
            alert(`Logged in as ${user.name} via Google`);
            onLogin(user);
        }, 1500);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} flex items-center justify-center p-4 lg:p-0 relative overflow-hidden font-sans`}>
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

             <div className="bg-white dark:bg-slate-800 w-full max-w-[1200px] h-auto min-h-[700px] rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20 dark:border-slate-700 relative z-10 glass-card">
                
                {/* Left Side - 3D Art & Info */}
                <div className="hidden md:flex w-5/12 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900 opacity-90 z-0"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-2xl font-black mb-8 font-edupro tracking-tight">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-lg">E</div> 
                            EduPro
                        </div>
                        <h2 className="text-5xl font-black leading-tight mb-6 animate-slide-up">
                            {mode === 'login' ? "Welcome Back," : "Join the Future"} <br/>
                            <span className="text-blue-200">Learner.</span>
                        </h2>
                        <p className="text-blue-100 text-lg leading-relaxed max-w-sm animate-fade-in opacity-80">
                            {mode === 'login' ? "Access your personalized learning dashboard and continue your journey." : "Create your account today to unlock AI-powered adaptive learning."}
                        </p>
                    </div>

                    {/* Floating Cards Graphic */}
                    <div className="relative z-10 mt-12 animate-float">
                        <div className="glass-card p-4 rounded-2xl mb-4 transform translate-x-4 border border-white/10 bg-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center text-green-300"><CheckCircle size={20}/></div>
                                <div>
                                    <div className="text-sm font-bold text-white">Quiz Completed</div>
                                    <div className="text-xs text-blue-200">Advanced Python - 98%</div>
                                </div>
                            </div>
                        </div>
                         <div className="glass-card p-4 rounded-2xl transform -translate-x-2 border border-white/10 bg-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-300"><Trophy size={20}/></div>
                                <div>
                                    <div className="text-sm font-bold text-white">New Badge Earned</div>
                                    <div className="text-xs text-blue-200">Fast Learner</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-blue-300/60 mt-auto">
                        © 2024 EduPro Systems Inc.
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-white dark:bg-slate-900 relative">
                    <button onClick={onBack} className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition flex items-center gap-1 text-sm font-bold"><ChevronLeft size={16}/> Home</button>
                    
                    <div className="max-w-md mx-auto w-full">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-10 w-full relative">
                            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-700 rounded-xl shadow-sm transition-all duration-300 ease-out ${mode === 'login' ? 'left-1.5' : 'left-[calc(50%+4.5px)]'}`}></div>
                            <button onClick={() => setMode('login')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${mode === 'login' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Secure Login</button>
                            <button onClick={() => setMode('signup')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${mode === 'signup' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Create Account</button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[UserRole.STUDENT, UserRole.PARENT, UserRole.TEACHER].map(r => (
                                <button key={r} onClick={() => setRole(r)} className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all duration-200 ${role === r ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-lg scale-105' : 'border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-300'}`}>
                                    {r === UserRole.STUDENT && <GraduationCap size={24}/>}
                                    {r === UserRole.PARENT && <Users size={24}/>}
                                    {r === UserRole.TEACHER && <Video size={24}/>}
                                    <span className="text-[10px] font-black uppercase tracking-wider">{r}</span>
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                            {mode === 'signup' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group relative">
                                            <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"/>
                                            <input type="text" placeholder="Full Name" value={sName} onChange={e => setSName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium outline-none" required />
                                        </div>
                                        <div className="group relative">
                                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"/>
                                            <input type="email" placeholder="Email" value={sEmail} onChange={e => setSEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium outline-none" required />
                                        </div>
                                    </div>
                                    {role !== UserRole.TEACHER && (
                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                                            <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase mb-3 flex items-center gap-2"><Users size={14}/> Guardian Details Required</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" placeholder="Parent Name" value={pName} onChange={e => setPName(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm outline-none focus:border-yellow-500" required />
                                                <input type="email" placeholder="Parent Email" value={pEmail} onChange={e => setPEmail(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm outline-none focus:border-yellow-500" required />
                                            </div>
                                        </div>
                                    )}
                                    <div className="group relative">
                                        <LockIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"/>
                                        <input type="password" placeholder="Create Strong Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium outline-none" required />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="group relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"/>
                                        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium outline-none" required />
                                    </div>
                                    <div className="group relative">
                                        <LockIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"/>
                                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-medium outline-none" required />
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="button" className="text-sm font-bold text-blue-500 hover:text-blue-600">Forgot Password?</button>
                                    </div>
                                </>
                            )}
                            
                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (mode === 'login' ? "Secure Login" : "Create Account")}
                            </button>
                            
                            {mode === 'login' && (
                                <div className="pt-4">
                                     <div className="relative flex py-2 items-center">
                                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Or continue with</span>
                                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                                    </div>
                                     <button type="button" onClick={handleGoogleLogin} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 p-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-3">
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                        Sign in with Google
                                     </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
             </div>
        </div>
    );
};

// --- LEADERBOARD (DYNAMIC) ---
const LeaderboardView = () => {
    const data = db.getLeaderboardData();
    return (
        <div className="animate-fade-in p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3"><Award className="text-yellow-500" size={40}/> Top Performers</h1>
            <div className="space-y-4">
                {data.map((entry, index) => (
                    <div key={entry.user.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow flex items-center justify-between border-l-4 border-yellow-400">
                        <div className="flex items-center gap-4">
                            <div className="font-black text-2xl text-slate-400 w-8">#{index + 1}</div>
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold">{entry.user.name[0]}</div>
                            <div>
                                <div className="font-bold text-lg">{entry.user.name}</div>
                                <div className="text-xs text-slate-500">{entry.user.badges[0] || 'Rising Star'}</div>
                            </div>
                        </div>
                        <div className="font-black text-2xl text-blue-600">{entry.score} pts</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CourseList = ({ onSelect }: any) => <div className="p-8"><h2 className="text-2xl font-bold mb-4">Courses</h2><div className="grid gap-4">{MOCK_COURSES.map(c => <div key={c.id} onClick={() => onSelect(c)} className="p-4 bg-white shadow rounded cursor-pointer">{c.title}</div>)}</div></div>;

const RecordingsView = () => {
    const [playing, setPlaying] = useState<string | null>(null);
    return (
        <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><PlayCircle className="text-blue-500"/> Recorded Lectures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_RECORDINGS.map(r => (
                    <div key={r.id} onClick={() => setPlaying(r.title)} className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden cursor-pointer hover:-translate-y-1 transition group">
                        <div className="h-40 bg-black relative">
                            <img src={r.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"/>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle size={48} className="text-white opacity-80 group-hover:scale-110 transition"/>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{r.duration}</div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold truncate">{r.title}</h3>
                            <p className="text-sm text-slate-500">{r.instructor}</p>
                            <p className="text-xs text-slate-400 mt-1">{r.date}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Simple Video Modal */}
            {playing && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden relative shadow-2xl">
                         <button onClick={() => setPlaying(null)} className="absolute top-4 right-4 text-white hover:text-red-500 z-10"><X size={32}/></button>
                         <h3 className="absolute top-4 left-4 text-white font-bold text-lg drop-shadow-md">{playing}</h3>
                         <video controls autoPlay className="w-full aspect-video bg-slate-900">
                             <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                             Your browser does not support video.
                         </video>
                    </div>
                </div>
            )}
        </div>
    )
}

const MessagingSystem = ({user}: {user:User}) => {
    const [msgs, setMsgs] = useState<Message[]>(db.getMessages(user.id));
    const [input, setInput] = useState('');

    useEffect(() => {
        const i = setInterval(() => setMsgs(db.getMessages(user.id)), 2000);
        return () => clearInterval(i);
    }, [user.id]);

    const handleSend = () => {
        if(!input.trim()) return;
        // Mock sending to a tutor 't1' if user is student/parent, else to student 'u1'
        const receiver = user.role === UserRole.TEACHER ? 'u1' : 't1'; 
        db.sendMessage({
            id: Date.now().toString(),
            senderId: user.id,
            receiverId: receiver,
            content: input,
            timestamp: new Date().toISOString(),
            read: false
        });
        setInput('');
        setMsgs(db.getMessages(user.id));
    };

    return (
        <div className="p-8 h-[calc(100vh-64px)] flex flex-col animate-fade-in">
             <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><MessageSquare className="text-blue-500"/> Chat with {user.role === UserRole.TEACHER ? 'Parents' : 'Tutor'}</h2>
             <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow border dark:border-slate-700 flex flex-col overflow-hidden">
                 <div className="flex-1 overflow-y-auto p-6 space-y-4">
                     {msgs.length === 0 && <div className="text-center text-slate-400 mt-10">No messages yet. Start conversation.</div>}
                     {msgs.map(m => {
                         const isMe = m.senderId === user.id;
                         return (
                             <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-md px-4 py-2 rounded-xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 rounded-bl-none'}`}>
                                     {m.content}
                                 </div>
                             </div>
                         )
                     })}
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-700 flex gap-2">
                     <input className="flex-1 input-field mb-0" placeholder="Type message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                     <button onClick={handleSend} className="bg-blue-600 text-white p-3 rounded-lg"><Send size={20}/></button>
                 </div>
             </div>
        </div>
    )
}

const StudentListView = () => <div className="p-8"><h2 className="text-2xl font-bold">Student List</h2><div className="text-slate-500">Feature coming soon...</div></div>;

// --- COURSE PLAYER (UPDATED WITH EXAM MODE GRID) ---
const CoursePlayer = ({ user, course, onBack, initialMode = 'learn', forceExam = false, duration = 300 }: { user: User, course: Course, onBack: () => void, initialMode?: 'learn'|'quiz', forceExam?: boolean, duration?: number }) => {
    const [activeTopic, setActiveTopic] = useState<Topic>(course.topics[0]);
    const [mode, setMode] = useState<'learn' | 'quiz'>(initialMode);
    const [proctorMsg, setProctorMsg] = useState('');
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<number[]>([]);
    const [bookmarks, setBookmarks] = useState<boolean[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration); 
    const [currentQIndex, setCurrentQIndex] = useState(0); // For exam nav
    
    useEffect(() => {
        let timer: any;
        if (mode === 'quiz' && !submitted && !isBlocked && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev > 1 ? prev - 1 : 0), 1000);
        } else if (timeLeft === 0 && !submitted && mode === 'quiz') {
            submitQuiz(); 
        }
        return () => clearInterval(timer);
    }, [mode, submitted, isBlocked, timeLeft]);

    useEffect(() => {
        if (mode === 'quiz' && !isBlocked) {
            generateQuizQuestions(activeTopic, forceExam ? 10 : 5).then(q => {
                setQuizQuestions(q);
                setAnswers(new Array(q.length).fill(-1));
                setBookmarks(new Array(q.length).fill(false));
            });
        }
    }, [mode, activeTopic, isBlocked, forceExam]);

    // Anti-Cheat: Block Inspect Element & Copy
    useEffect(() => {
        if (forceExam) {
            const preventRightClick = (e: MouseEvent) => e.preventDefault();
            const preventCopy = (e: ClipboardEvent) => e.preventDefault();
            document.addEventListener('contextmenu', preventRightClick);
            document.addEventListener('copy', preventCopy);
            return () => {
                document.removeEventListener('contextmenu', preventRightClick);
                document.removeEventListener('copy', preventCopy);
            }
        }
    }, [forceExam]);

    const handleBlock = () => {
        setIsBlocked(true);
        setProctorMsg("EXAM TERMINATED: Suspicious activity.");
        setScore(0);
        setSubmitted(true);
        if (user.parentId) db.createNotification(user.parentId, "Exam Terminated", `Exam was auto-submitted due to suspicious activity.`, 'ERROR');
        db.saveQuizResult({ id: Date.now().toString(), studentId: user.id, examId: activeTopic.id, score: 0, maxScore: 100, timestamp: new Date().toISOString(), timeTakenSeconds: duration - timeLeft, topicsCovered: [activeTopic.title], status: 'TERMINATED' });
    }

    const submitQuiz = () => {
        let correct = 0;
        quizQuestions.forEach((q, i) => { if (answers[i] === q.correctIndex) correct++; });
        const finalScore = quizQuestions.length > 0 ? (correct / quizQuestions.length) * 100 : 0;
        setScore(finalScore);
        setSubmitted(true);
        if (user.parentId) db.createNotification(user.parentId, "Exam Completed", `Student completed ${activeTopic.title} with score: ${finalScore.toFixed(0)}%`, 'INFO');
        db.saveQuizResult({ id: Date.now().toString(), studentId: user.id, examId: activeTopic.id, score: finalScore, maxScore: 100, timestamp: new Date().toISOString(), timeTakenSeconds: duration - timeLeft, topicsCovered: [activeTopic.title], status: 'COMPLETED' });
    };

    const toggleBookmark = (idx: number) => {
        const newB = [...bookmarks];
        newB[idx] = !newB[idx];
        setBookmarks(newB);
    };

    return (
        <div className="h-full flex flex-col">
            {mode === 'quiz' && !isBlocked && !submitted && <ProctoringModule user={user} onViolation={setProctorMsg} onBlockUser={handleBlock} />}
            {proctorMsg && <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-xl font-bold z-50 animate-bounce">{proctorMsg}</div>}

            <div className="flex justify-between items-center mb-4 p-4 bg-white dark:bg-slate-800 shadow-sm rounded-lg">
                 {!forceExam ? (
                    <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 dark:text-slate-300"><ChevronLeft size={18}/> Back</button>
                 ) : (
                    <div className="font-bold text-slate-500">Question {currentQIndex + 1} of {quizQuestions.length}</div>
                 )}
                 {mode === 'quiz' && !submitted && <div className={`px-4 py-2 rounded-full font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}><Timer size={16} className="inline mr-2"/> {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</div>}
            </div>
            
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row relative">
                {isBlocked && (
                    <div className="absolute inset-0 z-40 bg-slate-900/95 flex flex-col items-center justify-center text-white text-center p-8">
                        <AlertTriangle size={64} className="text-red-500 mb-4" />
                        <h2 className="text-3xl font-bold text-red-500 mb-2">ACCESS BLOCKED</h2>
                        <p className="text-slate-400 mb-6">Suspicious activity detected. Your exam has been terminated.</p>
                        <button onClick={onBack} className="mt-8 bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg">Return to Dashboard</button>
                    </div>
                )}
                
                {/* SIDEBAR: TOPICS OR QUESTION NAVIGATOR */}
                <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                    {forceExam ? (
                         <div className="p-4">
                             <div className="text-xs font-bold text-slate-400 uppercase mb-4">Question Navigator</div>
                             <div className="grid grid-cols-4 gap-2">
                                 {quizQuestions.map((_, i) => (
                                     <button 
                                        key={i} 
                                        onClick={() => setCurrentQIndex(i)}
                                        className={`h-10 rounded-lg font-bold text-sm border ${
                                            currentQIndex === i ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 
                                            answers[i] !== -1 ? 'bg-blue-600 text-white border-blue-600' : 
                                            bookmarks[i] ? 'bg-yellow-100 text-yellow-600 border-yellow-300' :
                                            'bg-white dark:bg-slate-800 dark:border-slate-700'
                                        }`}
                                     >
                                         {i + 1}
                                         {bookmarks[i] && <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></span>}
                                     </button>
                                 ))}
                             </div>
                             <div className="mt-8 space-y-2 text-xs text-slate-500">
                                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded"></div> Answered</div>
                                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div> Flagged</div>
                                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-slate-300 rounded"></div> Not Visited</div>
                             </div>
                         </div>
                    ) : (
                        <>
                            <div className="p-4 font-bold border-b dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">{course.title}</div>
                            {course.topics.map((t, idx) => (
                                <div key={t.id} onClick={() => { if(!isBlocked && mode !== 'quiz') { setActiveTopic(t); setMode('learn'); setSubmitted(false); } }} className={`p-4 cursor-pointer text-sm border-b dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition ${activeTopic.id === t.id ? 'bg-white dark:bg-slate-800 border-l-4 border-l-blue-500 font-medium' : ''}`}>
                                    {idx + 1}. {t.title}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {mode === 'learn' ? (
                        <div className="prose dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold mb-4">{activeTopic.title}</h2>
                            <p className="text-slate-700 dark:text-slate-300 mb-4">{activeTopic.content}</p>
                            {activeTopic.resources?.map((res, i) => (
                                <button key={i} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300"><Download size={16}/> {res.title}</button>
                            ))}
                            <div className="mt-8">
                                <button onClick={() => setMode('quiz')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Start Practice Quiz</button>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto h-full flex flex-col">
                            {!submitted && quizQuestions.length > 0 ? (
                                forceExam ? (
                                    // FORCE EXAM SINGLE QUESTION VIEW
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <h2 className="text-xl font-bold">Question {currentQIndex + 1}</h2>
                                            <button onClick={() => toggleBookmark(currentQIndex)} className={`flex items-center gap-1 text-sm font-bold ${bookmarks[currentQIndex] ? 'text-yellow-500' : 'text-slate-400'}`}>
                                                <Flag size={18} fill={bookmarks[currentQIndex] ? "currentColor" : "none"}/> {bookmarks[currentQIndex] ? 'Flagged' : 'Flag'}
                                            </button>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-xl border dark:border-slate-600 mb-6 flex-1">
                                            <p className="text-lg font-medium mb-8">{quizQuestions[currentQIndex].question}</p>
                                            <div className="space-y-3">
                                                {quizQuestions[currentQIndex].options.map((opt:string, oi:number) => (
                                                    <button 
                                                        key={oi} 
                                                        onClick={() => { const n = [...answers]; n[currentQIndex] = oi; setAnswers(n); }} 
                                                        className={`w-full text-left p-4 rounded-lg border dark:border-slate-600 transition flex items-center justify-between ${answers[currentQIndex] === oi ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-100'}`}
                                                    >
                                                        {opt}
                                                        {answers[currentQIndex] === oi && <CheckCircle size={18}/>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-auto pt-4 border-t dark:border-slate-700">
                                            <button 
                                                onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))} 
                                                disabled={currentQIndex === 0}
                                                className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 disabled:opacity-50 font-bold"
                                            >
                                                Previous
                                            </button>
                                            {currentQIndex === quizQuestions.length - 1 ? (
                                                <button onClick={submitQuiz} className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700">Submit Exam</button>
                                            ) : (
                                                <button onClick={() => setCurrentQIndex(p => Math.min(quizQuestions.length - 1, p + 1))} className="px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">Next Question</button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    // PRACTICE MODE LIST VIEW
                                    <div className="space-y-6 pb-20">
                                        {quizQuestions.map((q, i) => (
                                            <div key={i} className="bg-slate-50 dark:bg-slate-700 p-6 rounded-xl border dark:border-slate-600">
                                                <p className="font-bold mb-4">{i+1}. {q.question}</p>
                                                <div className="space-y-2">{q.options.map((opt:string, oi:number) => (
                                                    <button key={oi} onClick={() => { const n = [...answers]; n[i] = oi; setAnswers(n); }} className={`w-full text-left p-3 rounded-lg border dark:border-slate-600 ${answers[i] === oi ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{opt}</button>
                                                ))}</div>
                                            </div>
                                        ))}
                                        <button onClick={submitQuiz} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Submit</button>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                                    <Award size={64} className="text-yellow-500 mb-6"/>
                                    <h3 className="text-3xl font-bold mb-4">Exam Completed!</h3>
                                    <div className="text-6xl font-black text-blue-600 mb-6">{score.toFixed(0)}%</div>
                                    <p className="text-slate-500 mb-8">Your results have been recorded.</p>
                                    <button onClick={onBack} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold">Return to Dashboard</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const ParentDashboard = ({ user }: { user: User }) => {
    const childId = user.childId;
    const child = childId ? db.getUserById(childId) : null;
    const alerts = user.id ? db.getAlertsForParent(user.id) : [];
    const unreadAlerts = alerts.filter(a => !a.read).length;

    if (!child) return <div className="p-8">No student linked.</div>;

    return (
        <div className="animate-fade-in space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Parent Dashboard</h1>
                <p className="text-slate-500">Monitoring progress for: <span className="font-bold text-blue-600">{child.name}</span></p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-full ${unreadAlerts > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            <AlertTriangle size={24}/>
                        </div>
                        <div>
                            <div className="text-2xl font-black">{unreadAlerts}</div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Active Alerts</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">Cheating attempts or missed goals.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                         <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Activity size={24}/>
                        </div>
                        <div>
                             <div className="text-2xl font-black">{child.grade || 'N/A'}</div>
                             <div className="text-xs text-slate-500 uppercase font-bold">Current Grade</div>
                        </div>
                    </div>
                     <p className="text-sm text-slate-500">Overall academic standing.</p>
                </div>
                
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                         <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <Clock size={24}/>
                        </div>
                        <div>
                             <div className="text-2xl font-black">{child.totalStudyHours || 0}h</div>
                             <div className="text-xs text-slate-500 uppercase font-bold">Total Study Time</div>
                        </div>
                    </div>
                     <p className="text-sm text-slate-500">Time spent learning this week.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow border dark:border-slate-700">
                    <h3 className="font-bold mb-6">Attendance Overview</h3>
                    <StudyTrendChart />
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow border dark:border-slate-700">
                    <h3 className="font-bold mb-6">Subject Performance</h3>
                    <PerformanceRadar />
                </div>
            </div>
        </div>
    )
}

const ParentAlertsView = ({ user }: { user: User }) => {
    const alerts = db.getAlertsForParent(user.id);
    return (
        <div className="animate-fade-in p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-600"><ShieldAlert/> Security Alerts & Logs</h2>
            <div className="space-y-4">
                {alerts.length === 0 && <div className="text-slate-500">No alerts found. Good job!</div>}
                {alerts.map(a => (
                    <div key={a.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-l-4 border-red-500 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-red-600 flex items-center gap-2"><AlertTriangle size={18}/> {a.type}</div>
                            <p className="text-slate-700 dark:text-slate-300 mt-1">{a.message}</p>
                            <div className="text-xs text-slate-400 mt-2">{new Date(a.timestamp).toLocaleString()}</div>
                        </div>
                        <div className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold uppercase">{a.severity}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const ReportCardView = ({ user }: { user: User }) => {
    // If parent, show child's report. If student, show own.
    const studentId = user.role === UserRole.PARENT ? user.childId : user.id;
    const report = studentId ? db.getReportCard(studentId) : null;

    if (!report) return <div className="p-8 text-slate-500">No report card generated yet.</div>;

    return (
        <div className="animate-fade-in p-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border dark:border-slate-700">
                <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-widest">Report Card</h1>
                        <p className="opacity-80">{report.term}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black">{report.subjects.reduce((a,b)=>a+b.score,0)/report.subjects.length}%</div>
                        <div className="text-sm font-bold uppercase opacity-80">Overall Grade</div>
                    </div>
                </div>
                
                <div className="p-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold text-slate-400 uppercase border-b dark:border-slate-700">
                                <th className="py-4">Subject</th>
                                <th className="py-4">Score</th>
                                <th className="py-4">Grade</th>
                                <th className="py-4">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.subjects.map((s, i) => (
                                <tr key={i} className="border-b dark:border-slate-700 last:border-0">
                                    <td className="py-4 font-bold">{s.subject}</td>
                                    <td className="py-4">{s.score}/100</td>
                                    <td className={`py-4 font-bold ${s.grade.startsWith('A') ? 'text-green-600' : 'text-blue-600'}`}>{s.grade}</td>
                                    <td className="py-4 text-sm text-slate-500">{s.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-8 grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Teacher's Comments</div>
                            <p className="italic text-slate-700 dark:text-slate-300">"{report.teacherComments}"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-xl font-black text-slate-800 dark:text-white">{report.attendancePercentage}%</div>
                                <div className="text-xs text-slate-500">Attendance</div>
                            </div>
                            <div>
                                <div className="text-xl font-black text-red-500">{report.proctoringWarnings}</div>
                                <div className="text-xs text-slate-500">Violations</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AttendanceView = ({ user }: { user: User }) => {
    const studentId = user.role === UserRole.PARENT ? user.childId : user.id;
    const records = studentId ? db.getAttendance(studentId) : [];

    return (
        <div className="animate-fade-in p-8">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock className="text-blue-600"/> Attendance History</h2>
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden border dark:border-slate-700">
                 <table className="w-full text-left">
                     <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-bold text-slate-500">
                         <tr>
                             <th className="p-4">Date</th>
                             <th className="p-4">Activity Type</th>
                             <th className="p-4">Duration</th>
                             <th className="p-4">Status</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y dark:divide-slate-700">
                         {records.map(r => (
                             <tr key={r.id}>
                                 <td className="p-4">{new Date(r.date).toLocaleDateString()} {new Date(r.date).toLocaleTimeString()}</td>
                                 <td className="p-4 font-medium">{r.type}</td>
                                 <td className="p-4">{r.durationMinutes} mins</td>
                                 <td className="p-4"><span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold uppercase">{r.status}</span></td>
                             </tr>
                         ))}
                         {records.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">No records found.</td></tr>}
                     </tbody>
                 </table>
             </div>
        </div>
    )
}
