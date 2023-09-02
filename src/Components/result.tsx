import { numbers, specials } from "@/../config"
import { HighlightCondition, Highlighter } from "@/Components/ui/utils/highlight"
import copyToClipboard from "@/services/copyToClipboard"
import "@/styles/Result.css"
import { t } from "@/utils/getLanguage"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { Transition, motion } from "framer-motion"
import { ClipboardCheck, OpenSelectHandGesture } from "iconoir-react"
import { useEffect, useState } from "react"

const Result = (props: { finalPassword: string | undefined; copyText: string }) => {
  const { finalPassword, copyText } = props
  const [isCopied, setCopied] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  const copy = () => {
    setShouldAnimate(true)
    setTimeout(() => setShouldAnimate(false), 700)
    setCopied(true)
  }

  const handleClick = async (word: string) => {
    await copyToClipboard(word)
    copy()
  }

  useEffect(() => {
    setShouldAnimate(false)
    setCopied(false)
  }, [finalPassword])

  const highlightNumbers: HighlightCondition = {
    condition: numbers,
    style: {
      fontWeight: "bold",
      color: "var(--emphasis)",
    },
  }

  const highlightSpecials: HighlightCondition = {
    condition: specials,
    style: {
      fontWeight: "bold",
      opacity: "0.7",
    },
  }

  const highlightConditions = [highlightNumbers, highlightSpecials]

  return (
    <div className="resultWrapper">
      <p className="resultHelperText">{copyText}</p>
      {finalPassword && finalPassword.length > 0 ? (
        <div className="relative">
          <motion.div
            whileHover={{
              scale: 1.01,
            }}
            transition={{
              duration: 0.175,
            }}
            animate={{
              scale: 1,
            }}
            whileTap={{
              scale: 0.985,
              transition: {
                duration: 0.25,
              },
            }}
            initial={{
              scale: 1,
            }}
            title={copyText}
            className="card interact resultCard relative"
            itemType="button"
            tabIndex={0}
            onClick={() => void handleClick(finalPassword).catch(console.error)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleClick(finalPassword).catch(console.error)
              }
            }}
          >
            <span>
              <span className={isCopied ? "copiedSpanText" : "notCopiedSpan"}>
                {finalPassword.length !== 0 ? (
                  <Highlighter text={finalPassword} highlightConditions={highlightConditions} />
                ) : (
                  "Jotain meni vikaan... Salasanaa ei luotu."
                )}
              </span>
            </span>
          </motion.div>

          <TooltipProvider delayDuration={600}>
            <Tooltip>
              <TooltipTrigger type="button" asChild>
                <motion.span
                  layout
                  className="Shine absoluteCopiedIcon interact"
                  data-animate={shouldAnimate ? true : false}
                  initial={{
                    scale: 1,
                  }}
                  animate={{
                    translateX: isCopied ? 0 : 20,
                    opacity: isCopied ? 1 : 0,
                    scale: shouldAnimate ? 0.95 : 1,
                  }}
                  whileHover={{
                    scale: 0.9,
                  }}
                  transition={fade}
                  onClick={() => void handleClick(finalPassword).catch(console.error)}
                >
                  <ClipboardCheck alignmentBaseline="central" className="flex-center" />
                </motion.span>
              </TooltipTrigger>
              <TooltipContent sideOffset={4} className="TooltipContent">
                <div className="flex-center">
                  <OpenSelectHandGesture width={20} height={20} />
                  {t("hasCopiedPassword")}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div className="card">Jotain meni vikaan... Salasanaa ei luotu. Koeta päivittää sivu.</div>
      )}
    </div>
  )
}
const fade: Transition = {
  type: "spring",
  // duration: 0.2,
  damping: 10,
  bounce: 0.1,
  opacity: {
    type: "tween",
  },
  scale: {
    duration: 0.2,
  },
}

export default Result
