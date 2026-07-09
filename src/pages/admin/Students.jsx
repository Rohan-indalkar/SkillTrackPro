import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import useCrudAsync from '../../hooks/useCrudAsync'
import useAsync from '../../hooks/useAsync'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/mockApi'

export default function Students() {
  const { items, loading, add, update, remove } = useCrudAsync(() => api.students.getAll(), api.students)
  const { data: batches } = useAsync(() => api.batches.getAll(), [])
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const batchOptions = (batches || []).map((b) => ({ label: b.name, value: b.name }))

  const FIELDS = [
    { name: 'name', label: 'Full name' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'batch', label: 'Batch', type: 'select', options: batchOptions },
  ]

  const COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'batch', label: 'Batch' },
    {
      key: 'attendance',
      label: 'Attendance',
      render: (row) => (
        <div style={{ minWidth: 120 }}>
          <div className="pulse-progress">
            <span style={{ width: `${row.attendance}%` }} />
          </div>
          <div className="st-eyebrow mt-1">{row.attendance}%</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`st-badge ${row.status === 'At Risk' ? 'st-badge-warning' : 'st-badge-success'}`}>
          {row.status}
        </span>
      ),
    },
  ]

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', email: '', batch: batchOptions[0]?.value || '', attendance: 100, status: 'Active' })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(row)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.email || !form.batch) return
    setSaving(true)
    try {
      if (editingId) {
        await update(editingId, form)
        toast.success('Student updated.')
      } else {
        await add(form)
        toast.success('Student added.')
      }
      setModalOpen(false)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Remove ${row.name} from students?`)) return
    await remove(row.id)
    toast.success(`${row.name} removed.`)
  }

  return (
    <DashboardLayout title="Students">
      <DataTable
        title="All students"
        columns={COLUMNS}
        data={items}
        loading={loading}
        searchKeys={['name', 'email', 'batch']}
        onAdd={openAdd}
        addLabel="Add student"
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyState={{ icon: 'bi-people', title: 'No students yet', message: 'Add your first student to get started.' }}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit student' : 'Add student'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save student'}
            </button>
          </>
        }
      >
        <EntityForm fields={FIELDS} values={form} onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))} />
      </Modal>
    </DashboardLayout>
  )
}
