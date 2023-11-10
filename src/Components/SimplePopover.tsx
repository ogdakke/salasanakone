import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui"
import { InfoEmpty } from "iconoir-react"
import { ReactNode } from "react"
type SimplePopoverProps = {
  trigger?: ReactNode
  type?: PopoverIconTypes
  text: string | ReactNode
  size?: 14 | 16 | 18 | 20 | 24 | 28 | 32
  side?: "top" | "right" | "bottom" | "left"
}

export type PopoverIconTypes = "info"

export const SimplePopover = ({
  trigger,
  text,
  size,
  side = "top",
  type,
}: SimplePopoverProps): JSX.Element => {
  const icons = new Map<PopoverIconTypes | undefined, ReactNode | null>()
  /** icon types */
  icons.set(undefined, null)
  icons.set(
    "info",
    <InfoEmpty
      className="interact"
      height={size ?? 18}
      width={size ?? 18}
      strokeWidth={2}
      alignmentBaseline="central"
    />,
  )

  return (
    <Popover>
      <PopoverTrigger className="PopoverTrigger">
        {trigger ? trigger : undefined}
        {icons.has(type) ? icons.get(type) : null}
      </PopoverTrigger>
      <PopoverContent className="PopoverContent" side={side}>
        {text}
      </PopoverContent>
    </Popover>
  )
}

