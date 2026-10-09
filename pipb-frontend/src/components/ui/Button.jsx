const variants = {
  primary: 'bg-ink text-paper hover:bg-ink/85',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-paper',
  ghost: 'text-ink hover:bg-surface',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
}

function Button({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button