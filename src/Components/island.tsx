import { Refresh } from "iconoir-react"
import "../styles/Island.css"
import { InputValueTypes } from "./form"
import { StrengthIndicator } from "./indicator"
import { motion } from "framer-motion"
import { Suspense } from "react"
import { Loading } from "./ui/loading"

interface Props {
  generate: () => void
  finalPassword: string
  formValues: InputValueTypes
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
              onClick={() => generate()}
            >
              <Refresh width={32} height={32} />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </Suspense>
  )
}
