import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import useCrud from '../../hooks/useCrud'
import { coursesData } from '../../data/dummyData'

const FIELDS = [
  { name: 'name', label: 'Course name' },
  { name: 'duration', label: 'Duration', placeholder: 'e.g. 6 months' },
  { name: 'modules', label: 'Number of modules', type: 'number' },
]

const COLUMNS = [
  { key: 'name', label: 'Course' },
  { key: 'duration', label: 'Duration' },
  { key: 'modules', label: 'Modules' },
  { key: 'batches', label: 'Active Batches' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <span className="st-badge st-badge-success">{row.status}</span>,
  },
]

export default function Courses() {
  const { items, add, update, remove } = useCrud(coursesData)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', duration: '', modules: 0, batches: 0, status: 'Active' })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(row)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.duration) return
    if (editingId) {
      update(editingId, form)
    } else {
      add(form)
    }
    setModalOpen(false)
  }

  const handleDelete = (row) => {
    if (window.confirm(`Delete course "${row.name}"?`)) remove(row.id)
  }

  return (
    <DashboardLayout title="Courses">
      <DataTable
        title="All courses"
        columns={COLUMNS}
        data={items}
        searchKeys={['name']}
        onAdd={openAdd}
        addLabel="Add course"
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit course' : 'Add course'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave}>
              Save course
            </button>
          </>
        }
      >
        <EntityForm fields={FIELDS} values={form} onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))} />
      </Modal>
    </DashboardLayout>
  )
}
