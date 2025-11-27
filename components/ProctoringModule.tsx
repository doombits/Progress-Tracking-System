
import React, { useEffect, useRef, useState } from 'react';
import { EyeOff, ShieldCheck, AlertOctagon, UserX, Camera, Maximize } from 'lucide-react';
import { db } from '../services/dbService';
import { User } from '../types';

interface Props {
  user: User;
  onViolation: (msg: string) => void;
  onBlockUser: () => void;
}

const ProctoringModule: React.FC<Props> = ({ user, onViolation, onBlockUser }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [violationType, setViolationType] = useState<string | null>(null);
  const [isTabActive, setIsTabActive] = useState(true);

  // --- STRICT FULLSCREEN ENFORCEMENT ---
  useEffect(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.log("Fullscreen denied", err));
    }

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            handleViolation('FULLSCREEN_EXIT', 'You exited full-screen mode.');
        }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // --- TAB SWITCH FREEZE LOGIC ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabActive(false);
        handleViolation('TAB_SWITCH', 'Tab switching is prohibited.');
      } else {
        setIsTabActive(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [warnings]);

  const handleViolation = (type: any, msg: string) => {
    setViolationType(type);
    
    // Create Alert for Parent
    if (user.parentId) {
        db.createAlert({
            id: Date.now().toString(),
            studentId: user.id,
            parentId: user.parentId,
            type: 'CHEATING',
            message: `Violation Detected: ${msg}`,
            timestamp: new Date().toISOString(),
            severity: 'HIGH',
            read: false
        });
    }

    const newCount = warnings + 1;
    setWarnings(newCount);
    
    db.addProctoringLog({
      id: Date.now().toString(),
      studentId: user.id,
      timestamp: new Date().toISOString(),
      violationType: type,
      confidence: 1.0
    });

    onViolation(`WARNING ${newCount}/3: ${msg}`);
    
    // Auto-Block on 3rd Strike or Critical Error
    if (newCount >= 3 || type === 'NO_FACE' || type === 'CAMERA_BLOCKED') {
      onViolation("CRITICAL VIOLATION: Exam Auto-Submitted.");
      onBlockUser();
    }
    
    setTimeout(() => setViolationType(null), 3000);
  };

  // --- CAMERA LOGIC ---
  useEffect(() => {
    let mounted = true;
    let interval: any;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (!mounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
        }
        streamRef.current = stream; 
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) videoRef.current.play().catch(console.error);
          };
          setStreamActive(true);
        }

        // BRIGHTNESS & FACE SIMULATION CHECK
        interval = setInterval(() => {
            if (videoRef.current && canvasRef.current && !videoRef.current.paused) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
                    const frame = ctx.getImageData(0, 0, 320, 240);
                    const data = frame.data;
                    
                    // Simple Brightness Check (Camera Covered?)
                    let colorSum = 0;
                    for(let x = 0; x < data.length; x+=4) colorSum += Math.floor((data[x]+data[x+1]+data[x+2])/3);
                    const brightness = Math.floor(colorSum / (320*240));
                    
                    if (brightness < 10) {
                        handleViolation('CAMERA_BLOCKED', 'Camera appears to be covered.');
                    }
                }
            }
        }, 2000);

      } catch (err) {
        handleViolation('CAMERA_OFF', 'Camera access required.');
      }
    };
    startCamera();
    return () => {
       mounted = false;
       clearInterval(interval);
       if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <>
        {/* TAB FREEZE OVERLAY */}
        {!isTabActive && (
            <div className="fixed inset-0 z-[100] bg-red-900 flex flex-col items-center justify-center text-white">
                <AlertOctagon size={80} className="animate-bounce mb-4"/>
                <h1 className="text-4xl font-bold mb-2">WARNING!</h1>
                <p className="text-xl">You switched tabs. Please return to the exam immediately.</p>
                <p className="text-sm mt-4">This incident has been logged.</p>
            </div>
        )}

        <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 z-50 w-56">
        <div className="relative h-36 bg-black rounded overflow-hidden mb-2 border-2 border-slate-900">
            <video ref={videoRef} muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
            <canvas ref={canvasRef} width="320" height="240" className="hidden" />
            
            {violationType && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-20 animate-pulse">
                    <AlertOctagon size={32} className="text-white mb-1"/>
                    <span className="text-xs font-bold text-white uppercase text-center px-1">{violationType}</span>
                </div>
            )}

            <div className="absolute top-2 right-2 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                <span className="text-[10px] text-white font-mono bg-black/50 px-1 rounded">REC</span>
            </div>
        </div>
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-1">
                {warnings < 1 ? <ShieldCheck size={14} className="text-green-600"/> : <AlertOctagon size={14} className="text-red-600"/>} 
                Secure
            </span>
            <span className={`${warnings > 0 ? 'text-red-500' : 'text-gray-400'}`}>Flags: {warnings}/3</span>
        </div>
        </div>
    </>
  );
};

export default ProctoringModule;
