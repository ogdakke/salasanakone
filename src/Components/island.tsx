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
      <motion.div
        onMouseEnter={onHoverOrTap}
        onTap={onHoverOrTap}
        // whileHover={() => onHoverOrTap()}
        initial={{ height: "80px" }}
        animate={{ height: "80px" }}
        transition={{
          duration: 5,
          type: "spring",
          damping: 12,
          delay: 0,
        }}
        className="IslandMain"
        data-state={islandVariant}
        layout
      >
        {/* Render all different variants conditionally */}
        {islandVariants[islandVariant]}
      </motion.div>
    </Suspense>
  )
}

type PillIslandProps = Props & {
  isVisible: boolean
}
const PillIsland = ({ isVisible, generate, finalPassword }: PillIslandProps) => {
  const [pillWidth, setPillWidth] = useState(60)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value)
    setPillWidth(num)
  }

  return (
    <>
      <motion.div
        className="IslandContent PillIsland"
        layoutId="Island"
        initial={{
          borderRadius: "32px",
        }}
      >
        <motion.div
          className="flex-center space-between"
          animate={{ width: pillWidth, opacity: 1 }}
          initial={{ width: 0 }}
          transition={{
            type: "spring",
            duration: 0.2,
          }}
          layout
        >
          <AnimatePresence>
            {isVisible ? <StrengthIndicator password={finalPassword} /> : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  )
}

const FullIsland = ({ generate, finalPassword }: Props) => (
  <motion.div
    className="IslandContent FullIsland"
    layoutId="Island"
    initial={{
      borderRadius: "32px",
      width: "340px",
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
      layout
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
