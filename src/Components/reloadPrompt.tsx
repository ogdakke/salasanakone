import { useRegisterSW } from "virtual:pwa-register/react"
import { useTranslation } from "@/common/hooks/useLanguage"
import "@/styles/ReloadPrompt.css"
import { Xmark } from "iconoir-react"
import { useState } from "react"

const refreshSW = (registration?: ServiceWorkerRegistration) => {
  const error = new Error("No registation passed")
  return registration ? registration : error
}

const noRefreshNeeded = (registation?: ServiceWorkerRegistration) => {
  return registation
}

function ReloadPrompt() {
  const { t } = useTranslation()
  const [isTrue, setIsTrue] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (needRefresh) {
        refreshSW(r)
      }
      noRefreshNeeded(r)
    },
    onRegisterError(error) {
      console.error(error, "Failed to register worker.")
      throw error
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }
  return (
    <div className="ReloadPrompt-container">
      {(offlineReady || needRefresh) && (
        <div className={`ReloadPrompt-toast ${isTrue}`}>
          <div className="ReloadPrompt-message">
            {offlineReady ? (
              <span className="Toast-span-fade">{t("worksOffline")}</span>
            ) : (
              <span className="Toast-span-persist">{t("updateToNewVersion")}</span>
            )}
          </div>
          {needRefresh ? (
            <button
              type="button"
              className="ToastButton"
              onClick={() => {
                updateServiceWorker(true).catch(console.error)
              }}
            >
              {t("update")}
            </button>
          ) : null}
          {offlineReady && !needRefresh ? (
            <button
              type="button"
              className="DismissToast"
              onClick={() => {
                setIsTrue(true)
                close()
              }}
            >
              <Xmark className="Icon" width={20} height={20} />
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}

export { ReloadPrompt }
