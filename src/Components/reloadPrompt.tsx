import { useState } from "react"
import { useRegisterSW } from "virtual:pwa-register/react"

import "../styles/ReloadPrompt.css"

import { Refresh } from "iconoir-react"

const refreshSW = (registration?: ServiceWorkerRegistration) => {
  console.log(`Needs refresh, clearing localstorage...`)
  window.localStorage.clear()
  console.log("localStorage cleared successfully.")
  const error = new Error("No registation passed")
  return registration ? registration : error
}

const noRefreshNeeded = (registation?: ServiceWorkerRegistration) => {
  console.log("No refresh needed.")
  return registation
}

function ReloadPrompt() {
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
      console.log("Registered worker successfully.")
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
              <span className="Toast-span-fade">Sivusto toimii nyt myös ilman verkkoyhteyttä.</span>
            ) : (
              <span className="Toast-span-persist">
                Uusi versio saatavilla. Päivitä sivu napauttamalla.
              </span>
            )}
          </div>
          {needRefresh ? (
            <button
              type="button"
              className="ToastButton inputButton"
              onClick={() => {
                console.log("Click: => updateServiceWorker()")
                updateServiceWorker(true).catch(console.error)
              }}
            >
              <Refresh width={20} height={20} />
              Päivitä
            </button>
          ) : null}
          {offlineReady && !needRefresh ? (
            <button
              type="button"
              className={"ToastButton inputButton"}
              onClick={() => {
                console.log("Click: => close()")
                setIsTrue(true)
                close()
              }}
            >
              Ok
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default ReloadPrompt
