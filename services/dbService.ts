
import { User, UserRole, Course, QuizResult, ProctoringLog, StudentReview, Message, ReportCard, ExamSchedule, StudyLog, EmailLog, Alert, Notification, Book, AttendanceRecord } from '../types';
import { MOCK_USERS, MOCK_COURSES, STUDENT_REVIEWS, MOCK_MESSAGES, MOCK_REPORT_CARDS, MOCK_BOOKS } from '../constants';

const DB_KEYS = {
  USERS: 'app_users',
  COURSES: 'app_courses',
  EXAMS: 'app_exams',
  RESULTS: 'app_results',
  LOGS: 'app_proctoring_logs',
  STUDY_LOGS: 'app_study_logs',
  REVIEWS: 'app_reviews',
  MESSAGES: 'app_messages',
  REPORTS: 'app_reports',
  EMAILS: 'app_emails',
  ALERTS: 'app_alerts',
  NOTIFICATIONS: 'app_notifications',
  BOOKS: 'app_books',
  ATTENDANCE: 'app_attendance'
};

class DbService {
  constructor() {
    this.init();
  }

  private init() {
    // Basic Initialization
    if (!localStorage.getItem(DB_KEYS.COURSES)) localStorage.setItem(DB_KEYS.COURSES, JSON.stringify(MOCK_COURSES));
    if (!localStorage.getItem(DB_KEYS.REVIEWS)) localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(STUDENT_REVIEWS));
    if (!localStorage.getItem(DB_KEYS.MESSAGES)) localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(MOCK_MESSAGES));
    if (!localStorage.getItem(DB_KEYS.REPORTS)) localStorage.setItem(DB_KEYS.REPORTS, JSON.stringify(MOCK_REPORT_CARDS));
    if (!localStorage.getItem(DB_KEYS.BOOKS)) localStorage.setItem(DB_KEYS.BOOKS, JSON.stringify(MOCK_BOOKS));
    
    // Ensure Arrays exist
    [DB_KEYS.RESULTS, DB_KEYS.EXAMS, DB_KEYS.STUDY_LOGS, DB_KEYS.EMAILS, DB_KEYS.LOGS, DB_KEYS.ALERTS, DB_KEYS.NOTIFICATIONS, DB_KEYS.ATTENDANCE].forEach(key => {
        if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify([]));
    });

    // Check for Users. If empty or only mocks, generate DUMMY DATA (100 users)
    const existingUsers = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    if (existingUsers.length < 10) {
        this.generateDummyData();
    }
  }

  // --- DUMMY DATA GENERATOR (100 ACCOUNTS) ---
  private generateDummyData() {
    console.log("Generating 100 Dummy Accounts...");
    const users: User[] = [...MOCK_USERS]; // Start with mocks
    const alerts: Alert[] = [];
    const results: QuizResult[] = [];
    const logs: ProctoringLog[] = [];

    const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Anika", "Navya", "Angel", "Myra", "Siya"];
    const lastNames = ["Kumar", "Singh", "Sharma", "Patel", "Mishra", "Yadav", "Gupta", "Verma", "Reddy", "Nair", "Iyer", "Khan", "Das", "Joshi", "Mehta"];

    for (let i = 0; i < 100; i++) {
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const studentName = `${fName} ${lName}`;
        const sId = `s_dummy_${i}`;
        const pId = `p_dummy_${i}`;
        
        // Student
        const student: User = {
            id: sId,
            name: studentName,
            username: `student${i}`,
            email: `student${i}@school.com`,
            role: UserRole.STUDENT,
            passwordHash: 'pass123',
            xp: Math.floor(Math.random() * 5000),
            badges: Math.random() > 0.5 ? ['Fast Learner'] : [],
            streakDays: Math.floor(Math.random() * 30),
            totalStudyHours: Math.floor(Math.random() * 50),
            lastActive: new Date().toISOString(),
            parentId: pId,
            grade: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
        };

        // Parent
        const parent: User = {
            id: pId,
            name: `Parent of ${fName}`,
            username: `parent${i}`,
            email: `parent${i}@home.com`,
            role: UserRole.PARENT,
            passwordHash: 'pass123',
            childId: sId,
            xp: 0, badges: [], streakDays: 0, totalStudyHours: 0, lastActive: new Date().toISOString()
        };

        users.push(student, parent);

        // Add Random Exam History
        if (Math.random() > 0.3) {
            results.push({
                id: `res_${i}`,
                studentId: sId,
                examId: 'c1',
                score: Math.floor(Math.random() * 100),
                maxScore: 100,
                timestamp: new Date().toISOString(),
                timeTakenSeconds: 1200,
                topicsCovered: ['Basics'],
                status: 'COMPLETED'
            });
        }

        // Add Random Alerts
        if (Math.random() > 0.7) {
            alerts.push({
                id: `alt_${i}`,
                studentId: sId,
                parentId: pId,
                type: 'CHEATING',
                message: 'Student attempted to switch tabs during exam.',
                timestamp: new Date().toISOString(),
                severity: 'HIGH',
                read: false
            });
            logs.push({
                id: `log_${i}`,
                studentId: sId,
                timestamp: new Date().toISOString(),
                violationType: 'TAB_SWITCH',
                confidence: 1
            });
        }
    }

    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(DB_KEYS.ALERTS, JSON.stringify(alerts));
    localStorage.setItem(DB_KEYS.RESULTS, JSON.stringify(results));
    localStorage.setItem(DB_KEYS.LOGS, JSON.stringify(logs));
  }

  // --- STRICT AUTH: SIGNUP & LINKING ---

  createLinkedAccounts(studentData: any, parentData: any): User {
    const users = this.getUsers();

    // 1. Generate IDs based on Names (Simulated)
    const sId = 's_' + studentData.name.toLowerCase().replace(/\s/g, '') + '_' + Date.now();
    const pId = 'p_' + parentData.name.toLowerCase().replace(/\s/g, '') + '_' + Date.now();

    // 2. Create Student Object
    const student: User = {
        id: sId,
        name: studentData.name,
        username: studentData.email.split('@')[0],
        email: studentData.email,
        role: UserRole.STUDENT,
        passwordHash: studentData.password,
        parentId: pId,
        xp: 0, badges: [], streakDays: 0, totalStudyHours: 0, lastActive: new Date().toISOString(), grade: 'N/A'
    };

    // 3. Create Parent Object
    const parent: User = {
        id: pId,
        name: parentData.name,
        username: parentData.email.split('@')[0],
        email: parentData.email,
        role: UserRole.PARENT,
        passwordHash: parentData.password, // In real app, hash this!
        childId: sId,
        xp: 0, badges: [], streakDays: 0, totalStudyHours: 0, lastActive: new Date().toISOString()
    };

    users.push(student, parent);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));

    // 4. Log Emails
    this.logEmail(student.email, "Welcome Student", "Account created.");
    this.logEmail(parent.email, "Welcome Parent", `Your account linked to ${student.name} is ready.`);

    return student;
  }

  createTeacherAccount(teacherData: any): User {
      const users = this.getUsers();
      const tId = 't_' + teacherData.name.toLowerCase().replace(/\s/g, '') + '_' + Date.now();
      
      const teacher: User = {
          id: tId,
          name: teacherData.name,
          username: teacherData.email.split('@')[0],
          email: teacherData.email,
          role: UserRole.TEACHER,
          passwordHash: teacherData.password,
          xp: 0, badges: [], streakDays: 0, totalStudyHours: 0, lastActive: new Date().toISOString()
      };
      
      users.push(teacher);
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
      this.logEmail(teacher.email, "Welcome Faculty", "Your faculty account is ready.");
      return teacher;
  }

  // --- NOTIFICATIONS ---
  createNotification(userId: string, title: string, message: string, type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR') {
      const notifs: Notification[] = JSON.parse(localStorage.getItem(DB_KEYS.NOTIFICATIONS) || '[]');
      notifs.push({
          id: Date.now().toString(),
          userId,
          title,
          message,
          type,
          timestamp: new Date().toISOString(),
          read: false
      });
      localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  getNotifications(userId: string): Notification[] {
      const notifs: Notification[] = JSON.parse(localStorage.getItem(DB_KEYS.NOTIFICATIONS) || '[]');
      return notifs.filter(n => n.userId === userId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  markNotificationRead(id: string) {
      const notifs: Notification[] = JSON.parse(localStorage.getItem(DB_KEYS.NOTIFICATIONS) || '[]');
      const index = notifs.findIndex(n => n.id === id);
      if (index > -1) {
          notifs[index].read = true;
          localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      }
  }

  // --- ATTENDANCE ---
  logAttendance(studentId: string, type: 'LIVE_CLASS' | 'LOGIN' | 'EXAM', durationMinutes: number) {
      const att: AttendanceRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || '[]');
      att.push({
          id: Date.now().toString(),
          studentId,
          date: new Date().toISOString(),
          status: 'Present',
          durationMinutes,
          type
      });
      localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(att));
      
      // Notify parent if it's a Live Class
      if (type === 'LIVE_CLASS') {
          const student = this.getUserById(studentId);
          if (student && student.parentId) {
              this.createNotification(student.parentId, "Live Class Attendance", `${student.name} attended a live class for ${durationMinutes} minutes.`, 'INFO');
          }
      }
  }
  
  getAttendance(userId: string): AttendanceRecord[] {
      const att: AttendanceRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || '[]');
      return att.filter(a => a.studentId === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // --- ALERTS & MONITORING ---

  createAlert(alert: Alert) {
    const alerts = JSON.parse(localStorage.getItem(DB_KEYS.ALERTS) || '[]');
    alerts.push(alert);
    localStorage.setItem(DB_KEYS.ALERTS, JSON.stringify(alerts));
    
    // Auto-email parent & create notification
    const parent = this.getUserById(alert.parentId);
    if (parent) {
        this.logEmail(parent.email, `ALERT: ${alert.type}`, alert.message);
        this.createNotification(parent.id, `Alert: ${alert.type}`, alert.message, 'WARNING');
    }
  }

  getAlertsForParent(parentId: string): Alert[] {
    const alerts: Alert[] = JSON.parse(localStorage.getItem(DB_KEYS.ALERTS) || '[]');
    return alerts.filter(a => a.parentId === parentId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  getReportCard(studentId: string): ReportCard | undefined {
      // Mocking a report card fetch - in real app would query DB or aggregate results
      return MOCK_REPORT_CARDS.find(r => r.studentId === studentId);
  }

  // --- LIBRARY MANAGEMENT ---
  getBooks(): Book[] {
      return JSON.parse(localStorage.getItem(DB_KEYS.BOOKS) || '[]');
  }
  
  addBook(book: Book) {
      const books = this.getBooks();
      books.push(book);
      localStorage.setItem(DB_KEYS.BOOKS, JSON.stringify(books));
  }
  
  // --- MESSAGES ---
  getMessages(userId: string): Message[] {
      const msgs: Message[] = JSON.parse(localStorage.getItem(DB_KEYS.MESSAGES) || '[]');
      return msgs.filter(m => m.senderId === userId || m.receiverId === userId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  sendMessage(msg: Message) {
      const msgs = JSON.parse(localStorage.getItem(DB_KEYS.MESSAGES) || '[]');
      msgs.push(msg);
      localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(msgs));
  }

  // --- STANDARD CRUD ---
  
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  // --- EXAM SCHEDULING ---

  createExamSchedule(exam: ExamSchedule) {
    const exams = JSON.parse(localStorage.getItem(DB_KEYS.EXAMS) || '[]');
    exams.push(exam);
    localStorage.setItem(DB_KEYS.EXAMS, JSON.stringify(exams));
  }

  getAvailableExams(): ExamSchedule[] {
    return JSON.parse(localStorage.getItem(DB_KEYS.EXAMS) || '[]');
  }

  // --- STUDY TRACKING ---

  logStudyTime(studentId: string, minutes: number) {
    const logs: StudyLog[] = JSON.parse(localStorage.getItem(DB_KEYS.STUDY_LOGS) || '[]');
    const today = new Date().toISOString().split('T')[0];
    const existingLog = logs.find(l => l.studentId === studentId && l.date === today);
    
    if (existingLog) existingLog.minutes += minutes;
    else logs.push({ id: Date.now().toString(), studentId, date: today, minutes });
    
    localStorage.setItem(DB_KEYS.STUDY_LOGS, JSON.stringify(logs));

    // Update User Total
    const users = this.getUsers();
    const user = users.find(u => u.id === studentId);
    if (user) {
      user.totalStudyHours = Math.round((existingLog ? existingLog.minutes : minutes) / 60 * 10) / 10;
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }
  }

  getStudyTimeToday(studentId: string): number {
    const logs: StudyLog[] = JSON.parse(localStorage.getItem(DB_KEYS.STUDY_LOGS) || '[]');
    const today = new Date().toISOString().split('T')[0];
    const log = logs.find(l => l.studentId === studentId && l.date === today);
    return log ? log.minutes : 0;
  }

  // --- LEADERBOARD & RESULTS ---
  addProctoringLog(log: ProctoringLog) {
    const logs = JSON.parse(localStorage.getItem(DB_KEYS.LOGS) || '[]');
    logs.push(log);
    localStorage.setItem(DB_KEYS.LOGS, JSON.stringify(logs));
  }

  saveQuizResult(result: QuizResult) {
    const results = JSON.parse(localStorage.getItem(DB_KEYS.RESULTS) || '[]');
    results.push(result);
    localStorage.setItem(DB_KEYS.RESULTS, JSON.stringify(results));

    // Update Leaderboard/XP
    const users = this.getUsers();
    const user = users.find(u => u.id === result.studentId);
    if (user) {
        user.xp += result.score;
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }
  }

  getAllQuizResults(): QuizResult[] {
    return JSON.parse(localStorage.getItem(DB_KEYS.RESULTS) || '[]');
  }

  hasStudentAttemptedExam(studentId: string, examId: string): boolean {
    const results = this.getAllQuizResults();
    return results.some(r => r.studentId === studentId && r.examId === examId);
  }

  getLeaderboardData(): {user: User, score: number}[] {
      const users = this.getUsers().filter(u => u.role === UserRole.STUDENT);
      const results = this.getAllQuizResults();
      
      const leaderboard = users.map(user => {
          const userResults = results.filter(r => r.studentId === user.id);
          const avgScore = userResults.length > 0 
            ? userResults.reduce((acc, curr) => acc + curr.score, 0) / userResults.length 
            : 0;
          return { user, score: Math.round(avgScore) + (user.xp / 100) }; // Combo of XP and Quiz Avg
      });

      return leaderboard.sort((a,b) => b.score - a.score).slice(0, 10);
  }
  
  logEmail(to: string, subject: string, content: string) {
      // Mock email sending
      console.log(`[EMAIL SENT] To: ${to}, Subject: ${subject}`);
  }

  // Fallback for simple create (used by legacy auth, redirects to strict if needed)
  createUser(userData: Partial<User>): User {
      // This is now legacy, prefer createLinkedAccounts
      return this.createLinkedAccounts(
          { name: userData.name, email: userData.email, password: userData.passwordHash },
          { name: `Parent of ${userData.name}`, email: `parent.${userData.email}`, password: 'pass' }
      );
  }
}

export const db = new DbService();
