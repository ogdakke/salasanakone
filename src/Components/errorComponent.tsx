import { useState } from "react"

import { useInterval } from "@/common/hooks/useInterval"
import { useTranslation } from "@/common/hooks/useLanguage"

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: any
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  resetErrorBoundary: (...args: any[]) => void
}

export const ErrorComponent = ({ error, resetErrorBoundary }: Props) => {
  const [isRendered, setRendered] = useState(false)
  const { t } = useTranslation()
  window.localStorage.removeItem("formValues")
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  const tryRender = () => resetErrorBoundary()

  useInterval(
    () => {
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
