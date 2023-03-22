import { CheckCircle, ShareAndroid, ShareIos } from "iconoir-react"
import { useState } from "react"
import copyToClipboard from "../Api/copyToClipboard"
import { meta } from "../assets/constants/meta"

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
      console.log("hei");
      
      setCopied(true)
      copyToClipboard(meta.url)
      setTimeout(() => setCopied(false), 1100)      
    }
  }

  
  const isAndroid = navigator.userAgent.match(/Android/i)
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
      <button onClick={async () => await shareAction()} type="button" className="shareButton">
        {isAndroid
        ? <ShareAndroid className="shareButtonSvg" width={size} height={size}/> 
        : <ShareIos className="shareButtonSvg" width={size} height={size}/> }
      </button>
    </div>
    </>
  )
} 