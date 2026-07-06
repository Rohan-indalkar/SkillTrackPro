import { useMemo, useState } from 'react'

export default function usePagination(items, pageSize = 6) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  // Keep page in range if the filtered list shrinks (e.g. after search/delete).
  if (page > totalPages) setPage(totalPages)

  return { page, setPage, totalPages, pageItems }
}
