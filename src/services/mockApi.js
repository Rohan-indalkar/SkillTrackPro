// ============================================================================
// MOCK API — a stand-in backend that lives entirely in the browser.
//
// Every function here returns a Promise and has the same shape a real
// `axios.get('/api/...')` call would have. When the Spring Boot backend
// exists, replace the body of each function with a real HTTP call — nothing
// in any page needs to change, because pages never touch this file's
// internal arrays directly.
//
// State is persisted to localStorage so submissions, attendance, marks, etc.
// survive a page refresh instead of resetting like a demo.
// ============================================================================

const STORAGE_KEY = 'skilltrack_mock_db_v1'
const NETWORK_DELAY = 350

function delay(value, ms = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// Seed data — only used the very first time the app runs (no localStorage yet)
// ---------------------------------------------------------------------------
const SEED = {
  trainers: [
    { id: 1, name: 'Rohit Kulkarni', email: 'rohit.k@skilltrack.dev', specialization: 'Java Full Stack', status: 'Active' },
    { id: 2, name: 'Neha Joshi', email: 'neha.j@skilltrack.dev', specialization: 'Java Full Stack', status: 'Active' },
    { id: 3, name: 'Aakash Verma', email: 'aakash.v@skilltrack.dev', specialization: 'MERN Stack', status: 'Active' },
    { id: 4, name: 'Sneha Patil', email: 'sneha.p@skilltrack.dev', specialization: 'Communication Skills', status: 'On Leave' },
  ],
  students: [
    { id: 1, name: 'Aditi Deshmukh', email: 'aditi.d@student.dev', batch: 'Java Full Stack A', attendance: 94, status: 'Active' },
    { id: 2, name: 'Rahul Shinde', email: 'rahul.s@student.dev', batch: 'Java Full Stack A', attendance: 78, status: 'Active' },
    { id: 3, name: 'Sanika More', email: 'sanika.m@student.dev', batch: 'MERN Stack A', attendance: 88, status: 'Active' },
    { id: 4, name: 'Omkar Jadhav', email: 'omkar.j@student.dev', batch: 'Java Full Stack B', attendance: 65, status: 'At Risk' },
    { id: 5, name: 'Priyanka Rane', email: 'priyanka.r@student.dev', batch: 'MERN Stack A', attendance: 91, status: 'Active' },
    { id: 6, name: 'Vivek Naik', email: 'vivek.n@student.dev', batch: 'Java Full Stack B', attendance: 70, status: 'At Risk' },
    { id: 7, name: 'Sakshi Pawar', email: 'sakshi.p@student.dev', batch: 'Java Full Stack A', attendance: 96, status: 'Active' },
  ],
  batches: [
    { id: 1, name: 'Java Full Stack A', course: 'Java Full Stack', trainer: 'Rohit Kulkarni', startDate: '2026-04-01', status: 'Running', progress: 62 },
    { id: 2, name: 'Java Full Stack B', course: 'Java Full Stack', trainer: 'Neha Joshi', startDate: '2026-05-12', status: 'Running', progress: 48 },
    { id: 3, name: 'MERN Stack A', course: 'MERN Stack', trainer: 'Aakash Verma', startDate: '2026-03-15', status: 'Running', progress: 71 },
    { id: 4, name: 'Java Full Stack C', course: 'Java Full Stack', trainer: 'Rohit Kulkarni', startDate: '2026-08-01', status: 'Upcoming', progress: 0 },
  ],
  courses: [
    { id: 1, name: 'Java Full Stack', duration: '6 months', modules: 12, status: 'Active' },
    { id: 2, name: 'MERN Stack', duration: '5 months', modules: 10, status: 'Active' },
    { id: 3, name: 'Communication & Soft Skills', duration: '1 month', modules: 4, status: 'Active' },
  ],
  topics: [
    { id: 1, batch: 'Java Full Stack A', course: 'Java Full Stack', topic: 'Collections Framework — HashMap & TreeMap', duration: 2, date: '2026-07-04', homework: 'Solve 5 problems using HashMap', remarks: 'Students understood Collections well. A few need revision on TreeMap ordering.' },
    { id: 2, batch: 'Java Full Stack A', course: 'Java Full Stack', topic: 'Streams API — map, filter, reduce', duration: 1.5, date: '2026-07-03', homework: "Rewrite last week's loops using Streams", remarks: 'Good engagement, majority completed the in-class exercise.' },
    { id: 3, batch: 'Java Full Stack C', course: 'Java Full Stack', topic: 'Core Java — OOP Basics', duration: 2, date: '2026-07-02', homework: 'Read chapter on inheritance', remarks: 'First session with the new batch, covered introductions and setup.' },
  ],
  assignments: [
    { id: 1, title: 'Employee CRUD using Collections', batch: 'Java Full Stack A', dueDate: '2026-07-10', description: 'Build a small CRUD app for Employee records using HashMap.', fileName: '', fileUrl: '', status: 'Open' },
    { id: 2, title: 'Streams API Practice Set', batch: 'Java Full Stack A', dueDate: '2026-07-06', description: 'Rewrite the provided loop-based solutions using Streams.', fileName: '', fileUrl: '', status: 'Closed' },
    { id: 3, title: 'OOP Mini Project', batch: 'Java Full Stack C', dueDate: '2026-07-15', description: 'A small project demonstrating inheritance and polymorphism.', fileName: '', fileUrl: '', status: 'Open' },
  ],
  // { [assignmentId]: { [studentId]: { fileName, fileUrl, submittedAt } } }
  submissions: {
    2: { 1: { fileName: 'streams-practice-aditi.pdf', fileUrl: '', submittedAt: '2026-07-05' } },
  },
  marksRecords: [
    { id: 1, title: 'Collections Quiz 1', batch: 'Java Full Stack A', totalMarks: 20, date: '2026-07-04', scores: [{ studentId: 1, name: 'Aditi Deshmukh', score: 18 }, { studentId: 2, name: 'Rahul Shinde', score: 12 }, { studentId: 7, name: 'Sakshi Pawar', score: 19 }] },
    { id: 2, title: 'Streams API Practice Set', batch: 'Java Full Stack A', totalMarks: 25, date: '2026-07-06', scores: [{ studentId: 1, name: 'Aditi Deshmukh', score: 21 }, { studentId: 2, name: 'Rahul Shinde', score: 15 }, { studentId: 7, name: 'Sakshi Pawar', score: 24 }] },
    { id: 3, title: 'Core Java Basics — Viva', batch: 'Java Full Stack A', totalMarks: 10, date: '2026-06-28', scores: [{ studentId: 1, name: 'Aditi Deshmukh', score: 8 }, { studentId: 2, name: 'Rahul Shinde', score: 7 }, { studentId: 7, name: 'Sakshi Pawar', score: 9 }] },
  ],
  // { [studentId]: [{ date, status }] }
  attendanceHistory: {
    1: [
      { date: '2026-06-22', status: 'Present' },
      { date: '2026-06-24', status: 'Present' },
      { date: '2026-06-26', status: 'Late' },
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-07-01', status: 'Present' },
      { date: '2026-07-02', status: 'Absent' },
      { date: '2026-07-03', status: 'Present' },
      { date: '2026-07-04', status: 'Present' },
    ],
  },
  attendanceTrend: [
    { session: 'S1', avgAttendance: 88 },
    { session: 'S2', avgAttendance: 91 },
    { session: 'S3', avgAttendance: 85 },
    { session: 'S4', avgAttendance: 93 },
    { session: 'S5', avgAttendance: 90 },
    { session: 'S6', avgAttendance: 87 },
    { session: 'S7', avgAttendance: 94 },
    { session: 'S8', avgAttendance: 91 },
  ],
  notifications: [
    { id: 1, audience: 'ADMIN', type: 'Attendance', title: 'Low attendance alert', message: "Omkar Jadhav's attendance has dropped to 65% in Java Full Stack B.", date: '2026-07-03', read: false },
    { id: 2, audience: 'TRAINER', type: 'Attendance', title: 'Low attendance alert', message: "Omkar Jadhav's attendance has dropped to 65% in Java Full Stack B.", date: '2026-07-03', read: false },
    { id: 3, audience: 'ALL', type: 'Announcement', title: 'Mock interview week scheduled', message: 'Mock interviews for all final-stage batches will run July 20-24.', date: '2026-07-02', read: false },
    { id: 4, audience: 'TRAINER', type: 'Assignment', title: 'New assignment posted', message: '"Employee CRUD using Collections" was assigned to Java Full Stack A. Due 2026-07-10.', date: '2026-07-04', read: false },
    { id: 5, audience: 'STUDENT', type: 'Quiz', title: 'Quiz results published', message: 'Results for "Streams API Practice Set" are now visible under Marks.', date: '2026-07-06', read: false },
    { id: 6, audience: 'STUDENT', type: 'Attendance', title: 'Attendance reminder', message: 'Your attendance is at 94% — keep it up to stay eligible for placement drives.', date: '2026-06-30', read: true },
  ],
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to seed
  }
  return JSON.parse(JSON.stringify(SEED))
}

let state = loadState()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable — app still works for the session
  }
}

// Demo login accounts. Real auth will replace this with a database lookup.
const DEMO_ACCOUNTS = {
  'admin@skilltrack.dev': { password: 'admin123', role: 'ADMIN', name: 'Priya Sharma' },
  'trainer@skilltrack.dev': { password: 'trainer123', role: 'TRAINER', name: 'Rohit Kulkarni' },
  'student@skilltrack.dev': { password: 'student123', role: 'STUDENT', name: 'Aditi Deshmukh' },
}

// ---------------------------------------------------------------------------
// auth
// ---------------------------------------------------------------------------
const auth = {
  login(email, password) {
    const account = DEMO_ACCOUNTS[email]
    if (!account || account.password !== password) {
      return delay({ success: false, message: 'Invalid email or password.' }, 250)
    }
    return delay({ success: true, user: { email, role: account.role, name: account.name } }, 250)
  },
}

// ---------------------------------------------------------------------------
// trainers
// ---------------------------------------------------------------------------
const trainers = {
  getAll: () => delay([...state.trainers]),
  findByEmail: (email) => delay(state.trainers.find((t) => t.email === email) || null),
  create: (data) => {
    const record = { ...data, id: nextId(state.trainers) }
    state.trainers.push(record)
    persist()
    return delay(record)
  },
  update: (id, patch) => {
    state.trainers = state.trainers.map((t) => (t.id === id ? { ...t, ...patch } : t))
    persist()
    return delay(state.trainers.find((t) => t.id === id))
  },
  remove: (id) => {
    state.trainers = state.trainers.filter((t) => t.id !== id)
    persist()
    return delay({ success: true })
  },
}

// ---------------------------------------------------------------------------
// students
// ---------------------------------------------------------------------------
const students = {
  getAll: () => delay([...state.students]),
  getByBatch: (batchName) => delay(state.students.filter((s) => s.batch === batchName)),
  findByEmail: (email) => delay(state.students.find((s) => s.email === email) || null),
  create: (data) => {
    const record = { attendance: 100, status: 'Active', ...data, id: nextId(state.students) }
    state.students.push(record)
    persist()
    return delay(record)
  },
  update: (id, patch) => {
    state.students = state.students.map((s) => (s.id === id ? { ...s, ...patch } : s))
    persist()
    return delay(state.students.find((s) => s.id === id))
  },
  remove: (id) => {
    state.students = state.students.filter((s) => s.id !== id)
    persist()
    return delay({ success: true })
  },
}

// ---------------------------------------------------------------------------
// batches
// ---------------------------------------------------------------------------
const batches = {
  getAll: () => delay([...state.batches]),
  getByTrainer: (trainerName) => delay(state.batches.filter((b) => b.trainer === trainerName)),
  create: (data) => {
    const record = { status: 'Upcoming', progress: 0, ...data, id: nextId(state.batches) }
    state.batches.push(record)
    persist()
    return delay(record)
  },
  update: (id, patch) => {
    state.batches = state.batches.map((b) => (b.id === id ? { ...b, ...patch } : b))
    persist()
    return delay(state.batches.find((b) => b.id === id))
  },
  remove: (id) => {
    state.batches = state.batches.filter((b) => b.id !== id)
    persist()
    return delay({ success: true })
  },
  studentCount: (batchName) => state.students.filter((s) => s.batch === batchName).length,
}

// ---------------------------------------------------------------------------
// courses
// ---------------------------------------------------------------------------
const courses = {
  getAll: () => delay([...state.courses]),
  create: (data) => {
    const record = { status: 'Active', ...data, id: nextId(state.courses) }
    state.courses.push(record)
    persist()
    return delay(record)
  },
  update: (id, patch) => {
    state.courses = state.courses.map((c) => (c.id === id ? { ...c, ...patch } : c))
    persist()
    return delay(state.courses.find((c) => c.id === id))
  },
  remove: (id) => {
    state.courses = state.courses.filter((c) => c.id !== id)
    persist()
    return delay({ success: true })
  },
  batchCount: (courseName) => state.batches.filter((b) => b.course === courseName).length,
}

// ---------------------------------------------------------------------------
// topics (daily topic tracker)
// ---------------------------------------------------------------------------
const topics = {
  getAll: (filter = {}) =>
    delay(
      state.topics
        .filter((t) => !filter.batch || t.batch === filter.batch)
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : -1))
    ),
  create: (data) => {
    const record = { ...data, id: nextId(state.topics) }
    state.topics.push(record)
    persist()
    return delay(record)
  },
}

// ---------------------------------------------------------------------------
// assignments + submissions
// ---------------------------------------------------------------------------
const assignments = {
  getAll: (filter = {}) =>
    delay(
      state.assignments
        .filter((a) => !filter.batch || a.batch === filter.batch)
        .map((a) => ({
          ...a,
          totalStudents: batches.studentCount(a.batch),
          submissions: Object.keys(state.submissions[a.id] || {}).length,
        }))
    ),
  create: (data) => {
    const record = { status: 'Open', fileName: '', fileUrl: '', ...data, id: nextId(state.assignments) }
    state.assignments.push(record)
    notifications._create({
      audience: 'STUDENT',
      type: 'Assignment',
      title: 'New assignment posted',
      message: `"${record.title}" was assigned to ${record.batch}. Due ${record.dueDate}.`,
    })
    persist()
    return delay(record)
  },
  update: (id, patch) => {
    state.assignments = state.assignments.map((a) => (a.id === id ? { ...a, ...patch } : a))
    persist()
    return delay(state.assignments.find((a) => a.id === id))
  },
  remove: (id) => {
    state.assignments = state.assignments.filter((a) => a.id !== id)
    delete state.submissions[id]
    persist()
    return delay({ success: true })
  },
  getSubmission: (assignmentId, studentId) => delay((state.submissions[assignmentId] || {})[studentId] || null),
  submit: (assignmentId, studentId, file) => {
    if (!state.submissions[assignmentId]) state.submissions[assignmentId] = {}
    state.submissions[assignmentId][studentId] = { ...file, submittedAt: todayISO() }
    persist()
    return delay(state.submissions[assignmentId][studentId])
  },
  withdraw: (assignmentId, studentId) => {
    if (state.submissions[assignmentId]) delete state.submissions[assignmentId][studentId]
    persist()
    return delay({ success: true })
  },
}

// ---------------------------------------------------------------------------
// marks
// ---------------------------------------------------------------------------
const marks = {
  getAll: (filter = {}) =>
    delay(state.marksRecords.filter((m) => !filter.batch || m.batch === filter.batch).slice().sort((a, b) => (a.date < b.date ? 1 : -1))),
  getForStudent: (studentName, filter = {}) =>
    delay(
      state.marksRecords
        .filter((m) => !filter.batch || m.batch === filter.batch)
        .map((m) => {
          const mine = m.scores.find((s) => s.name === studentName)
          const score = mine?.score ?? 0
          return { id: m.id, title: m.title, date: m.date, batch: m.batch, totalMarks: m.totalMarks, score, percent: Math.round((score / m.totalMarks) * 100) }
        })
        .sort((a, b) => (a.date < b.date ? 1 : -1))
    ),
  create: (data) => {
    const record = { ...data, id: nextId(state.marksRecords) }
    state.marksRecords.push(record)
    notifications._create({
      audience: 'STUDENT',
      type: 'Quiz',
      title: 'Quiz results published',
      message: `Results for "${record.title}" are now visible under Marks.`,
    })
    persist()
    return delay(record)
  },
  update: (id, patch) => {
    state.marksRecords = state.marksRecords.map((m) => (m.id === id ? { ...m, ...patch } : m))
    persist()
    return delay(state.marksRecords.find((m) => m.id === id))
  },
  remove: (id) => {
    state.marksRecords = state.marksRecords.filter((m) => m.id !== id)
    persist()
    return delay({ success: true })
  },
}

// ---------------------------------------------------------------------------
// attendance
// ---------------------------------------------------------------------------
function statusToPoints(status) {
  return status === 'Present' ? 100 : status === 'Late' ? 50 : 0
}

const attendance = {
  // records: { [studentId]: 'Present' | 'Absent' | 'Late' }
  mark: (batchName, date, records) => {
    Object.entries(records).forEach(([studentIdStr, status]) => {
      const studentId = Number(studentIdStr)
      if (!state.attendanceHistory[studentId]) state.attendanceHistory[studentId] = []
      const history = state.attendanceHistory[studentId].filter((h) => h.date !== date)
      history.push({ date, status })
      state.attendanceHistory[studentId] = history

      const percent = Math.round(history.reduce((sum, h) => sum + statusToPoints(h.status), 0) / history.length)
      const student = state.students.find((s) => s.id === studentId)
      if (student) {
        student.attendance = percent
        student.status = percent < 75 ? 'At Risk' : 'Active'
      }
    })
    persist()
    return delay({ success: true })
  },
  history: (studentId) =>
    delay((state.attendanceHistory[studentId] || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1))),
}

// ---------------------------------------------------------------------------
// notifications
// ---------------------------------------------------------------------------
const notifications = {
  getForRole: (role) =>
    delay(
      state.notifications
        .filter((n) => n.audience === role || n.audience === 'ALL')
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id))
    ),
  unreadCount: (role) =>
    state.notifications.filter((n) => (n.audience === role || n.audience === 'ALL') && !n.read).length,
  markRead: (id) => {
    state.notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    persist()
    return delay({ success: true })
  },
  markAllRead: (role) => {
    state.notifications = state.notifications.map((n) =>
      n.audience === role || n.audience === 'ALL' ? { ...n, read: true } : n
    )
    persist()
    return delay({ success: true })
  },
  broadcast: ({ title, message }) => {
    const record = notifications._create({ audience: 'ALL', type: 'Announcement', title, message })
    return delay(record)
  },
  // internal — used by other services to auto-generate notifications
  _create: ({ audience, type, title, message }) => {
    const record = { id: nextId(state.notifications), audience, type, title, message, date: todayISO(), read: false }
    state.notifications.push(record)
    persist()
    return record
  },
}

// ---------------------------------------------------------------------------
// reports
// ---------------------------------------------------------------------------
const reports = {
  attendanceTrend: () => delay([...state.attendanceTrend]),
  batchAvgAttendance: (batchName) => {
    const list = state.students.filter((s) => s.batch === batchName)
    if (list.length === 0) return 0
    return Math.round(list.reduce((sum, s) => sum + s.attendance, 0) / list.length)
  },
  batchComparison: () =>
    delay(
      state.batches
        .filter((b) => batches.studentCount(b.name) > 0)
        .map((b) => ({ name: b.name, attendance: reports.batchAvgAttendance(b.name) }))
    ),
  statusDistribution: () => {
    const active = state.students.filter((s) => s.status === 'Active').length
    const atRisk = state.students.filter((s) => s.status === 'At Risk').length
    return delay([
      { name: 'Active', value: active },
      { name: 'At Risk', value: atRisk },
    ])
  },
}

// ---------------------------------------------------------------------------
// ai — rule-based today; swap the function bodies for a real LLM call later
// (e.g. POST to your backend, which calls Claude) without changing any page.
// ---------------------------------------------------------------------------
const ai = {
  studyRecommendation: (student, myAssessments) =>
    delay(buildStudyRecommendation(student, myAssessments), 500),
  batchInsight: (batchName, batchStudents, myAssessments) =>
    delay(buildBatchInsight(batchName, batchStudents, myAssessments), 500),
}

function buildStudyRecommendation(student, myAssessments) {
  const sorted = myAssessments.slice().sort((a, b) => a.percent - b.percent)
  const weakest = sorted[0]
  const bullets = []

  if (student && student.attendance < 80) {
    bullets.push(`Attendance is at ${student.attendance}% — sessions you miss compound quickly in a fast-paced course. Aim for 90%+.`)
  }
  if (weakest) {
    bullets.push(`Your weakest assessment is "${weakest.title}" at ${weakest.percent}%. Revisit that topic and redo 5-10 practice problems this week.`)
  }
  const strong = sorted[sorted.length - 1]
  if (strong && strong.percent >= 85) {
    bullets.push(`Strong performance on "${strong.title}" (${strong.percent}%) — you're ready to move to harder problems in this area.`)
  }
  if (bullets.length === 0) {
    bullets.push('No assessments recorded yet — once you have a few scores, this will highlight exactly what to focus on.')
  }

  return {
    headline: weakest ? `Focus this week: ${weakest.title}` : 'Keep building your track record',
    bullets,
  }
}

function buildBatchInsight(batchName, batchStudents, myAssessments) {
  const avgAttendance = batchStudents.length
    ? Math.round(batchStudents.reduce((sum, s) => sum + s.attendance, 0) / batchStudents.length)
    : 0
  const atRisk = batchStudents.filter((s) => s.attendance < 75)
  const weakestAssessment = myAssessments.length
    ? myAssessments
        .map((m) => ({
          title: m.title,
          avgPercent: Math.round(m.scores.reduce((s, x) => s + (x.score / m.totalMarks) * 100, 0) / m.scores.length),
        }))
        .sort((a, b) => a.avgPercent - b.avgPercent)[0]
    : null

  const bullets = []
  if (atRisk.length > 0) {
    bullets.push(`${atRisk.length} student${atRisk.length > 1 ? 's' : ''} below 75% attendance: ${atRisk.map((s) => s.name).join(', ')}.`)
  }
  if (weakestAssessment) {
    bullets.push(`Batch average was lowest on "${weakestAssessment.title}" (${weakestAssessment.avgPercent}%) — consider a short revision session.`)
  }
  if (bullets.length === 0) {
    bullets.push('No concerning patterns right now — batch is tracking well.')
  }

  return {
    headline: `${batchName}: ${avgAttendance}% avg attendance`,
    bullets,
  }
}

export const api = {
  auth,
  trainers,
  students,
  batches,
  courses,
  topics,
  assignments,
  marks,
  attendance,
  notifications,
  reports,
  ai,
}
