import "@/styles/NumberListScrollWheel.css"
import type { Score } from "@zxcvbn-ts/core"
import { motion, useAnimate, useAnimation } from "framer-motion"
import { useEffect } from "react"

export function NumberListScrollWheel({ selectedNumber }: { selectedNumber: number }) {
  const controls = useAnimation()
  const [scope, animate] = useAnimate()
  const listHeight = 60 // Height of each number in the list
  const numbers: Score[] = [0, 1, 2, 3, 4] // The numbers in the scrollwheel

  // Calculate the Y offset to center the selected number
  const centerY = -(selectedNumber * listHeight) + listHeight / 2

  useEffect(() => {
    controls.start({
      y: centerY - listHeight,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 16,
      },
    })
  }, [centerY, controls])

  return (
    <div
      className="NumberListContainer"
      style={{
        height: "calc(100% - 4px)",
      }}
    >
      <motion.div
        ref={scope}
        animate={controls}
        onAnimationStart={async () => {
          await animate(scope.current, { filter: "blur(2px)", opacity: 0.5 })
          await animate(scope.current, { filter: "blur(0px)", opacity: 1 }, { duration: 0.4 })
        }}
        className="NumberList"
        style={{
          position: "absolute",
          top: "44%",
          left: "0",
          right: "0",
        }}
      >
        {numbers.map((score) => (
          <span
            key={score}
            style={{
              height: `${listHeight}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="NumberListChar"
            data-score={score}
          >
            {score}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
