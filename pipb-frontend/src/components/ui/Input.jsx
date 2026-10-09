function Input({ id, label, error, className = '', ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10 ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Input