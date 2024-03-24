import { FullIsland, FullIslandLoading } from "@/Components/fullIsland"
import { PillIsland } from "@/Components/pillIsland"
import { FormContext } from "@/common/providers/FormProvider"
import { ResultContext } from "@/common/providers/ResultProvider"
import { debounce } from "@/common/utils/debounce"
import { validateLength } from "@/common/utils/helpers"
import { worker } from "@/services/initWorker"
import "@/styles/Island.css"
import type { ZxcvbnResult } from "@zxcvbn-ts/core"
import { animate, motion } from "framer-motion"
import { SystemRestart, Xmark } from "iconoir-react"
import { useCallback, useContext, useEffect, useRef, useState } from "react"

enum IslandVariants {
  full = "full",
  pill = "pill",
}
const isDev = import.meta.env.DEV

export const Island = () => {
  const [islandVariant, setIslandVariant] = useState(IslandVariants.pill)

  function handleIslandChange() {
    if (islandVariant === IslandVariants.pill) {
      return setIslandVariant(IslandVariants.full)
    }
    setIslandVariant(IslandVariants.pill)
  }
  const isPill = islandVariant === IslandVariants.pill
  const isFull = islandVariant === IslandVariants.full

  return (
    <div className="IslandAndButton" data-variant={islandVariant}>
      <SimpleIsland variant={islandVariant} />
      <motion.button
        layoutId="settings-button"
        className="SettingsButton"
        type="button"
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.06 }}
        onClick={handleIslandChange}
      >
        <SystemRestart
          strokeWidth={1}
          className="Icon blurFadeIn"
          style={{ display: isPill ? "block" : "none" }}
        />
        <Xmark className="Icon blurFadeIn" style={{ display: isFull ? "block" : "none" }} />
      </motion.button>
    </div>
  )
}

type SimpleIslandProps = {
  variant: IslandVariants
}

const SimpleIsland = ({ variant }: SimpleIslandProps) => {
  const [usedSpace, setUsedSpace] = useState<string>()
  const [result, setResult] = useState<ZxcvbnResult>()
  // Initial loading state is -1
  const [score, setScore] = useState(-1) // TODO this can probably be derived, so fix
  const islandRef = useRef<HTMLDivElement>(null)

  const { finalPassword } = useContext(ResultContext)
  const { formState } = useContext(FormContext)
  const { formValues, sliderValue } = formState
  const { passwordValue, isEdited } = finalPassword

  const CHECK_DEBOUNCE_TIME = 300

  const fetchStorage = async () => {
    try {
      const estimate = await navigator.storage.estimate()
      if (estimate.usage) {
        setUsedSpace((estimate.usage / 1024 / 1024).toFixed(1))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const validateString = useCallback(() => {
    if (!formValues.words.selected && sliderValue > 25) {
      // a rndm string needs not be checked if its longer than 15
      return false
    }
    if (formValues.words.selected && sliderValue > 6) {
      return false
    }
    return true
  }, [formValues, sliderValue])

  const workerCallback = useCallback((e: MessageEvent<ZxcvbnResult>) => {
    const result: ZxcvbnResult = e.data
    isDev && console.debug("result from worker", result)
    setResult(result)
    setScore(result.score)
  }, [])

  useEffect(() => {
    worker.onmessage = workerCallback
  }, [workerCallback])

  const debounceCheck = useCallback(
    debounce((str: string) => {
      checkStrengthInWorker(str)
    }, CHECK_DEBOUNCE_TIME),
    [],
  )

  /** validates on: language change, variant change, passwordValue change, if isEdited by user */
  useEffect(() => {
    if (isEdited && passwordValue) {
      checkUserInputtedString(passwordValue)
      return
    }

    if (!validateString() && variant !== IslandVariants.full) {
      setScore(4)
      return
    }

    if (passwordValue) {
      debounceCheck(passwordValue)
    }
  }, [passwordValue, isEdited, validateString, debounceCheck, variant])

  function checkUserInputtedString(str: string) {
    const validatedLengthString = validateLength(str, 128)
    checkStrengthInWorker(validatedLengthString)
  }

  function checkStrengthInWorker(str: string) {
    worker.postMessage({ strValue: str })
  }

  useEffect(() => {
    void fetchStorage()
  }, [fetchStorage])

  const variantMap = new Map([
    [IslandVariants.pill, <PillIsland score={score} key={IslandVariants.pill} />],
    [
      IslandVariants.full,
      result ? (
        <FullIsland
          fetchStorage={fetchStorage}
          result={result}
          storage={usedSpace}
          key={IslandVariants.full}
        />
      ) : (
        <FullIslandLoading />
      ),
    ],
  ])

  const isPill = variant === IslandVariants.pill
  const borderRgb = getComputedStyle(document.documentElement).getPropertyValue(
    "--callout-border-rgb",
  )
  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0

  return (
    <motion.div
      ref={islandRef}
      style={{ borderRadius: 40, border: `1px solid rgba(${borderRgb}, 0.12)` }}
      tabIndex={-1}
      className="IslandMain"
      whileHover={{ scale: isPill ? 1.02 : 1 }}
      whileTap={{ scale: isTouchDevice() ? 0.96 : 1 }}
      onLayoutAnimationStart={() => {
        if (islandRef.current) {
          animate(islandRef.current, { borderColor: `rgba(${borderRgb}, 0.05)` }, { duration: 0.1 })
        }
      }}
      onLayoutAnimationComplete={() => {
        if (islandRef.current) {
          animate(
            islandRef.current,
            { borderColor: `rgba(${borderRgb}, 0.12)` },
            { duration: 1.25 },
          )
        }
      }}
      data-state={IslandVariants.pill}
      layout
    >
      {variantMap.get(variant)}
    </motion.div>
  )
}
