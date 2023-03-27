import * as React from "react"
import "../../styles/ui/Input.css"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className="", ...props }, ref) => {
    return (
      <input
        className={`TextInput ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
