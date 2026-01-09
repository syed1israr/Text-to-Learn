import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-ds-1 transition-colors outline-none md:text-sm",
        "bg-bg text-text placeholder:text-muted border-border disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-interactive focus-visible:ring-2 focus-visible:ring-interactive/50",
        "aria-invalid:ring-danger/20 aria-invalid:border-danger",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
