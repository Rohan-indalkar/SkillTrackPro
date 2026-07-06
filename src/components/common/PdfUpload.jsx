import { useRef } from 'react'

const MAX_SIZE_MB = 50

/**
 * Client-side PDF upload. Since there's no backend yet, the file is read into
 * a data URL and kept in memory (via the parent's form state) — this makes the
 * "view PDF" flow work end-to-end in the browser.
 *
 * When the Spring Boot API exists, replace `readFile` with a multipart upload
 * call and store the returned file URL instead of the data URL — nothing else
 * in the calling page needs to change (still just `fileName` + `fileUrl`).
 *
 * value: { fileName, fileUrl } | undefined
 * onChange({ fileName, fileUrl } | null)
 */
export default function PdfUpload({ label = 'Attachment (PDF)', value, onChange }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File is too large. Please keep it under ${MAX_SIZE_MB}MB.`)
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onChange({ fileName: file.name, fileUrl: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="mb-3">
      <label className="form-label st-eyebrow">{label}</label>

      {value?.fileName ? (
        <div
          className="d-flex align-items-center justify-content-between p-2"
          style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
        >
          <div className="d-flex align-items-center gap-2 text-truncate">
            <i className="bi bi-file-earmark-pdf" style={{ color: 'var(--red)' }} />
            <span className="text-truncate" style={{ fontSize: '0.85rem' }}>
              {value.fileName}
            </span>
          </div>
          <button type="button" className="btn btn-sm btn-st-outline flex-shrink-0" onClick={handleRemove}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
      ) : (
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="form-control"
          onChange={handleFile}
        />
      )}
      <div className="st-eyebrow mt-1">PDF only, up to {MAX_SIZE_MB}MB</div>
    </div>
  )
}
