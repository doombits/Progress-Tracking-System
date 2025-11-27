
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Monitor, Share, User as UserIcon, Hand, Send, Smile, MoreVertical, X, Laugh, ThumbsUp, Heart, StopCircle, Radio, Maximize, Minimize } from 'lucide-react';
import { User } from '../../types';
import { db } from '../../services/dbService';

interface Props {
  user: User;
  facultyName: string;
  onLeave: () => void;
}

const LiveClassRoom: React.FC<Props> = ({ user, facultyName, onLeave }) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'people' | null>('chat');
  const [reactions, setReactions] = useState<{id: number, icon: any}[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{user: string, text: string, time: string}[]>([
      { user: 'Priya Sharma', text: 'Good morning sir!', time: '10:00 AM' },
      { user: 'Arjun', text: 'Can we record this session?', time: '10:02 AM' },
      { user: 'Riya Patel', text: 'The screen is very clear now.', time: '10:05 AM' }
  ]);

  const DUMMY_PARTICIPANTS = [
      { name: 'Priya Sharma', color: 'bg-pink-500' },
      { name: 'Arjun Kumar', color: 'bg-blue-500' },
      { name: 'Riya Patel', color: 'bg-purple-500' },
      { name: 'Ankit Singh', color: 'bg-yellow-500' },
      { name: 'Sneha Gupta', color: 'bg-green-500' },
  ];

  // --- INITIALIZATION ---
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCam = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch(e) { console.error("Media Error", e); }
    };
    
    // Always try to start camera initially for self-view
    startCam();

    // Timer
    const timer = setInterval(() => setElapsedTime(p => p + 1), 1000);

    // Fullscreen listener
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
        if (stream) stream.getTracks().forEach(t => t.stop());
        clearInterval(timer);
        document.removeEventListener('fullscreenchange', handleFsChange);
        // Log Attendance
        if (elapsedTime > 0) db.logAttendance(user.id, 'LIVE_CLASS', Math.round(elapsedTime / 60));
    };
  }, []);

  // Effect to toggle video track based on camOn state
  useEffect(() => {
      const videoTrack = videoRef.current?.srcObject instanceof MediaStream 
        ? (videoRef.current.srcObject as MediaStream).getVideoTracks()[0] 
        : null;
      if (videoTrack) videoTrack.enabled = camOn;
      
      if (!camOn) showToast("Camera turned off");
      else if (videoRef.current?.srcObject) showToast("Camera turned on");
  }, [camOn]);

  const showToast = (msg: string) => {
      setNotification(msg);
      setTimeout(() => setNotification(null), 3000);
  }

  const handleSendMessage = () => {
      if(!chatInput.trim()) return;
      setMessages([...messages, { user: user.name, text: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      setChatInput('');
  };

  const triggerReaction = (Icon: any) => {
      const id = Date.now();
      setReactions(prev => [...prev, {id, icon: Icon}]);
      setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 2000);
      showToast("Reaction sent!");
  };

  const toggleHand = () => {
      setHandRaised(!handRaised);
      showToast(handRaised ? "Hand lowered" : "Hand raised");
  };

  const toggleFullScreen = async () => {
      try {
          if (!document.fullscreenElement) {
              await document.documentElement.requestFullscreen();
          } else {
              await document.exitFullscreen();
          }
      } catch (err) {
          console.error("Error toggling fullscreen:", err);
      }
  };

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121214] text-white flex flex-col font-sans overflow-hidden">
        
        {/* TOAST NOTIFICATION */}
        {notification && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur px-6 py-2 rounded-full text-sm font-bold animate-fade-in z-[60]">
                {notification}
            </div>
        )}

        {/* TOP BAR */}
        <div className="h-16 flex items-center justify-between px-6 bg-[#1c1c1e] border-b border-white/5 shadow-lg z-20">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">E</div>
                    <h1 className="font-bold text-lg hidden md:block">Advanced Python: AI Integration</h1>
                </div>
                <div className="h-6 w-px bg-white/10 mx-2"></div>
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-red-400">{formatTime(elapsedTime)}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <div className="hidden md:flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {DUMMY_PARTICIPANTS.slice(0,3).map((p,i) => (
                            <div key={i} className={`w-8 h-8 rounded-full ${p.color} border-2 border-[#1c1c1e] flex items-center justify-center text-xs font-bold`}>{p.name[0]}</div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#1c1c1e] flex items-center justify-center text-xs">+20</div>
                    </div>
                 </div>
                 
                 <button 
                    onClick={toggleFullScreen} 
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition border border-white/10"
                    title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
                 >
                    {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                 </button>
            </div>
        </div>

        {/* MAIN STAGE LAYOUT */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* VIDEO GRID */}
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                {/* Main Speaker Stage */}
                <div className="flex-1 bg-black rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl min-h-[400px]">
                     {screenShare ? (
                         <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 border-4 border-green-500/30">
                             <Monitor size={80} className="text-green-500 mb-6 animate-pulse"/>
                             <h2 className="text-3xl font-bold mb-2">You are sharing your screen</h2>
                             <p className="text-gray-400 mb-6">Participants can see your entire screen.</p>
                             <button onClick={() => setScreenShare(false)} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold flex items-center gap-2 transition">
                                <StopCircle size={20}/> Stop Sharing
                             </button>
                         </div>
                     ) : (
                        <div className="relative w-full h-full">
                            <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=1600&q=80" className="w-full h-full object-cover opacity-90"/>
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
                                <Radio size={14} className="text-red-500 animate-pulse"/> Speaker View
                            </div>
                        </div>
                     )}
                     
                     <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
                        <Mic size={16} className="text-green-400"/> 
                        <span>{facultyName}</span>
                        <span className="bg-blue-600 text-[10px] px-1.5 py-0.5 rounded uppercase">Host</span>
                     </div>
                     
                     {/* Floating Reactions Animation */}
                     <div className="absolute bottom-20 right-10 flex flex-col items-center gap-2 pointer-events-none z-30">
                         {reactions.map(r => (
                             <div key={r.id} className="animate-float-up text-5xl drop-shadow-2xl filter brightness-110">
                                 <r.icon />
                             </div>
                         ))}
                     </div>
                </div>

                {/* Participant Strip (Simulated) */}
                <div className="h-40 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {/* Self View */}
                    <div className="w-64 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden relative border border-white/20 shadow-lg group">
                        <video ref={videoRef} autoPlay muted className={`w-full h-full object-cover transform scale-x-[-1] ${!camOn ? 'hidden' : ''}`}/>
                        {!camOn && (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
                                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold mb-2">{user.name[0]}</div>
                                <div className="text-xs text-gray-500">Camera Off</div>
                            </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                            {!micOn && <div className="bg-red-500 p-1 rounded-full"><MicOff size={12}/></div>}
                            {handRaised && <div className="bg-yellow-500 p-1 rounded-full text-black"><Hand size={12}/></div>}
                        </div>
                        <div className="absolute bottom-2 left-2 text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur">You</div>
                    </div>

                    {/* Dummy Students */}
                    {DUMMY_PARTICIPANTS.map((p, i) => (
                        <div key={i} className="w-64 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden relative border border-white/10">
                            <div className={`w-full h-full ${p.color} opacity-20 flex items-center justify-center`}>
                                <UserIcon size={40} className="text-white opacity-50"/>
                            </div>
                            <div className="absolute bottom-2 left-2 text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur">{p.name}</div>
                            <div className="absolute top-2 right-2 flex gap-1">
                                <div className="bg-black/50 p-1 rounded-full"><MicOff size={12}/></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDEBAR (Chat/People) */}
            {activeTab && (
                <div className="w-80 md:w-96 bg-[#1c1c1e] border-l border-white/10 flex flex-col animate-slide-in-right z-20 shadow-2xl">
                    <div className="flex border-b border-white/10">
                        <button onClick={() => setActiveTab('chat')} className={`flex-1 p-4 text-sm font-bold transition ${activeTab === 'chat' ? 'text-blue-500 border-b-2 border-blue-500 bg-white/5' : 'text-gray-400 hover:text-white'}`}>Chat</button>
                        <button onClick={() => setActiveTab('people')} className={`flex-1 p-4 text-sm font-bold transition ${activeTab === 'people' ? 'text-blue-500 border-b-2 border-blue-500 bg-white/5' : 'text-gray-400 hover:text-white'}`}>People (25)</button>
                        <button onClick={() => setActiveTab(null)} className="p-4 text-gray-400 hover:text-red-500 transition"><X size={20}/></button>
                    </div>

                    {activeTab === 'chat' ? (
                        <div className="flex-1 flex flex-col overflow-hidden bg-[#151517]">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex flex-col gap-1 ${m.user === user.name ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-gray-300">{m.user}</span>
                                            <span className="text-[10px] text-gray-500">{m.time}</span>
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm max-w-[90%] ${m.user === user.name ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#2c2c2e] text-gray-200 rounded-tl-none'}`}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-[#1c1c1e] border-t border-white/10 flex gap-2">
                                <input 
                                    className="flex-1 bg-[#2c2c2e] border border-white/10 rounded-full px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" 
                                    placeholder="Type a message..."
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-full text-white transition transform hover:scale-105"><Send size={18}/></button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-[#151517]">
                            {/* Me */}
                             <div className="flex items-center gap-3 p-3 bg-blue-600/10 border border-blue-600/20 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">{user.name[0]}</div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold flex items-center gap-2">
                                        {user.name} <span className="text-[10px] bg-blue-600 px-1.5 rounded text-white">You</span>
                                    </div>
                                    <div className="text-xs text-gray-400">Student</div>
                                </div>
                                <div className="flex gap-2 text-gray-400">
                                    {micOn ? <Mic size={16} className="text-green-500"/> : <MicOff size={16} className="text-red-500"/>}
                                    {camOn ? <Video size={16} className="text-green-500"/> : <VideoOff size={16} className="text-red-500"/>}
                                </div>
                            </div>
                            
                            {/* Host */}
                             <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition">
                                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=50&q=80" className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500"/>
                                <div className="flex-1">
                                    <div className="text-sm font-bold flex items-center gap-2">
                                        {facultyName} <span className="text-[10px] bg-purple-600 px-1.5 rounded text-white">Host</span>
                                    </div>
                                    <div className="text-xs text-gray-400">Faculty</div>
                                </div>
                                <Mic size={16} className="text-green-500"/>
                            </div>

                            {/* Participants */}
                            {DUMMY_PARTICIPANTS.map((p, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition opacity-80">
                                    <div className={`w-10 h-10 rounded-full ${p.color} flex items-center justify-center font-bold text-sm text-white`}>{p.name[0]}</div>
                                    <div className="flex-1 text-sm font-bold">{p.name}</div>
                                    <MicOff size={16} className="text-red-500"/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* BOTTOM CONTROLS BAR */}
        <div className="h-24 bg-[#1c1c1e] border-t border-white/5 flex items-center justify-center px-8 z-30 relative gap-4">
            
            <ControlBtn active={micOn} onClick={() => setMicOn(!micOn)} icon={micOn ? Mic : MicOff} label={micOn ? "Mute" : "Unmute"} />
            <ControlBtn active={camOn} onClick={() => setCamOn(!camOn)} icon={camOn ? Video : VideoOff} label={camOn ? "Stop Video" : "Start Video"} />
            
            <div className="h-10 w-px bg-white/10 mx-2"></div>

            <ControlBtn active={screenShare} onClick={() => setScreenShare(!screenShare)} icon={Monitor} label="Share" activeColor="bg-green-600 text-white" />
            <ControlBtn active={false} onClick={() => triggerReaction(Laugh)} icon={Smile} label="React" />
            <ControlBtn active={handRaised} onClick={toggleHand} icon={Hand} label="Raise Hand" activeColor="bg-yellow-500 text-black" />
            
            <div className="h-10 w-px bg-white/10 mx-2"></div>
            
            <ControlBtn active={activeTab === 'people'} onClick={() => setActiveTab(activeTab === 'people' ? null : 'people')} icon={Users} label="People" />
            <ControlBtn active={activeTab === 'chat'} onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')} icon={MessageSquare} label="Chat" />

            <div className="absolute right-8">
                 <button onClick={onLeave} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-red-900/50 hover:scale-105">
                    <PhoneOff size={20}/> <span className="hidden md:inline">Leave Class</span>
                </button>
            </div>
        </div>

    </div>
  );
};

const ControlBtn = ({ active, onClick, icon: Icon, label, activeColor }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl transition-all duration-200 group ${active ? (activeColor || 'bg-gray-700 text-white') : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        <Icon size={24} className={`transition-transform group-hover:scale-110 ${active ? '' : ''}`} />
        <span className="text-[10px] font-medium">{label}</span>
    </button>
)

export default LiveClassRoom;
