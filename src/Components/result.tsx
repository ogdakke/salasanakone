import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import { Suspense, useState } from "react"
import copyToClipboard from "../Api/copyToClipboard"


export default function Result(props: { finalPassword: string; copyText: string }) {
  const {finalPassword, copyText} = props
  const copy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const [isCopied, setCopied] = useState(false)
  
  
  return (
  <>
    {finalPassword
        ? <a
          title={copyText}
          className="card"
           type='button' onClick={async () => { 
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
                ? <p>Copied To Clipboard</p>
                :<span>
                  {finalPassword.length
                ? finalPassword
                : "something went wrong..."}
                </span>
                }
              </span>
          </a> 
        : <div className="card">
          Jotain meni vikaan... Salasanaa ei luotu.
        </div> 
      }
  </>
  )
}