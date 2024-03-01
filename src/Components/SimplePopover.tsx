import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui"
import { PropsWithChildren, ReactNode } from "react"
type SimplePopoverProps = {
  text: string | ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

export type PopoverIconTypes = "info"

export const SimplePopover = ({
  children,
  text,
  side = "top",
}: PropsWithChildren<SimplePopoverProps>): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger className="PopoverTrigger">{children}</PopoverTrigger>
      <PopoverContent className="PopoverContent" side={side}>
        {text}
      </PopoverContent>
    </Popover>
  )
}
