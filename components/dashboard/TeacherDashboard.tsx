
import React from 'react';
import { Calendar, Upload, BookOpen, Video, Users, ClipboardList, PlusCircle } from 'lucide-react';
import { User } from '../../types';

interface Props {
  user: User;
  onNavigate: (view: string) => void;
}

const TeacherDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Faculty Dashboard</h1>
          <p className="text-slate-500">Manage your classes, content, and exams efficiently.</p>
      </header>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard 
            icon={<Calendar className="text-purple-600" size={32}/>}
            title="Schedule Exam"
            desc="Set up new quizzes & tests"
            onClick={() => onNavigate('schedule-exam')}
          />
          <ActionCard 
            icon={<Video className="text-red-600" size={32}/>}
            title="Start Live Class"
            desc="Launch WebRTC classroom"
            onClick={() => onNavigate('live')}
          />
          <ActionCard 
            icon={<BookOpen className="text-blue-600" size={32}/>}
            title="Manage Library"
            desc="Upload books & notes"
            onClick={() => onNavigate('library')}
          />
          <ActionCard 
            icon={<Users className="text-green-600" size={32}/>}
            title="Student List"
            desc="View performance & logs"
            onClick={() => onNavigate('student-list')}
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border dark:border-slate-700">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ClipboardList/> Recent Activities</h3>
              <ul className="space-y-4">
                  <li className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span>Scheduled "Advanced Python Quiz"</span>
                      <span className="text-slate-400">2 hrs ago</span>
                  </li>
                  <li className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span>Uploaded "Data Structures PDF"</span>
                      <span className="text-slate-400">5 hrs ago</span>
                  </li>
                  <li className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span>Completed Live Class (45 mins)</span>
                      <span className="text-slate-400">Yesterday</span>
                  </li>
              </ul>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border dark:border-slate-700 flex flex-col justify-center items-center text-center">
              <Upload size={48} className="text-slate-300 mb-4"/>
              <h3 className="font-bold text-lg">Quick Upload</h3>
              <p className="text-slate-500 text-sm mb-4">Upload study material directly to your students.</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2">
                  <PlusCircle size={16}/> Upload File
              </button>
          </div>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, desc, onClick }: any) => (
    <div onClick={onClick} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700 cursor-pointer hover:-translate-y-1 transition hover:shadow-lg">
        <div className="mb-4 bg-slate-50 dark:bg-slate-700 w-14 h-14 rounded-full flex items-center justify-center">
            {icon}
        </div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-slate-500">{desc}</p>
    </div>
);

export default TeacherDashboard;
