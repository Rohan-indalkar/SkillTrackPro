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
