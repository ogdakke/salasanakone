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

  const islandVariants = {
    [IslandVariants.full]: <FullIsland generate={generate} finalPassword={finalPassword} />,
    [IslandVariants.pill]: (
      <PillIsland isVisible={isVisible} generate={generate} finalPassword={finalPassword} />
    ),
  }

  useEffect(() => {
    if (islandVariant === IslandVariants.full) {
      setIslandVariant(IslandVariants.pill)
    }
  }, [formValues, sliderValue])

  const onHoverOrTap = () => {
    if (islandVariant === IslandVariants.pill) {
      isVisible = false
      setIslandVariant(IslandVariants.full)
    }
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

type PillIslandProps = Props & {
  isVisible: boolean
}
const PillIsland = ({ isVisible, generate, finalPassword }: PillIslandProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value)
  }

  return (
    <motion.div
      key="Pill"
      className="IslandContent PillIsland"
      layoutId="Island"
      initial={{
        borderRadius: "32px",
      }}
    >
      <motion.div
        className="flex-center space-between"
        animate={{ opacity: 1 }}
        initial={{ width: 0 }}
        transition={{
          type: "spring",
          duration: 0.2,
        }}
      >
        <AnimatePresence>
          {isVisible ? <StrengthIndicator password={finalPassword} /> : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

const FullIsland = ({ generate, finalPassword }: Props) => (
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
    <motion.div
      className="flex-center space-between "
      animate={{
        scaleY: 1,
        opacity: 1,
      }}
      initial={{
        scaleY: 0.5,
        opacity: 0,
      }}
      transition={{
        delay: 0.25,
      }}
    >
      {/* <StrengthIndicator password={finalPassword} /> */}
      <div className="relative">
        <MotionButton generate={generate} />
      </div>
    </motion.div>
  </motion.div>
)

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
          delay: 0.2,
          type: "spring",
        },
      }}
      whileHover={{
        scale: 1.1,
        transition: {
          delay: 0,
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
