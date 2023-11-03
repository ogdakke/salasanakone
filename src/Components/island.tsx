import { FormContext } from "@/Components/form"
import { StrengthIndicator } from "@/Components/indicator"
import { Loading } from "@/Components/ui"
import "@/styles/Island.css"
import { motion } from "framer-motion"
import { Plus } from "iconoir-react"
import { Suspense, useContext } from "react"

interface Props {
  generate: () => void
  finalPassword?: string | undefined
}

enum IslandVariants {
  full = "full",
  pill = "pill",
}

export const SimpleIsland = () => {
  return (
    <Suspense fallback={<PillLoadingState />}>
      <motion.div className="IslandMain" data-state={IslandVariants.pill}>
        <PillIsland />
      </motion.div>
    </Suspense>
  )
}

const PillLoadingState = () => {
  return (
    <div className="IslandMain">
      <Loading className="" height="4rem" radius="4rem" />
    </div>
  )
}

/**
 * Pill island
 *
 */
const PillIsland = () => {
  const context = useContext(FormContext)
  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0

  if (!context?.generate) {
    throw new Error("Context failed to use generate() function")
  }

  const buttonSize = 32
  return (
    <motion.div
      onClick={() => context.generate()}
      onKeyDown={(e) => (e.key === "Enter" ? context.generate() : null)}
      style={{ willChange: "transform" }}
      className="IslandBackground"
      whileFocus={{ scale: 1.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: isTouchDevice() ? 0.96 : 1 }}
    >
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 2,
          },
        }}
        className="IslandGenerateButton"
      >
        <Plus strokeWidth={2} height={buttonSize} width={buttonSize} />
      </motion.span>
      <StrengthIndicator />
    </motion.div>
  )
}

