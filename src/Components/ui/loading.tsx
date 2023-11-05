import styles from "@/styles/modules/Loading.module.css"
import React, { CSSProperties } from "react"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  width?: string
  height?: string
  radius?: string
  style?: CSSProperties
}

/**
 * Loading component with custom size
 *
 * Accepts: { className, width, height, radius, style }
 */
export const Loading: React.FC<LoadingProps> = ({
  className,
  width,
  height,
  radius,
  style,
  ...props
}) => {
  return (
    <div
      {...props}
      style={{
        ...style,
        width: width,
        height: height,
        borderRadius: radius,
      }}
      className={`${className ?? ""} ${styles.loading}`}
      aria-busy="true"
    ></div>
  )
}
