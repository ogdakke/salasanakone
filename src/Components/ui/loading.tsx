import styles from "../../styles/modules/Loading.module.css"

type LoadingProps = {
  width?: string
  height: string
}

export function Loading({ width, height }: LoadingProps) {
  return (
    <div
      style={{
        height: height,
      }}
      className={styles.loading}
      aria-busy="true"
    >
      {/* <span role="progressbar" aria-label="Loader animation" className="loader"></span> */}
    </div>
  )
}
