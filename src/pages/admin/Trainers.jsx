import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import useCrud from '../../hooks/useCrud'
import { trainersData } from '../../data/dummyData'

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
  { key: 'batches', label: 'Batches' },
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
  const { items, add, update, remove } = useCrud(trainersData)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', email: '', specialization: '', status: 'Active', batches: 0 })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(row)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email) return
    if (editingId) {
      update(editingId, form)
    } else {
      add(form)
    }
    setModalOpen(false)
  }

  const handleDelete = (row) => {
    if (window.confirm(`Remove ${row.name} from trainers?`)) remove(row.id)
  }

  return (
    <DashboardLayout title="Trainers">
      <DataTable
        title="All trainers"
        columns={COLUMNS}
        data={items}
        searchKeys={['name', 'email', 'specialization']}
        onAdd={openAdd}
        addLabel="Add trainer"
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit trainer' : 'Add trainer'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave}>
              Save trainer
            </button>
          </>
        }
      >
        <EntityForm fields={FIELDS} values={form} onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))} />
      </Modal>
    </DashboardLayout>
  )
}
