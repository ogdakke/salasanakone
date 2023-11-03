import { StrengthIndicator } from "@/Components/indicator"
import { Loading } from "@/Components/ui"
import { useSelector } from "@/common/hooks"
import { t } from "@/common/utils/getLanguage"
import "@/styles/Island.css"
import { motion } from "framer-motion"
import { Plus, Refresh } from "iconoir-react"
import { Suspense, useState } from "react"

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

  /**
   * Full Island
   *
   */
  const FullIsland = () => (
    <motion.div
      key="Full"
      className="IslandContent FullIsland"
      layoutId="Island"
      initial={{
        borderRadius: "32px",
        width: "340px",
        opacity: 1,
        filter: "blur(8px)",
      }}
      animate={{
        filter: "blur(0)",
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <MotionButton generate={generate} />
    </motion.div>
  )

  /** List the variants */
  const islandVariants = {
    [IslandVariants.full]: <FullIsland />,
    // [IslandVariants.pill]: <PillIsland />,
  }

  return (
    <Suspense fallback={<Loading height="84" />}>
      <motion.div className="IslandMain" data-state={IslandVariants.pill}>
        {/* Render all different variants conditionally */}
        {/* {islandVariants[IslandVariants.pill]} */}
      </motion.div>
    </Suspense>
  )
}

type MotionButtonProps = Props & {
  variant?: ButtonVariant
}

enum ButtonVariant {
  PILL = "squished",
  ROUND = "round",
}

export const MotionButton = ({ generate, variant = ButtonVariant.PILL }: MotionButtonProps) => {
  if (variant === ButtonVariant.PILL) {
    return (
      <motion.button
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => void generate()}
        className="IslandPillButton"
      >
        {t("new")}
      </motion.button>
    )
  }

  return (
    <motion.button
      initial={{
        borderRadius: "2rem",
        scale: 0.3,
      }}
      animate={{
        // borderRadius: "3rem",
        scale: 1,
        transition: {
          duration: 1,
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
      <Refresh className="Refresh" width={30} height={30} />
    </motion.button>
  )
}

/**
 * Pill island
 *
 */
const PillIsland = ({ generate, finalPassword }: Props) => {
  const buttonSize = 32
  return (
    <motion.button
      onClick={() => generate()}
      type="button"
      className="IslandMobileBackground"
      whileFocus={{ scale: 1.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="IslandGenerateButton">
        <Plus strokeWidth={2} height={buttonSize} width={buttonSize} />
      </span>
      <StrengthIndicator password={finalPassword} />
    </motion.button>
  )
}

