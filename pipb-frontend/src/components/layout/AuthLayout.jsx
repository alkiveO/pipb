function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel kiri — gelap */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-paper lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,247,241,0.12),transparent_55%)]" />

        <a href="/" className="relative text-xl font-bold tracking-tight">
          PIPB
        </a>

        <div className="relative">
          <p className="font-serif text-6xl font-medium leading-[0.95] tracking-tight">
            Tempat ide
            <br />
            <em className="text-accent not-italic">berkembang.</em>
          </p>

          <p className="mt-6 max-w-sm leading-relaxed text-paper/60">
            Pusat Inkubasi dan Pengembangan Bisnis, STT Terpadu Nurul Fikri.
          </p>
        </div>

        <p className="relative text-xs uppercase tracking-[0.2em] text-paper/40">
          PIPB / 2026
        </p>
      </aside>

      {/* Panel kanan — form */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-ink md:text-5xl">
            {title}
          </h1>

          <p className="mt-3 text-muted">{subtitle}</p>

          <div className="mt-10">{children}</div>

          {footer && (
            <div className="mt-8 text-center text-sm text-muted">{footer}</div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AuthLayout