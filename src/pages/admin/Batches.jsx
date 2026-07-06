import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import useCrud from '../../hooks/useCrud'
import { batchesData, courseOptions, trainerOptions } from '../../data/dummyData'

const FIELDS = [
  { name: 'name', label: 'Batch name', placeholder: 'e.g. Java Full Stack D' },
  { name: 'course', label: 'Course', type: 'select', options: courseOptions },
  { name: 'trainer', label: 'Trainer', type: 'select', options: trainerOptions },
  { name: 'startDate', label: 'Start date', type: 'date' },
]

const COLUMNS = [
  { key: 'name', label: 'Batch' },
  { key: 'course', label: 'Course' },
  { key: 'trainer', label: 'Trainer' },
  { key: 'students', label: 'Students' },
  { key: 'startDate', label: 'Start Date' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <span className={`st-badge ${row.status === 'Running' ? 'st-badge-success' : 'st-badge-red'}`}>
        {row.status}
      </span>
    ),
  },
]

export default function Batches() {
  const { items, add, update, remove } = useCrud(batchesData)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', course: '', trainer: '', startDate: '', students: 0, status: 'Upcoming' })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(row)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.course || !form.trainer) return
    if (editingId) {
      update(editingId, form)
    } else {
      add(form)
    }
    setModalOpen(false)
  }

  const handleDelete = (row) => {
    if (window.confirm(`Delete batch "${row.name}"?`)) remove(row.id)
  }

  return (
    <DashboardLayout title="Batches">
      <DataTable
        title="All batches"
        columns={COLUMNS}
        data={items}
        searchKeys={['name', 'course', 'trainer']}
        onAdd={openAdd}
        addLabel="Add batch"
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit batch' : 'Add batch'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave}>
              Save batch
            </button>
          </>
        }
      >
        <EntityForm fields={FIELDS} values={form} onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))} />
      </Modal>
    </DashboardLayout>
  )
}
