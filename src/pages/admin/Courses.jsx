import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import useCrudAsync from '../../hooks/useCrudAsync'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/mockApi'

const FIELDS = [
  { name: 'name', label: 'Course name' },
  { name: 'duration', label: 'Duration', placeholder: 'e.g. 6 months' },
  { name: 'modules', label: 'Number of modules', type: 'number' },
]

export default function Courses() {
  const { items, loading, add, update, remove } = useCrudAsync(() => api.courses.getAll(), api.courses)
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const COLUMNS = [
    { key: 'name', label: 'Course' },
    { key: 'duration', label: 'Duration' },
    { key: 'modules', label: 'Modules' },
    {
      key: 'batches',
      label: 'Active Batches',
      render: (row) => api.courses.batchCount(row.name),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <span className="st-badge st-badge-success">{row.status}</span>,
    },
  ]

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', duration: '', modules: 0, status: 'Active' })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(row)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.duration) return
    setSaving(true)
    try {
      if (editingId) {
        await update(editingId, form)
        toast.success('Course updated.')
      } else {
        await add(form)
        toast.success('Course added.')
      }
      setModalOpen(false)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete course "${row.name}"?`)) return
    await remove(row.id)
    toast.success(`Course "${row.name}" deleted.`)
  }

  return (
    <DashboardLayout title="Courses">
      <DataTable
        title="All courses"
        columns={COLUMNS}
        data={items}
        loading={loading}
        searchKeys={['name']}
        onAdd={openAdd}
        addLabel="Add course"
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyState={{ icon: 'bi-book', title: 'No courses yet', message: 'Add your first course to get started.' }}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit course' : 'Add course'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save course'}
            </button>
          </>
        }
      >
        <EntityForm fields={FIELDS} values={form} onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))} />
      </Modal>
    </DashboardLayout>
  )
}
