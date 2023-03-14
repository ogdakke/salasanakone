import { useState } from "react"
import copyToClipboard from "../Api/copyToClipboard"
import "../styles/Result.css"


export default function Result(props: { finalPassword: string; copyText: string }) {
  const {finalPassword, copyText} = props
  const copy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1100)
  }

  const [isCopied, setCopied] = useState(false)
  
  
  return (
  <>
    {finalPassword
        ? <a
            title={copyText}
            className="card"
            type='button' 
            onClick={async () => { 
              await copyToClipboard(finalPassword) 
              copy()  
              }
            }>
              <span className={
                isCopied 
                ? "copied"
                : "notCopied"
              }>
                {
                  isCopied
                ? <span className="copiedSpanText">Kopioitu Leikepöydälle</span>
                :<span className="notCopiedSpan">
                  {finalPassword.length
                ? finalPassword
                : "Jotain meni vikaan... Salasanaa ei luotu."}
                </span>
                }
              </span>
          </a> 
        : <div className="card">
          Jotain meni vikaan... Salasanaa ei luotu. Koeta päivittää sivu.
        </div> 
      }
  </>
  )
}