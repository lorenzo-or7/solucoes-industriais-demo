export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="text-[1.375rem] font-semibold tracking-[0.18em] text-fg">
        AXI<span className="relative">
          O
          <span aria-hidden="true" className="absolute left-1/2 top-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 bg-accent" />
        </span>
        M
      </span>
      <span className="label-mono hidden text-[0.625rem] text-muted sm:inline">Industrial</span>
    </span>
  )
}
