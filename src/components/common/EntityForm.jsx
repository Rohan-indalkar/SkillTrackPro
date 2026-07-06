/**
 * fields: [{ name, label, type = 'text', options?: [{label, value}] }]
 * values: object of current form values
 * onChange(name, value)
 */
export default function EntityForm({ fields, values, onChange }) {
  return (
    <div>
      {fields.map((f) => (
        <div className="mb-3" key={f.name}>
          <label className="form-label st-eyebrow">{f.label}</label>
          {f.type === 'select' ? (
            <select
              className="form-select"
              value={values[f.name] ?? ''}
              onChange={(e) => onChange(f.name, e.target.value)}
            >
              <option value="" disabled>
                Select {f.label.toLowerCase()}
              </option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type || 'text'}
              className="form-control"
              value={values[f.name] ?? ''}
              onChange={(e) => onChange(f.name, e.target.value)}
              placeholder={f.placeholder || ''}
            />
          )}
        </div>
      ))}
    </div>
  )
}
