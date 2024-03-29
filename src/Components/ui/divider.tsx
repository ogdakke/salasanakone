import type { FC, HTMLProps } from "react"

interface DividerProps extends HTMLProps<HTMLHRElement> {
  margin?: string
}

export const Divider: FC<DividerProps> = ({ margin, ...props }) => {
  return <hr className="divider" style={{ margin: margin, ...props.style }} {...props} />
}
