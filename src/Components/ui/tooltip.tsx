import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from "react"

import "@/styles/ui/Tooltip.css"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = ({ ...props }) => <TooltipPrimitive.Root {...props} />
const TooltipTrigger = ({ asChild = false, ...props }) => (
  <TooltipPrimitive.Trigger {...props} asChild={asChild} />
)
Tooltip.displayName = TooltipPrimitive.Tooltip.displayName

// const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className = "", sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={`TooltipContent ${className}`}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
