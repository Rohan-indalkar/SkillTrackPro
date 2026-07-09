import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import EntityForm from '../../components/common/EntityForm'
import useCrudAsync from '../../hooks/useCrudAsync'
import useAsync from '../../hooks/useAsync'
import { useToast } from '../../context/ToastContext'
import { api } from '../../services/mockApi'

export default function Batches() {
  const { items, loading, add, update, remove } = useCrudAsync(() => api.batches.getAll(), api.batches)
  const { data: courses } = useAsync(() => api.courses.getAll(), [])
  const { data: trainers } = useAsync(() => api.trainers.getAll(), [])
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const courseOptions = (courses || []).map((c) => ({ label: c.name, value: c.name }))
  const trainerOptions = (trainers || []).map((t) => ({ label: t.name, value: t.name }))

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

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', course: courseOptions[0]?.value || '', trainer: trainerOptions[0]?.value || '', startDate: '', status: 'Upcoming', progress: 0 })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(row)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.course || !form.trainer) return
    setSaving(true)
    try {
      if (editingId) {
        await update(editingId, form)
        toast.success('Batch updated.')
      } else {
        await add(form)
        toast.success('Batch created.')
      }
      setModalOpen(false)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete batch "${row.name}"?`)) return
    await remove(row.id)
    toast.success(`Batch "${row.name}" deleted.`)
  }

  return (
    <DashboardLayout title="Batches">
      <DataTable
        title="All batches"
        columns={COLUMNS}
        data={items}
        loading={loading}
        searchKeys={['name', 'course', 'trainer']}
        onAdd={openAdd}
        addLabel="Add batch"
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyState={{ icon: 'bi-collection', title: 'No batches yet', message: 'Create your first batch to get started.' }}
      />

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit batch' : 'Add batch'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-st-outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-st-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save batch'}
            </button>
          </>
        }
      >
        <EntityForm fields={FIELDS} values={form} onChange={(name, value) => setForm((f) => ({ ...f, [name]: value }))} />
      </Modal>
    </DashboardLayout>
  )
}
