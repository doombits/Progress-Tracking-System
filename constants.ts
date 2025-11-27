import { User, UserRole, Course, StudentReview, Book, Recording, Tutor, ReportCard, Message, AttendanceRecord } from './types';

// --- USERS ---
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Kundan',
    username: 'kundan.v',
    email: 'kundan@student.com',
    role: UserRole.STUDENT,
    passwordHash: 'pass',
    xp: 2450,
    badges: ['Fast Learner', 'Quiz Master', 'Top Performer'],
    streakDays: 15,
    totalStudyHours: 4.5, 
    lastActive: new Date().toISOString(),
    parentId: 'p1',
    grade: 'A'
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    username: 'priya.s',
    email: 'priya@student.com',
    role: UserRole.STUDENT,
    passwordHash: 'pass',
    xp: 3400,
    badges: ['Code Ninja', 'Week Warrior'],
    streakDays: 12,
    totalStudyHours: 9.5,
    lastActive: new Date().toISOString(),
    parentId: 'p2',
    grade: 'A+'
  },
  {
    id: 't1',
    name: 'Prof. Narshimha',
    username: 'narshimha',
    email: 'narshimha@teacher.com',
    role: UserRole.TEACHER,
    passwordHash: 'pass',
    xp: 0, badges: [], streakDays: 0, totalStudyHours: 0, lastActive: new Date().toISOString()
  },
  {
    id: 'a1',
    name: 'SysAdmin',
    username: 'admin',
    email: 'admin@school.com',
    role: UserRole.ADMIN,
    passwordHash: 'pass',
    xp: 0, badges: [], streakDays: 0, totalStudyHours: 0, lastActive: new Date().toISOString()
  },
  {
    id: 'p1',
    name: 'Mr. Verma',
    username: 'mr.verma',
    email: 'parent@home.com',
    role: UserRole.PARENT,
    passwordHash: 'pass',
    xp: 0, badges: [], streakDays: 0, totalStudyHours: 0, lastActive: new Date().toISOString()
  }
];

// --- COURSES ---
export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Advanced Python for AI',
    category: 'Computer Science',
    level: 'Advanced',
    description: 'Master Python specifically for Artificial Intelligence applications. Includes deep dives into PyTorch, TensorFlow, and custom neural network implementation.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    topics: [
      { 
        id: 't1', 
        title: 'Python Basics Recap & Optimizations', 
        difficulty: 'Beginner', 
        content: 'Review of syntax, list comprehensions, generators, and decorators. Understanding memory management in Python is crucial for large scale AI applications.', 
        estimatedMinutes: 30,
        resources: [{ title: 'Python Cheatsheet', type: 'PDF', url: '#' }]
      },
      { 
        id: 't2', 
        title: 'NumPy & Pandas Mastery', 
        difficulty: 'Intermediate', 
        content: 'Advanced data manipulation. Vectorization, broadcasting, and efficient data pipelines. handling missing data and time-series analysis.', 
        estimatedMinutes: 60,
        resources: [{ title: 'Pandas 101', type: 'PDF', url: '#' }]
      },
      { 
        id: 't3', 
        title: 'Neural Networks Architecture', 
        difficulty: 'Advanced', 
        content: 'Building a perceptron from scratch. Understanding Backpropagation, Activation Functions (ReLU, Sigmoid, Tanh), and Loss Functions.', 
        estimatedMinutes: 90,
        resources: [{ title: 'NN Diagram Source', type: 'DOWNLOAD', url: '#' }]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Data Structures & Algorithms',
    category: 'Computer Science',
    level: 'Intermediate',
    description: 'Essential DSA knowledge for placements. Covers Trees, Graphs, Dynamic Programming and Greedy Algorithms with real-world examples.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    topics: [
      { id: 't4', title: 'Arrays & Strings', difficulty: 'Beginner', content: 'Memory management, sliding window technique, two-pointer approach.', estimatedMinutes: 45 },
      { id: 't5', title: 'Trees & Graphs', difficulty: 'Advanced', content: 'BFS, DFS, Dijkstra Algorithm, and Minimum Spanning Trees.', estimatedMinutes: 120 },
      { id: 't6', title: 'Dynamic Programming', difficulty: 'Advanced', content: 'Memoization vs Tabulation. Knapsack problem, Longest Common Subsequence.', estimatedMinutes: 120 }
    ]
  },
  {
    id: 'c3',
    title: 'Cloud Computing with AWS',
    category: 'Infrastructure',
    level: 'Beginner',
    description: 'Learn to deploy scalable applications using EC2, S3, Lambda and RDS.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    topics: [
        { id: 't7', title: 'EC2 Basics', difficulty: 'Beginner', content: 'Launching instances, security groups, and SSH access.', estimatedMinutes: 40 },
        { id: 't8', title: 'S3 & Storage', difficulty: 'Beginner', content: 'Buckets, policies, and static website hosting.', estimatedMinutes: 40 }
    ]
  }
];

// --- LIBRARY & MEDIA ---
export const MOCK_BOOKS: Book[] = [
    { id: 'b1', title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
    { id: 'b2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Programming', coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
    { id: 'b3', title: 'AI: A Modern Approach', author: 'Stuart Russell', category: 'AI', coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
    { id: 'b4', title: 'Intro to Algorithms', author: 'Cormen', category: 'CS Theory', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
    { id: 'b5', title: 'Deep Learning', author: 'Ian Goodfellow', category: 'AI', coverUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
    { id: 'b6', title: 'You Don\'t Know JS', author: 'Kyle Simpson', category: 'Web Dev', coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
    { id: 'b7', title: 'Design Patterns', author: 'Erich Gamma', category: 'Architecture', coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
    { id: 'b8', title: 'Cracking the Coding Interview', author: 'Gayle Laakmann', category: 'Career', coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
    { id: 'b9', title: 'Refactoring', author: 'Martin Fowler', category: 'Programming', coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
    { id: 'b10', title: 'Head First Design Patterns', author: 'Eric Freeman', category: 'Design', coverUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=300&q=80', contentUrl: '#' },
];

export const MOCK_RECORDINGS: Recording[] = [
    { id: 'rec1', title: 'Intro to React Hooks', instructor: 'Emily Chen', date: '2023-10-12', duration: '45:00', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&q=80', videoUrl: '#' },
    { id: 'rec2', title: 'Advanced SQL Queries', instructor: 'Prof. Alan', date: '2023-10-15', duration: '01:12:00', thumbnail: 'https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&fit=crop&w=500&q=80', videoUrl: '#' },
    { id: 'rec3', title: 'System Design: Scalability', instructor: 'Dr. Sarah', date: '2023-10-20', duration: '55:30', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80', videoUrl: '#' },
    { id: 'rec4', title: 'Cyber Security Essentials', instructor: 'Michael Ross', date: '2023-10-25', duration: '40:15', thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=500&q=80', videoUrl: '#' },
    { id: 'rec5', title: 'Cloud Architecture Patterns', instructor: 'Jessica Pearson', date: '2023-10-28', duration: '1:05:00', thumbnail: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=500&q=80', videoUrl: '#' },
];

export const MOCK_TUTORS: Tutor[] = [
    { id: 't1', name: 'Prof. Narshimha', subject: 'Machine Learning', rating: 4.9, experience: '15 Years', imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=200&q=80', bio: 'Senior AI Researcher. Specializes in Deep Learning and Neural Networks.' },
    { id: 't2', name: 'Prof. Alan Grant', subject: 'Data Structures', rating: 4.7, experience: '15 Years', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', bio: 'Author of "Algorithmic Thinking". Loves making complex topics simple.' },
    { id: 't3', name: 'Emily Chen', subject: 'Web Development', rating: 4.8, experience: '6 Years', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80', bio: 'Senior Frontend Engineer at Google. Expert in React and TypeScript.' },
];

// --- REPORTS & MESSAGES ---
export const MOCK_REPORT_CARDS: ReportCard[] = [
    {
        studentId: 'u1',
        term: 'Fall 2024',
        subjects: [
            { subject: 'Artificial Intelligence', score: 85, grade: 'A', remarks: 'Excellent understanding of concepts.' },
            { subject: 'Data Structures', score: 72, grade: 'B', remarks: 'Needs improvement in Graph algorithms.' },
            { subject: 'Web Development', score: 90, grade: 'A+', remarks: 'Outstanding project work.' }
        ],
        attendancePercentage: 88,
        totalStudyHours: 124,
        proctoringWarnings: 3,
        teacherComments: "Kundan is a bright student but needs to maintain focus during long sessions."
    }
];

export const MOCK_MESSAGES: Message[] = [
    { id: 'm1', senderId: 't1', receiverId: 'p1', content: 'Hello Mr. Verma, Kundan missed the test today.', timestamp: '2023-10-20T10:00:00Z', read: false },
    { id: 'm2', senderId: 'p1', receiverId: 't1', content: 'Thanks for letting me know. I will talk to him.', timestamp: '2023-10-20T10:30:00Z', read: true },
];

export const STUDENT_REVIEWS: StudentReview[] = [
  { id: 'r1', studentName: 'Kundan', courseName: 'Python AI', rating: 5, comment: 'Amazing adaptive difficulty!' },
  { id: 'r2', studentName: 'Priya Sharma', courseName: 'DSA', rating: 4, comment: 'Challenging quizzes but very helpful.' },
];

export const TESTIMONIALS = [
    { name: "Kundan", role: "Student", text: "The AI recommendations helped me focus exactly on what I needed for my exams.", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" },
    { name: "Priya Sharma", role: "Student", text: "Live classes and the recorded library are lifesavers. Best learning platform!", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
    { name: "Prof. Narshimha", role: "Faculty", text: "The proctoring system is top-notch. It ensures academic integrity effortlessly.", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=100&q=80" },
    { name: "Mr. Verma", role: "Parent", text: "I love the report card feature. I can finally track my child's progress in real-time.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" },
];

export const DAILY_STUDY_GOAL_HOURS = 8;