
// Role Definitions
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  TEACHER = 'TEACHER'
}

// User Model
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  avatarUrl?: string;
  xp: number;
  badges: string[];
  streakDays: number;
  totalStudyHours: number; // For 8-hour rule
  lastActive: string;
  parentId?: string; // Link student to parent
  childId?: string; // Link parent to student
  grade?: string;
}

// Communication & Notifications
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type?: 'ALERT' | 'CHAT';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  timestamp: string;
  read: boolean;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  timestamp: string;
  status: 'SENT';
}

// Academic Records
export interface ReportCard {
  studentId: string;
  term: string;
  subjects: {
    subject: string;
    score: number;
    grade: string;
    remarks: string;
  }[];
  attendancePercentage: number;
  totalStudyHours: number;
  proctoringWarnings: number;
  teacherComments: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  durationMinutes: number;
  type: 'LIVE_CLASS' | 'LOGIN' | 'EXAM';
}

// Content Models
export interface Resource {
  title: string;
  type: 'PDF' | 'LINK' | 'DOWNLOAD';
  url: string;
}

export interface Topic {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string; 
  videoUrl?: string;
  estimatedMinutes: number;
  resources?: Resource[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  topics: Topic[];
  thumbnail: string;
  level: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  category: string;
  contentUrl: string; // PDF link
  uploadedBy?: string; // Teacher ID
}

export interface Recording {
  id: string;
  title: string;
  instructor: string;
  date: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

export interface Tutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  experience: string;
  imageUrl: string;
  bio: string;
}

// Exam & Scheduling
export interface ExamSchedule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  createdBy: string;
  startTime: string; // ISO Date
  endTime: string;   // ISO Date
  durationMinutes: number;
  questionCount: number;
  strictMode: boolean; // Enables proctoring
  topic: string;
  isActive: boolean;
}

export interface QuizResult {
  id: string;
  studentId: string;
  examId: string;
  score: number;
  maxScore: number;
  timestamp: string;
  timeTakenSeconds: number;
  topicsCovered: string[];
  status: 'COMPLETED' | 'TERMINATED';
}

export interface StudyLog {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  minutes: number;
}

export interface StudentReview {
  id: string;
  studentName: string;
  courseName: string;
  rating: number; 
  comment: string;
}

export interface ProctoringLog {
  id: string;
  studentId: string;
  timestamp: string;
  violationType: 'TAB_SWITCH' | 'LOOKING_AWAY' | 'NO_FACE' | 'MULTIPLE_FACES' | 'CAMERA_OFF' | 'CAMERA_BLOCKED' | 'FULLSCREEN_EXIT';
  confidence: number;
}

export interface Alert {
  id: string;
  studentId: string;
  parentId: string;
  type: 'CHEATING' | 'STUDY_GOAL' | 'EXAM_MISSED';
  message: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  read: boolean;
}
