import { useEffect, useState, useCallback } from 'react'

/**
 * Generic async list + CRUD hook, driven by a "service" object with
 * getAll/create/update/remove methods that return Promises (see
 * src/services/mockApi.js). This is what every list page (Trainers,
 * Students, Batches, Assignments, ...) uses instead of importing dummy
 * arrays directly.
 *
 * fetcher: () => Promise<array>   (lets pages pass a filtered getAll, e.g. () => api.topics.getAll({ batch }))
 * service: { create, update, remove }
 */
export default function useCrudAsync(fetcher, service, deps = []) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    return fetcher()
      .then((data) => setItems(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    fetcher()
      .then((data) => {
        if (active) setItems(data)
      })
      .catch((err) => {
        if (active) setError(err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const add = async (record) => {
    const saved = await service.create(record)
    setItems((prev) => [...prev, saved])
    return saved
  }

  const update = async (id, patch) => {
    const saved = await service.update(id, patch)
    setItems((prev) => prev.map((it) => (it.id === id ? saved : it)))
    return saved
  }

  const remove = async (id) => {
    await service.remove(id)
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  return { items, loading, error, add, update, remove, reload, setItems }
}
