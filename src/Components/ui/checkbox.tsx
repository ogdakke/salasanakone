import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "iconoir-react"
// styles
import "../../styles/ui/Checkbox.css"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className="", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`checkboxRoot ${className}`}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={`checkboxIndicator ${className}`}>
      <Check />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
