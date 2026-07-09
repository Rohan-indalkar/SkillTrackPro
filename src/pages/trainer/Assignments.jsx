import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import PdfUpload from '../../components/common/PdfUpload'
import useCrudAsync from '../../hooks/useCrudAsync'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/mockApi'

export default function Assignments() {
  const { user } = useAuth()
  const toast = useToast()
  const { items, loading, add, update, remove } = useCrudAsync(() => api.assignments.getAll(), api.assignments)
  const [batchOptions, setBatchOptions] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.trainers.findByEmail(user.email).then((trainer) => {
      if (!trainer) return
      api.batches.getByTrainer(trainer.name).then((batches) => {
        setBatchOptions(batches.map((b) => ({ label: b.name, value: b.name })))
      })
    })
  }, [user.email])

  const FIELDS = [
    { name: 'title', label: 'Assignment title', placeholder: 'e.g. Employee CRUD using Collections' },
    { name: 'batch', label: 'Batch', type: 'select', options: batchOptions },
    { name: 'dueDate', label: 'Due date', type: 'date' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'What should students submit?' },
  ]

  const COLUMNS = [
    { key: 'title', label: 'Assignment' },
    { key: 'batch', label: 'Batch' },
    { key: 'dueDate', label: 'Due Date' },
    {
      key: 'material',
      label: 'Material',
      render: (row) =>
        row.fileUrl ? (
          <a href={row.fileUrl} target="_blank" rel="noreferrer" download={row.fileName} className="btn btn-sm btn-st-outline">
            <i className="bi bi-file-earmark-pdf me-1" style={{ color: 'var(--red)' }} />
            View PDF
          </a>
        ) : (
          <span className="st-eyebrow">No file</span>
        ),
    },
    {
      key: 'submissions',
      label: 'Submissions',
      render: (row) => (
        <div style={{ minWidth: 120 }}>
          <div className="pulse-progress">
            <span style={{ width: `${Math.round((row.submissions / (row.totalStudents || 1)) * 100)}%` }} />
          </div>
          <div className="st-eyebrow mt-1">
            {row.submissions}/{row.totalStudents} submitted
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`st-badge ${row.status === 'Open' ? 'st-badge-success' : 'st-badge-red'}`}>{row.status}</span>
      ),
    },
  ]

  const openAdd = () => {
    setEditingId(null)
    setForm({
      title: '',
      batch: batchOptions[0]?.value || '',
      dueDate: '',
      description: '',
      fileName: '',
      fileUrl: '',
      status: 'Open',
    })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(row)
    setModalOpen(true)
  }

  const handleFileChange = (file) => {
    setForm((f) => ({ ...f, fileName: file?.fileName || '', fileUrl: file?.fileUrl || '' }))
  }

  const handleSave = async () => {
    if (!form.title || !form.batch || !form.dueDate) return
    setSaving(true)
    try {
      if (editingId) {
        await update(editingId, form)
        toast.success('Assignment updated.')
      } else {
        await add(form)
        toast.success('Assignment created — students have been notified.')
      }
      setModalOpen(false)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete assignment "${row.title}"?`)) return
    await remove(row.id)
    toast.success(`Assignment "${row.title}" deleted.`)
  }

  return (
    <DashboardLayout title="Assignments">
      <DataTable
        title="All assignments"
        columns={COLUMNS}
        data={items}
        loading={loading}
        searchKeys={['title', 'batch']}
        onAdd={openAdd}
        addLabel="Create assignment"
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyState={{ icon: 'bi-clipboard-check', title: 'No assignments yet', message: 'Create your first assignment for a batch.' }}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit assignment' : 'Create assignment'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save assignment'}
            </button>
          </>
        }
      >
        <EntityForm fields={FIELDS} values={form} onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))} />
        <PdfUpload
          label="Assignment PDF (optional)"
          value={{ fileName: form.fileName, fileUrl: form.fileUrl }}
          onChange={handleFileChange}
        />
      </Modal>
    </DashboardLayout>
  )
}
