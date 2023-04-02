import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

import "../styles/ReloadPrompt.css"

import { Refresh } from 'iconoir-react'

function ReloadPrompt() {
  const [isTrue, setIsTrue] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      needRefresh ? () => {
        console.log(`${needRefresh} Needs refresh, clearing localstorage...`);
        window.localStorage.clear()
        console.log(`localStorage cleared successfully.`);
        return r
       } : () => {
        console.log(`No refresh needed.`);
        return r      
       }
      console.log("Registered worker successfully.");
    },
    onRegisterError(error) {
      console.error(error, "Failed to register worker.");
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
            ? <button type='button' className="ToastButton inputButton" 
            onClick={() => {
              console.log("Click: => updateServiceWorker()");
              updateServiceWorker(true)
              }}>
              <Refresh width={20} height={20}/>
              Päivitä</button>
            : null }
            { offlineReady  && !needRefresh
            ? <button type='button' 
              className={`ToastButton inputButton`} 
              onClick={() => {
                console.log("Click: => close()");
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
