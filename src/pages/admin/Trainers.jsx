import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import useCrudAsync from '../../hooks/useCrudAsync'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/mockApi'

const FIELDS = [
  { name: 'name', label: 'Full name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'specialization', label: 'Specialization' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'On Leave', value: 'On Leave' },
    ],
  },
]

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'specialization', label: 'Specialization' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <span className={`st-badge ${row.status === 'Active' ? 'st-badge-success' : 'st-badge-warning'}`}>
        {row.status}
      </span>
    ),
  },
]

export default function Trainers() {
  const { items, loading, add, update, remove } = useCrudAsync(() => api.trainers.getAll(), api.trainers)
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', email: '', specialization: '', status: 'Active' })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(row)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.email) return
    setSaving(true)
    try {
      if (editingId) {
        await update(editingId, form)
        toast.success('Trainer updated.')
      } else {
        await add(form)
        toast.success('Trainer added.')
      }
      setModalOpen(false)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Remove ${row.name} from trainers?`)) return
    await remove(row.id)
    toast.success(`${row.name} removed.`)
  }

  return (
    <DashboardLayout title="Trainers">
      <DataTable
        title="All trainers"
        columns={COLUMNS}
        data={items}
        loading={loading}
        searchKeys={['name', 'email', 'specialization']}
        onAdd={openAdd}
        addLabel="Add trainer"
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyState={{ icon: 'bi-person-badge', title: 'No trainers yet', message: 'Add your first trainer to get started.' }}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit trainer' : 'Add trainer'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save trainer'}
            </button>
          </>
        }
      >
        <EntityForm fields={FIELDS} values={form} onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))} />
      </Modal>
    </DashboardLayout>
  )
}
