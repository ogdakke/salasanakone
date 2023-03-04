import "../styles/Loading.css"

export function Loading() {
  return (
    <div className="loading" aria-busy="true">
      <span aria-label="Loader animation" className="loader"></span>
    </div>
  )
}