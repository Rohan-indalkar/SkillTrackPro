import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/common/Card'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import PdfUpload from '../../components/common/PdfUpload'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/mockApi'

export default function Assignments() {
  const { user } = useAuth()
  const toast = useToast()
  const [student, setStudent] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState({})
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const s = await api.students.findByEmail(user.email)
    if (!s) {
      setLoading(false)
      return
    }
    setStudent(s)
    const list = await api.assignments.getAll({ batch: s.batch })
    setAssignments(list)

    const subEntries = await Promise.all(
      list.map(async (a) => [a.id, await api.assignments.getSubmission(a.id, s.id)])
    )
    setSubmissions(Object.fromEntries(subEntries.filter(([, v]) => v)))
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.email])

  const handleSubmit = async (assignmentId, file) => {
    if (!file || !student) return
    const saved = await api.assignments.submit(assignmentId, student.id, file)
    setSubmissions((prev) => ({ ...prev, [assignmentId]: saved }))
    toast.success('Submission uploaded.')
  }

  const handleWithdraw = async (assignmentId) => {
    if (!student) return
    await api.assignments.withdraw(assignmentId, student.id)
    setSubmissions((prev) => {
      const next = { ...prev }
      delete next[assignmentId]
      return next
    })
    toast.info('Submission withdrawn.')
  }

  return (
    <DashboardLayout title="Assignments">
      {loading ? (
        <LoadingSkeleton variant="card" />
      ) : (
        <div className="d-flex flex-column gap-3">
          {assignments.length === 0 && (
            <Card>
              <p className="text-muted mb-0">No assignments for your batch yet.</p>
            </Card>
          )}

          {assignments.map((a) => {
            const mySubmission = submissions[a.id]
            return (
              <Card key={a.id} title={a.title} eyebrow={a.batch}>
                <div className="pulse-line" />

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                  <span className={`st-badge ${a.status === 'Open' ? 'st-badge-success' : 'st-badge-red'}`}>{a.status}</span>
                  <span className="st-eyebrow">Due {a.dueDate}</span>
                </div>

                {a.description && <p style={{ fontSize: '0.88rem' }}>{a.description}</p>}

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="st-eyebrow mb-1">Assignment material</div>
                    {a.fileUrl ? (
                      <a href={a.fileUrl} target="_blank" rel="noreferrer" download={a.fileName} className="btn btn-st-outline btn-sm">
                        <i className="bi bi-file-earmark-pdf me-1" style={{ color: 'var(--red)' }} />
                        View PDF from trainer
                      </a>
                    ) : (
                      <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                        No material attached for this assignment.
                      </p>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="st-eyebrow mb-1">Your submission</div>
                    {mySubmission ? (
                      <div
                        className="d-flex align-items-center justify-content-between p-2"
                        style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                      >
                        <div className="text-truncate" style={{ fontSize: '0.85rem' }}>
                          <i className="bi bi-file-earmark-check me-1" style={{ color: 'var(--success)' }} />
                          {mySubmission.fileName}
                          <div className="st-eyebrow mt-1">Submitted {mySubmission.submittedAt}</div>
                        </div>
                        <button className="btn btn-sm btn-st-outline flex-shrink-0" onClick={() => handleWithdraw(a.id)}>
                          Withdraw
                        </button>
                      </div>
                    ) : (
                      <PdfUpload label="Upload your submission" value={null} onChange={(file) => handleSubmit(a.id, file)} />
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
