import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import { trainerBatchOptions, getStudentsByBatch } from '../../data/dummyData'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Marks() {
  const [records, setRecords] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [title, setTitle] = useState('')
  const [batch, setBatch] = useState(trainerBatchOptions[0]?.value || '')
  const [totalMarks, setTotalMarks] = useState(20)
  const [date, setDate] = useState(todayISO())
  const [scores, setScores] = useState({})

  const students = getStudentsByBatch(batch)

  // When the batch changes (and we're not mid-edit of a saved record),
  // reset the score sheet so the new batch's students start blank.
  useEffect(() => {
    if (editingId) return
    const initial = {}
    students.forEach((s) => {
      initial[s.id] = ''
    })
    setScores(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch])

  const setScore = (studentId, value) => {
    const num = value === '' ? '' : Math.max(0, Math.min(Number(totalMarks) || 0, Number(value)))
    setScores((prev) => ({ ...prev, [studentId]: num }))
  }

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setTotalMarks(20)
    setDate(todayISO())
    const initial = {}
    getStudentsByBatch(batch).forEach((s) => {
      initial[s.id] = ''
    })
    setScores(initial)
  }

  const handleSave = () => {
    if (!title.trim() || students.length === 0) return
    const record = {
      id: editingId || Date.now(),
      title,
      batch,
      totalMarks: Number(totalMarks) || 0,
      date,
      scores: students.map((s) => ({ studentId: s.id, name: s.name, score: scores[s.id] === '' ? 0 : Number(scores[s.id]) })),
    }
    if (editingId) {
      setRecords((prev) => prev.map((r) => (r.id === editingId ? record : r)))
    } else {
      setRecords((prev) => [record, ...prev])
    }
    resetForm()
  }

  const handleEdit = (record) => {
    setEditingId(record.id)
    setTitle(record.title)
    setBatch(record.batch)
    setTotalMarks(record.totalMarks)
    setDate(record.date)
    const loaded = {}
    record.scores.forEach((s) => {
      loaded[s.studentId] = s.score
    })
    setScores(loaded)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this assessment record?')) {
      setRecords((prev) => prev.filter((r) => r.id !== id))
      if (editingId === id) resetForm()
    }
  }

  const average = (record) => {
    if (record.scores.length === 0) return 0
    const total = record.scores.reduce((sum, s) => sum + s.score, 0)
    return Math.round((total / record.scores.length) * 10) / 10
  }

  return (
    <DashboardLayout title="Marks">
      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <Card title={editingId ? 'Edit assessment' : 'New assessment'} eyebrow="Score entry">
            <div className="pulse-line" />

            <div className="row g-2 mb-2">
              <div className="col-12 col-sm-6">
                <label className="form-label st-eyebrow">Assessment title</label>
                <input
                  className="form-control"
                  placeholder="e.g. Collections Quiz 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-6 col-sm-3">
                <label className="form-label st-eyebrow">Total marks</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
              </div>
              <div className="col-6 col-sm-3">
                <label className="form-label st-eyebrow">Date</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label st-eyebrow">Batch</label>
              <select
                className="form-select"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                disabled={!!editingId}
              >
                {trainerBatchOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex flex-column gap-2 mt-3">
              {students.map((s) => (
                <div key={s.id} className="d-flex align-items-center justify-content-between gap-2">
                  <div className="text-truncate" style={{ fontSize: '0.88rem' }}>
                    {s.name}
                  </div>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{ width: 90 }}
                    min="0"
                    max={totalMarks}
                    placeholder={`/ ${totalMarks}`}
                    value={scores[s.id] ?? ''}
                    onChange={(e) => setScore(s.id, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="d-flex gap-2 mt-3 flex-wrap">
              <button className="btn btn-st-primary" onClick={handleSave}>
                <i className="bi bi-check2-circle me-1" /> {editingId ? 'Update assessment' : 'Save assessment'}
              </button>
              {editingId && (
                <button className="btn btn-st-outline" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </Card>
        </div>

        <div className="col-12 col-lg-5">
          <Card title="Saved assessments" eyebrow="History">
            <div className="pulse-line" />
            {records.length === 0 && <p className="text-muted mb-0">No assessments saved yet.</p>}
            <div className="d-flex flex-column gap-3">
              {records.map((r) => (
                <div key={r.id} className="p-2" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span className="st-badge st-badge-red">{r.batch}</span>
                    <span className="st-eyebrow">{r.date}</span>
                  </div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{r.title}</div>
                  <div className="st-eyebrow mt-1">
                    Avg: {average(r)} / {r.totalMarks} &middot; {r.scores.length} students
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-sm btn-st-outline" onClick={() => handleEdit(r)}>
                      <i className="bi bi-pencil" />
                    </button>
                    <button className="btn btn-sm btn-st-outline" style={{ color: 'var(--red-dark)' }} onClick={() => handleDelete(r.id)}>
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
