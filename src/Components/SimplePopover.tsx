import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import type { PropsWithChildren, ReactNode } from "react"
type SimplePopoverProps = {
  text: string | ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

export const SimplePopover = ({
  children,
  text,
  side = "top",
}: PropsWithChildren<SimplePopoverProps>): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger className="PopoverTrigger">{children}</PopoverTrigger>
      <PopoverContent className="PopoverContent" side={side}>
        <p>{text}</p>
      </PopoverContent>
    </Popover>
  )
}
