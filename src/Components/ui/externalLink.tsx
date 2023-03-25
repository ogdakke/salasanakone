import { OpenNewWindow } from "iconoir-react"
import { PropsWithChildren } from "react"

type Props = {
  link: string,
  size?: number,
  children?: JSX.Element | string,
  className?: string
}

export const ExternalLink = ({link, size=16, children, className=""}: PropsWithChildren<Props>, {...props}) => {
  return (
      <a className={`withIcon inline ${className}`} href={link} {...props}>
        {children} 
        <OpenNewWindow width={size} height={size}/>
      </a>
  )
}