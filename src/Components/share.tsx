import { CheckCircle, ShareAndroid, ShareIos } from "iconoir-react"
import { useState } from "react"
import { useLanguage, useTranslation } from "@/common/hooks/useLanguage"
import { isAndroid } from "@/common/utils/helpers"
import copyToClipboard from "@/services/copyToClipboard"
import { Language } from "@/models/translations"

export const Share = () => {
  const { t, tRaw } = useTranslation()
  const [isCopied, setCopied] = useState(false)
  const { language } = useLanguage()

  const baseUrl = "https://salasanakone.com"
  const currentUrl = language === Language.en ? `${baseUrl}/en/` : `${baseUrl}/`

  const shareAction = async (): Promise<void> => {
    if (navigator.share !== undefined) {
      try {
        await navigator.share({
          title: tRaw("seoTitle"),
          url: currentUrl,
        })
      } catch (err) {
        console.error("error sharing", err)
        // Handle failure by copying and setting state
        await copyToClipboard(currentUrl)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 1500)
      }
    } else {
      await copyToClipboard(currentUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 1500)
    }
  }

  const size = 28
  return (
    <div className="shareWrapper">
      {isCopied ? (
        <div className="flex-center success">
          {t("copied")}
          <CheckCircle width={20} height={20} />
        </div>
      ) : null}

      <div
        role="button"
        onClick={() => void shareAction()}
        onKeyUp={() => void shareAction()}
        className="shareButton"
      >
        {isAndroid != null ? (
          <ShareAndroid className="shareButtonSvg" width={size} height={size} />
        ) : (
          <ShareIos className="shareButtonSvg" width={size} height={size} />
        )}
      </div>
    </div>
  )
}
