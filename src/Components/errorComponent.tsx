import { useState } from "react"

import { useInterval } from "@/common/hooks/useInterval"
import { t } from "@/common/utils"

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetErrorBoundary: (...args: any[]) => void
}

export const ErrorComponent = ({ error, resetErrorBoundary }: Props) => {
  const [isRendered, setRendered] = useState(false)

  window.localStorage.removeItem("formValues")
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  const tryRender = () => resetErrorBoundary()

  useInterval(
    () => {
      console.log("Trying to re-render")
      tryRender()
      setRendered(true)
    },
    isRendered ? null : 6000,
  )

  return (
    <div role="alert">
      <h3>
        {t("somethingWentWrong")} {t("tryToRefresh")}
      </h3>
      <details>
        <summary>{t("moreInfo")}</summary>
        <pre style={{ color: "red" }}>{(error as Error).message}</pre>
      </details>
    </div>
  )
}
