import { useState } from 'react'

// Simulates create/update/delete against dummy data.
// Swap this out for services/*.js API calls once Spring Boot endpoints exist —
// the pages calling this hook won't need to change shape, just the implementation.
export default function useCrud(initialData) {
  const [items, setItems] = useState(initialData)

  const add = (record) => {
    setItems((prev) => [...prev, { ...record, id: Date.now() }])
  }

  const update = (id, patch) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const remove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return { items, add, update, remove }
}
