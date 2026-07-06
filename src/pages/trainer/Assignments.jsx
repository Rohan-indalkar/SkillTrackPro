import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import PdfUpload from '../../components/common/PdfUpload'
import useCrud from '../../hooks/useCrud'
import { assignmentsData, trainerBatchOptions, getStudentsByBatch } from '../../data/dummyData'

const FIELDS = [
  { name: 'title', label: 'Assignment title', placeholder: 'e.g. Employee CRUD using Collections' },
  { name: 'batch', label: 'Batch', type: 'select', options: trainerBatchOptions },
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
        <a
          href={row.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-st-outline"
          download={row.fileName}
        >
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
          <span style={{ width: `${Math.round((row.submissions / row.totalStudents) * 100)}%` }} />
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

export default function Assignments() {
  const { items, add, update, remove } = useCrud(assignmentsData)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})

  const openAdd = () => {
    setEditingId(null)
    const defaultBatch = trainerBatchOptions[0]?.value || ''
    setForm({
      title: '',
      batch: defaultBatch,
      dueDate: '',
      description: '',
      fileName: '',
      fileUrl: '',
      totalStudents: getStudentsByBatch(defaultBatch).length,
      submissions: 0,
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
    setForm((f) => ({
      ...f,
      fileName: file?.fileName || '',
      fileUrl: file?.fileUrl || '',
    }))
  }

  const handleSave = () => {
    if (!form.title || !form.batch || !form.dueDate) return
    const totalStudents = getStudentsByBatch(form.batch).length || form.totalStudents || 0
    const record = { ...form, totalStudents }
    if (editingId) {
      update(editingId, record)
    } else {
      add(record)
    }
    setModalOpen(false)
  }

  const handleDelete = (row) => {
    if (window.confirm(`Delete assignment "${row.title}"?`)) remove(row.id)
  }

  return (
    <DashboardLayout title="Assignments">
      <DataTable
        title="All assignments"
        columns={COLUMNS}
        data={items}
        searchKeys={['title', 'batch']}
        onAdd={openAdd}
        addLabel="Create assignment"
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit assignment' : 'Create assignment'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave}>
              Save assignment
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
