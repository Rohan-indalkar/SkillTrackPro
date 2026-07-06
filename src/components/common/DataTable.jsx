import { useMemo, useState } from 'react'
import usePagination from '../../hooks/usePagination'

/**
 * Generic list table used across Admin pages (Trainers, Students, Batches, Courses).
 *
 * columns: [{ key, label, render?(row) }]
 * data: array of row objects, each must have an `id`
 * searchKeys: which fields to match against the search box
 * onEdit / onDelete: optional row action handlers
 * onAdd: optional handler for the "+ Add" button in the toolbar
 */
export default function DataTable({
  title,  columns,
  data,  searchKeys = [],
  onEdit,  onDelete,
  onAdd,  addLabel = 'Add',
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter((row) => searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q)))
  }, [data, query, searchKeys])

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 6)

  return (
    <div className="st-card">
      <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
        <div className="st-card-title">{title}</div>
        <div className="d-flex gap-2 flex-wrap flex-grow-1 flex-sm-grow-0 justify-content-end">
          <div className="position-relative st-search-input">
            <i className="bi bi-search position-absolute" style={{ left: 10, top: 9, color: 'var(--ink-muted)', fontSize: '0.85rem' }} />
            <input
              className="form-control form-control-sm"
              style={{ paddingLeft: 30, width: '100%' }}
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {onAdd && (
            <button className="btn btn-st-primary btn-sm" onClick={onAdd}>
              <i className="bi bi-plus-lg me-1" /> {addLabel}
            </button>
          )}
        </div>
      </div>

      <div className="pulse-line" />

      <div className="table-responsive">
        <table className="table table-borderless align-middle mb-0">
          <thead>
            <tr className="st-eyebrow">
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {(onEdit || onDelete) && <th className="text-end">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center text-muted py-4">
                  No records match your search.
                </td>
              </tr>
            )}
            {pageItems.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="text-end">
                    {onEdit && (
                      <button className="btn btn-sm btn-st-outline me-2" onClick={() => onEdit(row)}>
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-sm btn-st-outline"
                        style={{ color: 'var(--red-dark)' }}
                        onClick={() => onDelete(row)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="st-eyebrow">
            Page {page} of {totalPages} &middot; {filtered.length} records
          </div>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-st-outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              className="btn btn-sm btn-st-outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
