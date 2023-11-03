import { StrengthIndicator } from "@/Components/indicator"
import { Loading } from "@/Components/ui"
import "@/styles/Island.css"
import { motion } from "framer-motion"
import { Plus } from "iconoir-react"
import { Suspense } from "react"

interface Props {
  generate: () => void
  finalPassword?: string | undefined
}

enum IslandVariants {
  full = "full",
  pill = "pill",
}

export const SimpleIsland = ({ generate, finalPassword }: Props) => {
  return (
    <Suspense fallback={<Loading height="84" />}>
      <motion.div className="IslandMain" data-state={IslandVariants.pill}>
        {/* Render all different variants conditionally */}
        <PillIsland generate={generate} finalPassword={finalPassword} />
      </motion.div>
    </Suspense>
  )
}

/**
 * Pill island
 *
 */
const PillIsland = ({ generate, finalPassword }: Props) => {
  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0

  const buttonSize = 32
  return (
    <motion.div
      onClick={() => generate()}
      onKeyDown={(e) => (e.key === "Enter" ? generate() : null)}
      style={{ willChange: "transform" }}
      className="IslandBackground"
      whileFocus={{ scale: 1.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: isTouchDevice() ? 0.96 : 1 }}
    >
      <span className="IslandGenerateButton">
        <Plus strokeWidth={2} height={buttonSize} width={buttonSize} />
      </span>
      <StrengthIndicator password={finalPassword} />
    </motion.div>
  )
}

