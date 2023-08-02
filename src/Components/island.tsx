import { Refresh } from "iconoir-react"
import "../styles/Island.css"
import { InputValueTypes, generatePassword } from "./form"
import { StrengthIndicator } from "./indicator"
import { animate, motion } from "framer-motion"

interface Props {
  generate: () => void
  finalPassword: string
  formValues: InputValueTypes
  sliderValue: number
}

export const Island = ({ generate, finalPassword, formValues, sliderValue }: Props) => {
  // console.log(formValues, sliderValue)

  const island = {
    visible: {
      opacity: 1,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.3,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "beforeChildren",
      },
    },
  }

  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      initial={{
        scaleX: 0.9,
        scaleY: 0.95,
      }}
      animate={{
        scaleX: 1,
        scaleY: 1,
      }}
      transition={{
        duration: 0.2,
        type: "spring",
        damping: 10,
      }}
      // variants={island}
      className="IslandMain"
    >
      <motion.div initial="hidden" animate="visible" className="IslandContent">
        <StrengthIndicator password={finalPassword} sliderValue={sliderValue} formValues={formValues} />
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
    </motion.div>
  )
}
