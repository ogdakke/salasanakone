import "@/styles/ui/BottomContainer.css"
import type { HTMLProps, PropsWithChildren } from "react"

export default function BottomContainer({
  children,
  visible,
  className = "",
  ...props
}: PropsWithChildren<{ visible?: boolean } & HTMLProps<HTMLDivElement>>) {
  return (
    <div
      style={{ display: visible ? "block" : "none" }}
      className={`BottomContainer ${className}`}
      {...props}
    >
      <div className="BottomContent">{children}</div>
    </div>
  )
}
