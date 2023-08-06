import styles from "../../styles/modules/Loading.module.css"

interface LoadingProps {
  className?: string
  width?: string
  height?: string
}

/**
 * Loading component with custom size
 * @param width width? as string | default "100%"
 * @param height height as string
 * @returns
 */
export function Loading({ className, width = "100%", height }: LoadingProps, { ...props }) {
  return (
    <div
      {...props}
      style={{
        width: width,
        height: height,
      }}
      className={`${className ? className : ""} ${styles.loading}`}
      aria-busy="true"
    >
      {/* <span role="progressbar" aria-label="Loader animation" className="loader"></span> */}
    </div>
  )
}
