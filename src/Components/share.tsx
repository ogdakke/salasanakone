import { CheckCircle, ShareAndroid, ShareIos } from "iconoir-react"
import { useState } from "react"
import copyToClipboard from "../Api/copyToClipboard"
import { meta } from "../assets/constants/meta"

export const isAndroid = navigator.userAgent.match(/Android/i)

export const ShareComponent = () => {
  const [isCopied, setCopied] = useState(false)


  const shareAction = async () => {
    if (navigator.share) {
      navigator.share({
        title: meta.title,
        text: meta.description,
        url: meta.url
      })
      .then((val) => {return val})
      .catch((err) => console.log("error sharing", err))
    } else {      
      setCopied(true)
      copyToClipboard(meta.url)
      setTimeout(() => setCopied(false), 1100)      
    }
  }

  
  const size = 28
  return (
    <>
    <div className="shareWrapper">
        {isCopied
        ? <div className="withIcon success">
            Kopioitu
            <CheckCircle width={20} height={20}/>
          </div>
        : null}
      <div onClick={async () => await shareAction()} className="shareButton">
        {isAndroid
        ? <ShareAndroid className="shareButtonSvg" width={size} height={size}/> 
        : <ShareIos className="shareButtonSvg" width={size} height={size}/> }
      </div>
    </div>
    </>
  )
} 