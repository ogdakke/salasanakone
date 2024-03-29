import { FormContext } from "@/Components/FormContext"
import { StrengthIndicator } from "@/Components/indicator"
import { Loading } from "@/Components/ui"
import "@/styles/Island.css"
import { m } from "framer-motion"
import { Plus } from "iconoir-react"
import { useContext } from "react"

enum IslandVariants {
  full = "full",
  pill = "pill",
}

export const SimpleIsland = () => {
  return (
    <m.div className="IslandMain" data-state={IslandVariants.pill}>
      <PillIsland />
    </m.div>
  )
}

export const PillLoadingState = () => {
  return (
    <div className="IslandMain">
      <Loading className="" height="3.5rem" radius="4rem" />
    </div>
  )
}

/**
 * Pill island
 */
const PillIsland = () => {
  const { generate } = useContext(FormContext)
  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0

  const buttonSize = 32
  return (
    <m.button
      onClick={() => void generate()}
      style={{ willChange: "transform" }}
      className="IslandBackground"
      whileFocus={{ scale: 1.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: isTouchDevice() ? 0.96 : 1 }}
    >
      <m.span
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
      </m.span>
      <StrengthIndicator />
    </m.button>
  )
}
