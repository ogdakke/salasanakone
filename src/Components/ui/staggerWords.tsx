import { motion } from "framer-motion"
import { useMemo } from "react"

export function StaggerWords({ str }: { str: string }) {
  const splitString = str.split(" ")

  /** Trick to get a new key for each string to trigger reanimating */
  // biome-ignore lint/correctness/useExhaustiveDependencies: animation
  const randomKey = useMemo(() => {
    return Math.random().toFixed(3)
  }, [str])

  return splitString.map((word, i) => {
    return (
      <motion.span
        initial={{
          opacity: 0.05,
          WebkitFilter: "blur(3px)",
          filter: "blur(3px)",
        }}
        animate={{
          opacity: 1,
          WebkitFilter: "blur(0px)",
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.6,
          delay: i / 15,
        }}
        key={`${word}-${i}-${randomKey}`}
      >
        {word}{" "}
      </motion.span>
    )
  })
}
