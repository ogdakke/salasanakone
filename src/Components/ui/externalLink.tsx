import { OpenNewWindow } from "iconoir-react"
import type { PropsWithChildren } from "react"

interface Props {
  link: string
  size?: number
  children?: React.ReactNode | string
  className?: string
}

export const ExternalLink = (
  { link, size = 20, children, className = "" }: PropsWithChildren<Props>,
  { ...props },
) => {
  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a className={`flex-center inline ${className}`} target="_blank" href={link} {...props}>
      {children}
      <OpenNewWindow width={size} height={size} />
    </a>
  )
}
