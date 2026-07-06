import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import { trainerBatchOptions, getStudentsByBatch } from '../../data/dummyData'

const STATUSES = ['Present', 'Absent', 'Late']

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Attendance() {
  const [batch, setBatch] = useState(trainerBatchOptions[0]?.value || '')
  const [date, setDate] = useState(todayISO())
  const [attendance, setAttendance] = useState({})
  const [saved, setSaved] = useState(false)

  const students = getStudentsByBatch(batch)

  // Reset to "Present" for everyone whenever the batch or date changes,
  // mirroring how a trainer would start a fresh register each session.
  useEffect(() => {
    const initial = {}
    students.forEach((s) => {
      initial[s.id] = 'Present'
    })
    setAttendance(initial)
    setSaved(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch, date])

  const setStatus = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
    setSaved(false)
  }

  const counts = students.reduce(
    (acc, s) => {
      const status = attendance[s.id] || 'Present'
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    { Present: 0, Absent: 0, Late: 0 }
  )

  const handleSave = () => {
    setSaved(true)
    // In production this posts { batch, date, attendance } to the Spring Boot API.
  }

  return (
    <DashboardLayout title="Attendance">
      <Card title="Mark attendance" eyebrow="Daily register">
        <div className="pulse-line" />

        <div className="row g-2 mb-3">
          <div className="col-12 col-sm-6 col-lg-4">
            <label className="form-label st-eyebrow">Batch</label>
            <select className="form-select" value={batch} onChange={(e) => setBatch(e.target.value)}>
              {trainerBatchOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <label className="form-label st-eyebrow">Date</label>
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="st-badge st-badge-success">Present: {counts.Present}</span>
          <span className="st-badge st-badge-warning">Absent: {counts.Absent}</span>
          <span className="st-badge st-badge-red">Late: {counts.Late}</span>
        </div>

        {students.length === 0 ? (
          <p className="text-muted mb-0">No students found in this batch.</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {students.map((s) => {
              const status = attendance[s.id] || 'Present'
              return (
                <div
                  key={s.id}
                  className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-2"
                  style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                >
                  <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 32, height: 32, background: 'var(--red-tint)', color: 'var(--red-dark)', fontWeight: 700, fontSize: '0.85rem' }}
                    >
                      {s.name[0]}
                    </div>
                    <div className="text-truncate">
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }} className="text-truncate">
                        {s.name}
                      </div>
                      <div className="st-eyebrow">{s.email}</div>
                    </div>
                  </div>

                  <div className="btn-group btn-group-sm flex-shrink-0" role="group">
                    {STATUSES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={st === status ? 'btn btn-st-primary' : 'btn btn-st-outline'}
                        onClick={() => setStatus(s.id, st)}
                      >
                        {st === 'Present' ? 'P' : st === 'Absent' ? 'A' : 'L'}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {students.length > 0 && (
          <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
            <button className="btn btn-st-primary" onClick={handleSave}>
              <i className="bi bi-check2-circle me-1" /> Save attendance
            </button>
            {saved && <span className="st-badge st-badge-success">Saved for {date}</span>}
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}
