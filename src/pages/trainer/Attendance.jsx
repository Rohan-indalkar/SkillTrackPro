import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/mockApi'

const STATUSES = ['Present', 'Absent', 'Late']

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Attendance() {
  const { user } = useAuth()
  const toast = useToast()

  const [batchOptions, setBatchOptions] = useState([])
  const [batch, setBatch] = useState('')
  const [date, setDate] = useState(todayISO())
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load this trainer's batches once
  useEffect(() => {
    let active = true
    api.trainers.findByEmail(user.email).then((trainer) => {
      if (!trainer) return
      api.batches.getByTrainer(trainer.name).then((batches) => {
        if (!active) return
        setBatchOptions(batches.map((b) => ({ label: b.name, value: b.name })))
        if (batches[0]) setBatch(batches[0].name)
      })
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reload students + reset attendance whenever batch/date changes
  useEffect(() => {
    if (!batch) return
    let active = true
    setLoading(true)
    api.students.getByBatch(batch).then((list) => {
      if (!active) return
      setStudents(list)
      const initial = {}
      list.forEach((s) => {
        initial[s.id] = 'Present'
      })
      setAttendance(initial)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [batch, date])

  const setStatus = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }))
  }

  const counts = students.reduce(
    (acc, s) => {
      const status = attendance[s.id] || 'Present'
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    { Present: 0, Absent: 0, Late: 0 }
  )

  const handleSave = async () => {
    setSaving(true)
    await api.attendance.mark(batch, date, attendance)
    setSaving(false)
    toast.success(`Attendance saved for ${date}.`)
  }

  return (
    <DashboardLayout title="Attendance">
      <Card title="Mark attendance" eyebrow="Daily register">
        <div className="pulse-line" />

        <div className="row g-2 mb-3">
          <div className="col-12 col-sm-6 col-lg-4">
            <label className="form-label st-eyebrow">Batch</label>
            <select className="form-select" value={batch} onChange={(e) => setBatch(e.target.value)}>
              {batchOptions.map((opt) => (
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

        {loading ? (
          <LoadingSkeleton variant="rows" rows={4} />
        ) : students.length === 0 ? (
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

        {!loading && students.length > 0 && (
          <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
            <button className="btn btn-st-primary" onClick={handleSave} disabled={saving}>
              <i className="bi bi-check2-circle me-1" /> {saving ? 'Saving…' : 'Save attendance'}
            </button>
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}
