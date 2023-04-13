import { Check, PasteClipboard } from "iconoir-react";
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
        ? <div
            title={copyText}
            className="card interact resultCard relative"
            itemType="button"
            tabIndex={0}
            onClick={async () => { 
              await copyToClipboard(finalPassword) 
              copy()  
              }
            }
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await copyToClipboard(finalPassword)
                copy()
              } return;
            }}
            >
              <span>
                <span className={
                  isCopied ? "copiedSpanText" : "notCopiedSpan"
                }>
                  {finalPassword.length
                  ? finalPassword
                  : "Jotain meni vikaan... Salasanaa ei luotu."}
                  </span>
                </span>
                  <span className="absoluteCopiedIcon">
                    {isCopied
                    ? <PasteClipboard />
                    : null}
                  </span>
              </div>
        : <div className="card">
          Jotain meni vikaan... Salasanaa ei luotu. Koeta päivittää sivu.
        </div> 
      }
  </>
  )
}