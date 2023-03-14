import React, { useState } from 'react'
import "../styles/ReloadPrompt.css"
import "../styles/Home.css"

import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const [isTrue, setIsTrue] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }
  return (
    <div className="ReloadPrompt-container">
      { (offlineReady || needRefresh)
        && <div className={`ReloadPrompt-toast ${isTrue}`}>
            <div className="ReloadPrompt-message">
              { offlineReady
                ? <span className='Toast-span-fade'>Sivusto toimii nyt myös ilman verkkoyhteyttä.</span>
                : <span className='Toast-span-persist'>Uusi versio saatavilla. Päivitä sivu napauttamalla.</span>
              }
            </div>
            { needRefresh 
            ? <button type='button' className="ToastButton inputButton" onClick={() => updateServiceWorker(true)}>Päivitä</button>
            : null }
            { offlineReady  && ! needRefresh
            ? <button type='button' 
              className={`ToastButton inputButton`} 
              onClick={() => {
                setIsTrue(true)
                close()
              }}>Ok</button>
            : null}
        </div>
      }
    </div>
  )
}

export default ReloadPrompt
