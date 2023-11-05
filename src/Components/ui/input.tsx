import * as React from "react"

import "@/styles/ui/Input.css"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return <input className={`${className}`} ref={ref} {...props} />
  },
)
InputComponent.displayName = "Input"

export { InputComponent }
