import { motion } from "framer-motion"
import { PasteClipboard } from "iconoir-react"
import { useState } from "react"
import { specials } from "../../config"
import copyToClipboard from "../services/copyToClipboard"
import "../styles/Result.css"
import { HighlightCondition, Highlighter } from "./ui/utils/highlight"

const numbers = "0123456789"

export default function Result(props: { finalPassword: string; copyText: string }) {
  const { finalPassword, copyText } = props
  const copy = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1100)
  }

  const [isCopied, setCopied] = useState(false)

  const handleClick = async (word: string) => {
    await copyToClipboard(word)
    copy()
  }

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
    <>
      {finalPassword.length > 0 ? (
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
          <span className="absoluteCopiedIcon">{isCopied ? <PasteClipboard /> : null}</span>
        </motion.div>
      ) : (
        <div className="card">Jotain meni vikaan... Salasanaa ei luotu. Koeta päivittää sivu.</div>
      )}
    </>
  )
}
