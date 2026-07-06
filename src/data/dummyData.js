export const adminStats = [
  { label: 'Active Students', value: 214, icon: 'bi-people', trend: '+6 this week' },
  { label: 'Active Trainers', value: 12, icon: 'bi-person-badge', trend: '+1 this week' },
  { label: 'Running Batches', value: 8, icon: 'bi-collection', trend: '2 starting soon' },
  { label: 'Avg. Attendance', value: 91, suffix: '%', icon: 'bi-check2-square', trend: '-2%' },
]

export const recentBatches = [
  { name: 'Java Full Stack A', trainer: 'Rohit Kulkarni', students: 28, attendanceToday: 26, progress: 62 },
  { name: 'Java Full Stack B', trainer: 'Neha Joshi', students: 24, attendanceToday: 21, progress: 48 },
  { name: 'MERN Stack A', trainer: 'Aakash Verma', students: 22, attendanceToday: 20, progress: 71 },
]

export const todaysTopics = [
  { batch: 'Java Full Stack A', topic: 'Collections Framework — HashMap & TreeMap', trainer: 'Rohit Kulkarni' },
  { batch: 'MERN Stack A', topic: 'React Hooks — useEffect deep dive', trainer: 'Aakash Verma' },
]

export const trainersData = [
  { id: 1, name: 'Rohit Kulkarni', email: 'rohit.k@skilltrack.dev', specialization: 'Java Full Stack', batches: 2, status: 'Active' },
  { id: 2, name: 'Neha Joshi', email: 'neha.j@skilltrack.dev', specialization: 'Java Full Stack', batches: 1, status: 'Active' },
  { id: 3, name: 'Aakash Verma', email: 'aakash.v@skilltrack.dev', specialization: 'MERN Stack', batches: 1, status: 'Active' },
  { id: 4, name: 'Sneha Patil', email: 'sneha.p@skilltrack.dev', specialization: 'Communication Skills', batches: 3, status: 'On Leave' },
]

export const studentsData = [
  { id: 1, name: 'Aditi Deshmukh', email: 'aditi.d@student.dev', batch: 'Java Full Stack A', attendance: 94, status: 'Active' },
  { id: 2, name: 'Rahul Shinde', email: 'rahul.s@student.dev', batch: 'Java Full Stack A', attendance: 78, status: 'Active' },
  { id: 3, name: 'Sanika More', email: 'sanika.m@student.dev', batch: 'MERN Stack A', attendance: 88, status: 'Active' },
  { id: 4, name: 'Omkar Jadhav', email: 'omkar.j@student.dev', batch: 'Java Full Stack B', attendance: 65, status: 'At Risk' },
  { id: 5, name: 'Priyanka Rane', email: 'priyanka.r@student.dev', batch: 'MERN Stack A', attendance: 91, status: 'Active' },
  { id: 6, name: 'Vivek Naik', email: 'vivek.n@student.dev', batch: 'Java Full Stack B', attendance: 70, status: 'At Risk' },
  { id: 7, name: 'Sakshi Pawar', email: 'sakshi.p@student.dev', batch: 'Java Full Stack A', attendance: 96, status: 'Active' },
]

export const batchesData = [
  { id: 1, name: 'Java Full Stack A', course: 'Java Full Stack', trainer: 'Rohit Kulkarni', students: 28, startDate: '2026-04-01', status: 'Running' },
  { id: 2, name: 'Java Full Stack B', course: 'Java Full Stack', trainer: 'Neha Joshi', students: 24, startDate: '2026-05-12', status: 'Running' },
  { id: 3, name: 'MERN Stack A', course: 'MERN Stack', trainer: 'Aakash Verma', students: 22, startDate: '2026-03-15', status: 'Running' },
  { id: 4, name: 'Java Full Stack C', course: 'Java Full Stack', trainer: 'Rohit Kulkarni', students: 0, startDate: '2026-08-01', status: 'Upcoming' },
]

export const coursesData = [
  { id: 1, name: 'Java Full Stack', duration: '6 months', modules: 12, batches: 3, status: 'Active' },
  { id: 2, name: 'MERN Stack', duration: '5 months', modules: 10, batches: 1, status: 'Active' },
  { id: 3, name: 'Communication & Soft Skills', duration: '1 month', modules: 4, batches: 4, status: 'Active' },
]

export const trainerOptions = trainersData.map((t) => ({ label: t.name, value: t.name }))
export const courseOptions = coursesData.map((c) => ({ label: c.name, value: c.name }))
export const batchOptions = batchesData.map((b) => ({ label: b.name, value: b.name }))

// The demo trainer login ("trainer@skilltrack.dev") maps to this name.
// Used to scope Trainer-module pages to only the batches that trainer teaches.
export const CURRENT_TRAINER_NAME = 'Rohit Kulkarni'

export const trainerBatchOptions = batchesData
  .filter((b) => b.trainer === CURRENT_TRAINER_NAME)
  .map((b) => ({ label: b.name, value: b.name }))

export function getStudentsByBatch(batchName) {
  return studentsData.filter((s) => s.batch === batchName)
}

export function getBatchAvgAttendance(batchName) {
  const students = getStudentsByBatch(batchName)
  if (students.length === 0) return 0
  const total = students.reduce((sum, s) => sum + s.attendance, 0)
  return Math.round(total / students.length)
}

// Institute-wide attendance across the last 8 sessions — used by Admin Reports.
export const attendanceTrendData = [
  { session: 'S1', avgAttendance: 88 },
  { session: 'S2', avgAttendance: 91 },
  { session: 'S3', avgAttendance: 85 },
  { session: 'S4', avgAttendance: 93 },
  { session: 'S5', avgAttendance: 90 },
  { session: 'S6', avgAttendance: 87 },
  { session: 'S7', avgAttendance: 94 },
  { session: 'S8', avgAttendance: 91 },
]

export const notificationsData = [
  {
    id: 1,
    type: 'Assignment',
    title: 'New assignment posted',
    message: '"Employee CRUD using Collections" was assigned to Java Full Stack A. Due 2026-07-10.',
    date: '2026-07-04',
    read: false,
  },
  {
    id: 2,
    type: 'Attendance',
    title: 'Low attendance alert',
    message: 'Omkar Jadhav\'s attendance has dropped to 65% in Java Full Stack B.',
    date: '2026-07-03',
    read: false,
  },
  {
    id: 3,
    type: 'Announcement',
    title: 'Mock interview week scheduled',
    message: 'Mock interviews for all final-stage batches will run July 20-24.',
    date: '2026-07-02',
    read: true,
  },
  {
    id: 4,
    type: 'Quiz',
    title: 'Quiz results published',
    message: 'Results for "Streams API Practice Set" are now visible to students.',
    date: '2026-07-01',
    read: true,
  },
]

export const topicLogsData = [
  {
    id: 1,
    batch: 'Java Full Stack A',
    course: 'Java Full Stack',
    topic: 'Collections Framework — HashMap & TreeMap',
    duration: 2,
    date: '2026-07-04',
    homework: 'Solve 5 problems using HashMap',
    remarks: 'Students understood Collections well. A few need revision on TreeMap ordering.',
  },
  {
    id: 2,
    batch: 'Java Full Stack A',
    course: 'Java Full Stack',
    topic: 'Streams API — map, filter, reduce',
    duration: 1.5,
    date: '2026-07-03',
    homework: 'Rewrite last week\'s loops using Streams',
    remarks: 'Good engagement, majority completed the in-class exercise.',
  },
  {
    id: 3,
    batch: 'Java Full Stack C',
    course: 'Java Full Stack',
    topic: 'Core Java — OOP Basics',
    duration: 2,
    date: '2026-07-02',
    homework: 'Read chapter on inheritance',
    remarks: 'First session with the new batch, covered introductions and setup.',
  },
]

export const assignmentsData = [
  {
    id: 1,
    title: 'Employee CRUD using Collections',
    batch: 'Java Full Stack A',
    dueDate: '2026-07-10',
    totalStudents: 28,
    submissions: 19,
    status: 'Open',
  },
  {
    id: 2,
    title: 'Streams API Practice Set',
    batch: 'Java Full Stack A',
    dueDate: '2026-07-06',
    totalStudents: 28,
    submissions: 28,
    status: 'Closed',
  },
  {
    id: 3,
    title: 'OOP Mini Project',
    batch: 'Java Full Stack C',
    dueDate: '2026-07-15',
    totalStudents: 12,
    submissions: 3,
    status: 'Open',
  },
]
