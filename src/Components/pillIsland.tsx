import { StrengthIndicator } from "@/Components/indicator"
import { FormContext } from "@/common/providers/FormProvider"
import "@/styles/PillIsland.css"
import { type Variants, m, motion } from "framer-motion"
import { Plus } from "iconoir-react"
import { useContext } from "react"

const pillVariants: Variants = {
  initial: { borderColor: "rgba(0,0,0,0)" },
  animate: (score: number) => ({
    opacity: 1,
    borderColor: "rgba(22, 22, 22, 1)",
    boxShadow:
      score === 4
        ? "rgba(0, 200, 59, 0.1) 0px 0px 10px 0px"
        : "rgba(0, 202, 59, 0) 0px 0px 14px 1px",
    transition: {
      borderColor: { duration: 2 },
      opacity: { duration: 2 },
    },
  }),
  hover: {
    // scale: 1.05,
  },
}

/**
 * Pill island
 */
export const PillIsland = ({ score }: { score: number }) => {
  const { generate, formState } = useContext(FormContext)
  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0

  const buttonSize = 26
  return (
    <motion.button
      onClick={() => {
        generate(formState)
      }}
      className="IslandBackground"
      variants={pillVariants}
      whileHover="hover"
      initial="initial"
      animate="animate"
      custom={score}
    >
      <m.span
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
      </m.span>
      <StrengthIndicator score={score} />
    </motion.button>
  )
}
