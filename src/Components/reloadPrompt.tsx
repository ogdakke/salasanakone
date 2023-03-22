import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

import "../styles/ReloadPrompt.css"
import "../styles/Home.css"


function ReloadPrompt() {
  const [isTrue, setIsTrue] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      return r      
    },
    onRegisterError(error) {
      throw error
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
            { offlineReady  && !needRefresh
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
