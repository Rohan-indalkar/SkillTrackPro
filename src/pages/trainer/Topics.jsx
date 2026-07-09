import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/mockApi'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Topics() {
  const { user } = useAuth()
  const toast = useToast()

  const [batchOptions, setBatchOptions] = useState([])
  const [courseOptions, setCourseOptions] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterBatch, setFilterBatch] = useState('All')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ batch: '', course: '', topic: '', duration: '', homework: '', remarks: '', date: todayISO() })

  useEffect(() => {
    let active = true
    Promise.all([api.trainers.findByEmail(user.email), api.courses.getAll()]).then(([trainer, courses]) => {
      if (!active || !trainer) return
      setCourseOptions(courses.map((c) => ({ label: c.name, value: c.name })))
      api.batches.getByTrainer(trainer.name).then((batches) => {
        if (!active) return
        const opts = batches.map((b) => ({ label: b.name, value: b.name }))
        setBatchOptions(opts)
        setForm((f) => ({ ...f, batch: opts[0]?.value || '', course: courses[0]?.name || '' }))
      })
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reload = () => {
    setLoading(true)
    api.topics.getAll().then((data) => {
      setItems(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    reload()
  }, [])

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.topic.trim() || !form.batch) return
    setSaving(true)
    await api.topics.create({ ...form })
    setSaving(false)
    toast.success('Topic logged.')
    setForm((f) => ({ ...f, topic: '', homework: '', remarks: '', duration: '' }))
    reload()
  }

  const visibleLogs = filterBatch === 'All' ? items : items.filter((t) => t.batch === filterBatch)

  return (
    <DashboardLayout title="Daily Topic Tracker">
      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <Card title="Log today's session" eyebrow="New entry">
            <div className="pulse-line" />
            <form onSubmit={handleSubmit}>
              <div className="row g-2">
                <div className="col-12 col-sm-6">
                  <label className="form-label st-eyebrow">Batch</label>
                  <select className="form-select" value={form.batch} onChange={(e) => setField('batch', e.target.value)}>
                    {batchOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label st-eyebrow">Course</label>
                  <select className="form-select" value={form.course} onChange={(e) => setField('course', e.target.value)}>
                    {courseOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3 mt-2">
                <label className="form-label st-eyebrow">Topic / Subtopic</label>
                <input
                  className="form-control"
                  placeholder="e.g. Collections Framework — HashMap & TreeMap"
                  value={form.topic}
                  onChange={(e) => setField('topic', e.target.value)}
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-12 col-sm-6">
                  <label className="form-label st-eyebrow">Date</label>
                  <input type="date" className="form-control" value={form.date} onChange={(e) => setField('date', e.target.value)} />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label st-eyebrow">Duration (hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    className="form-control"
                    placeholder="2"
                    value={form.duration}
                    onChange={(e) => setField('duration', e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3 mt-2">
                <label className="form-label st-eyebrow">Homework</label>
                <input
                  className="form-control"
                  placeholder="e.g. Solve 5 problems using HashMap"
                  value={form.homework}
                  onChange={(e) => setField('homework', e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label st-eyebrow">Remarks</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="How did the class go?"
                  value={form.remarks}
                  onChange={(e) => setField('remarks', e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-st-primary w-100" disabled={saving}>
                <i className="bi bi-plus-lg me-1" /> {saving ? 'Logging…' : 'Log topic'}
              </button>
            </form>
          </Card>
        </div>

        <div className="col-12 col-lg-7">
          <Card
            title="Topic history"
            eyebrow="Recent sessions"
            action={
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
              >
                <option value="All">All batches</option>
                {batchOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            }
          >
            <div className="pulse-line" />
            {loading ? (
              <LoadingSkeleton variant="rows" rows={3} />
            ) : visibleLogs.length === 0 ? (
              <p className="text-muted mb-0">No topics logged yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {visibleLogs.map((log) => (
                  <div key={log.id} className="p-2" style={{ borderLeft: '3px solid var(--red)', paddingLeft: '0.75rem' }}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span className="st-badge st-badge-red">{log.batch}</span>
                      <span className="st-eyebrow">{log.date}</span>
                    </div>
                    <div style={{ fontWeight: 600, marginTop: 4 }}>{log.topic}</div>
                    {log.duration && <div className="st-eyebrow mt-1">Duration: {log.duration} hrs</div>}
                    {log.homework && (
                      <div className="mt-1" style={{ fontSize: '0.85rem' }}>
                        <strong>Homework:</strong> {log.homework}
                      </div>
                    )}
                    {log.remarks && (
                      <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                        {log.remarks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
