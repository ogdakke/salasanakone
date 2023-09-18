import { StrengthIndicator } from "@/Components/indicator"
import { useSelector } from "@/common/hooks"
import { AnimatePresence, motion } from "framer-motion"
import { Refresh } from "iconoir-react"
import { Suspense, useEffect, useState } from "react"
import "../styles/Island.css"
import { Loading } from "./ui"

interface Props {
  generate: () => void
  finalPassword?: string | undefined
}

enum IslandVariants {
  full = "full",
  pill = "pill",
}
export const Island = ({ generate, finalPassword }: Props) => {
  const formValues = useSelector((state) => state.passphraseForm.formValues)
  const sliderValue = useSelector((state) => state.passphraseForm.sliderValue)
  const [islandVariant, setIslandVariant] = useState<IslandVariants>(IslandVariants.pill)
  let isVisible = islandVariant === IslandVariants.pill

  const onHoverOrTap = () => {
    // Set the variant to Full
    if (islandVariant === IslandVariants.pill) {
      isVisible = false
      setIslandVariant(IslandVariants.full)
    }
  }

  // On deps change, set variant to Pill
  useEffect(() => {
    if (islandVariant === IslandVariants.full) {
      setIslandVariant(IslandVariants.pill)
    }
  }, [formValues, sliderValue])

  const PillIsland = () => {
    return (
      <motion.button
        key="Pill"
        className="IslandContent PillIsland"
        type="button"
        layoutId="Island"
        initial={{ borderRadius: "32px" }}
        animate={{ borderRadius: "32px" }}
        whileFocus={{ scale: 1.1 }}
        onClick={onHoverOrTap}
      >
        <AnimatePresence>
          {isVisible ? <StrengthIndicator password={finalPassword} /> : null}
        </AnimatePresence>
      </motion.button>
    )
  }

  const FullIsland = () => (
    <motion.div
      key="Full"
      className="IslandContent FullIsland"
      layoutId="Island"
      initial={{
        borderRadius: "32px",
        width: "340px",
        opacity: 1,
      }}
    >
      <MotionButton generate={generate} />
    </motion.div>
  )

  /** List the variants */
  const islandVariants = {
    [IslandVariants.full]: <FullIsland />,
    [IslandVariants.pill]: <PillIsland />,
  }

  return (
    <Suspense fallback={<Loading height="84" />}>
      <div onMouseEnter={onHoverOrTap} className="IslandMain" data-state={islandVariant}>
        {/* Render all different variants conditionally */}
        {islandVariants[islandVariant]}
      </div>
    </Suspense>
  )
}

const MotionButton = ({ generate }: Props) => {
  return (
    <motion.button
      initial={{
        borderRadius: "2rem",
        scale: 0.3,
      }}
      animate={{
        borderRadius: "3rem",
        scale: 1,
        transition: {
          type: "spring",
        },
      }}
      whileHover={{
        scale: 1.1,
        transition: {
          type: "tween",
          duration: 0.3,
        },
      }}
      whileTap={{ scale: 0.95 }}
      className="IslandGenerateButton"
      onClick={() => void generate()}
      layout
    >
      <Refresh className="Refresh spin" width={30} height={30} />
    </motion.button>
  )
}
