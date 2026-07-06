import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import useCrud from '../../hooks/useCrud'
import { studentsData, batchOptions } from '../../data/dummyData'

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

export default function Students() {
  const { items, add, update, remove } = useCrud(studentsData)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', email: '', batch: '', attendance: 100, status: 'Active' })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(row)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email || !form.batch) return
    if (editingId) {
      update(editingId, form)
    } else {
      add(form)
    }
    setModalOpen(false)
  }

  const handleDelete = (row) => {
    if (window.confirm(`Remove ${row.name} from students?`)) remove(row.id)
  }

  return (
    <DashboardLayout title="Students">
      <DataTable
        title="All students"
        columns={COLUMNS}
        data={items}
        searchKeys={['name', 'email', 'batch']}
        onAdd={openAdd}
        addLabel="Add student"
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit student' : 'Add student'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave}>
              Save student
            </button>
          </>
        }
      >
        <EntityForm fields={FIELDS} values={form} onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))} />
      </Modal>
    </DashboardLayout>
  )
}
