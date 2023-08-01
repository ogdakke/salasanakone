import { PasteClipboard } from "iconoir-react"
import { useState } from "react"

import copyToClipboard from "../Api/copyToClipboard"

import "../styles/Result.css"
import { motion } from "framer-motion"

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

  // document.addEventListener("keydown", async (event) => {
  //   await animate(scope.current, { scale: 1.015 }, { duration: 0.1 })
  //   await animate(scope.current, { scale: 1.0 }, { duration: 0.5 })
  //   if (event.key === "c") {
  //     handleClick(finalPassword)
  //   }
  // }) this is fucked

  // const [scope, animate] = useAnimate()

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
          onClick={() => handleClick(finalPassword)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await handleClick(finalPassword)
            }
          }}
        >
          <span>
            <span className={isCopied ? "copiedSpanText" : "notCopiedSpan"}>
              {finalPassword.length !== 0 ? finalPassword : "Jotain meni vikaan... Salasanaa ei luotu."}
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
