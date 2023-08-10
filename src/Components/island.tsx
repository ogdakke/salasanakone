import { motion } from "framer-motion"
import { Refresh } from "iconoir-react"
import { Suspense } from "react"
import { IndexableInputValue } from "../models"
import "../styles/Island.css"
import { StrengthIndicator } from "./indicator"
import { Loading } from "./ui/loading"

interface Props {
  generate: () => void
  finalPassword: string
  formValues: IndexableInputValue
  sliderValue: number
}

export const Island = ({ generate, finalPassword, formValues, sliderValue }: Props) => {
  return (
    <Suspense fallback={<Loading height="84" />}>
      <motion.div
        initial={{
          y: 0,
          scale: 1,
        }}
        animate={{
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 5,
          type: "spring",
          damping: 12,
          delay: 0,
        }}
        className="IslandMain"
      >
        <div className="IslandContent">
          <motion.div
            animate={{
              opacity: 1,
            }}
            initial={{
              opacity: 0,
            }}
            className="flex space-between"
          >
            <StrengthIndicator
              password={finalPassword}
              sliderValue={sliderValue}
              formValues={formValues}
            />
            <motion.button
              whileHover={{
                scale: 1.1,
                transition: {
                  type: "tween",
                  duration: 0.1,
                },
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="IslandGenerateButton"
              onClick={() => void generate()}
            >
              <Refresh className="Refresh spin" width={32} height={32} />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </Suspense>
  )
}
