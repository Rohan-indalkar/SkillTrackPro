import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import useCrud from '../../hooks/useCrud'
import { topicLogsData, trainerBatchOptions, courseOptions } from '../../data/dummyData'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

const EMPTY_FORM = {
  batch: trainerBatchOptions[0]?.value || '',
  course: courseOptions[0]?.value || '',
  topic: '',
  duration: '',
  homework: '',
  remarks: '',
  date: todayISO(),
}

export default function Topics() {
  const { items, add } = useCrud(topicLogsData)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filterBatch, setFilterBatch] = useState('All')

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.topic.trim()) return
    add({ ...form })
    setForm({ ...EMPTY_FORM, batch: form.batch, course: form.course })
  }

  const visibleLogs = (filterBatch === 'All' ? items : items.filter((t) => t.batch === filterBatch))
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))

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
                    {trainerBatchOptions.map((opt) => (
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

              <button type="submit" className="btn btn-st-primary w-100">
                <i className="bi bi-plus-lg me-1" /> Log topic
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
                {trainerBatchOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            }
          >
            <div className="pulse-line" />
            {visibleLogs.length === 0 && <p className="text-muted mb-0">No topics logged yet.</p>}
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
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
