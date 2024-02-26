import { CheckCircle, ShareAndroid, ShareIos } from "iconoir-react"
import { useState } from "react"

import { meta } from "@/assets/constants/meta"
import copyToClipboard from "@/services/copyToClipboard"

export const isAndroid = navigator.userAgent.match(/Android/i)

export const Share = () => {
  const [isCopied, setCopied] = useState(false)

  const shareAction = async () => {
    if (navigator.share !== undefined) {
      navigator
        .share({
          title: meta.title,
          text: meta.description,
          url: meta.url,
        })
        .then((val) => {
          console.log("WebShare worked successfully", new Date().getTime())
          return val
        })
        .catch((err) => {
          console.error("error sharing", err)
        })
    } else {
      await copyToClipboard(meta.url)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 1500)
    }
  }

  const size = 28
  return (
    <>
      <div className="shareWrapper">
        {isCopied ? (
          <div className="flex-center success">
            Kopioitu
            <CheckCircle width={20} height={20} />
          </div>
        ) : null}
        <div
          onClick={() => {
            shareAction().catch(console.error)
          }}
          className="shareButton"
        >
          {isAndroid != null ? (
            <ShareAndroid className="shareButtonSvg" width={size} height={size} />
          ) : (
            <ShareIos className="shareButtonSvg" width={size} height={size} />
          )}
        </div>
      </div>
    </>
  )
}
