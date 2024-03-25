import { StrengthIndicator } from "@/Components/indicator"
import { useMediaQuery } from "@/common/hooks/useMediaQuery"
import { FormContext } from "@/common/providers/FormProvider"
import { strengthToColorAndLabel } from "@/common/utils/helpers"
import "@/styles/PillIsland.css"
import { type Variants, motion } from "framer-motion"
import { Plus } from "iconoir-react"
import { type LegacyRef, useContext } from "react"

const darkModeBoxShadow = "rgba(0 200 59 0.3) 0px 0px 36px 1px"
const lightModeBoxShadow = "rgba(0 200 59 0.66) 9px 12px 60px 13px"
function splitColor(color: `rgb(${string}, ${string}, ${string})`, opacity = 0.08) {
  const parts = color.split("(")
  let RGB = parts[1].slice(0, -1)
  return `${parts[0]}a(${RGB}, ${opacity})`
}
const pillVariants: Variants = {
  initial: { borderColor: "rgba(0,0,0,0)" },
  animate: (props: {
    score: number
    darkMode: boolean
    color: `rgb(${string}, ${string}, ${string})`
  }) => {
    let boxShadow = props.darkMode ? darkModeBoxShadow : lightModeBoxShadow
    const rgba = splitColor(props.color, props.darkMode ? 0.08 : 0.3)

    return {
      opacity: 1,
      borderColor: "rgba(22, 22, 22, 1)",
      boxShadow: props.score === 4 ? boxShadow : `${rgba} 0px 0px 30px 0px`,
      transition: {
        boxShadow: {
          type: "tween",
          duration: 0.8,
          delay: 0.25,
          ease: "easeOut",
        },
        borderColor: { duration: 2 },
        opacity: { duration: 2 },
      },
    }
  },
}

/**
 * Pill island
 */
export const PillIsland = ({
  score,
  pillRef,
}: { score: number; pillRef: LegacyRef<HTMLButtonElement> }) => {
  const { generate, formState } = useContext(FormContext)
  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0
  const darkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const { color } = strengthToColorAndLabel(score)

  const buttonSize = 26
  return (
    <motion.button
      ref={pillRef}
      onClick={() => {
        generate(formState)
      }}
      className="IslandBackground"
      variants={pillVariants}
      initial="initial"
      animate="animate"
      custom={{ score, darkMode, color }}
      data-score={score}
    >
      <motion.span
        tabIndex={-1}
        style={{ filter: "blur(4px)" }}
        initial={{ opacity: 0, scale: 0.16 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: isTouchDevice() ? 0.9 : 1 }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.6,
            delay: 0.2,
            scale: { duration: 0.4 },
          },
        }}
        className="IslandGenerateButton"
      >
        <Plus strokeWidth={2} height={buttonSize} width={buttonSize} />
      </motion.span>
      <StrengthIndicator score={score ?? 4} />
    </motion.button>
  )
}
