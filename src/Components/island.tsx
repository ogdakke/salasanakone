import { StrengthIndicator } from "@/Components/indicator"
import { Loading } from "@/Components/ui"
import { useTranslation } from "@/common/hooks/useLanguage"
import { FormContext } from "@/common/providers/FormProvider"
import { ResultContext } from "@/common/providers/ResultProvider"
import { debounce } from "@/common/utils/debounce"
import { validateLength } from "@/common/utils/helpers"
import { worker } from "@/services/initWorker"
import "@/styles/Island.css"
import type { ZxcvbnResult } from "@zxcvbn-ts/core"
import { type Variants, m, motion } from "framer-motion"
import { Plus, Settings, Xmark } from "iconoir-react"
import { useCallback, useContext, useEffect, useState } from "react"

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
        onClick={handleIslandChange}
      >
        <Settings strokeWidth={1} className="Icon" style={{ opacity: isPill ? 1 : 0 }} />
        <Xmark className="Icon" style={{ opacity: isFull ? 1 : 0 }} />
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

  useEffect(() => {
    if (isEdited && passwordValue) {
      checkUserInputtedString(passwordValue)
      return
    }

    if (!validateString()) {
      setScore(4)
      return
    }

    if (passwordValue) {
      debounceCheck(passwordValue)
    }
  }, [passwordValue, isEdited, validateString, debounceCheck])

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
      <SettingsIsland result={result} storage={usedSpace} key={IslandVariants.full} />,
    ],
  ])

  return (
    <motion.div
      style={{ borderRadius: 32 }}
      className="IslandMain"
      data-state={IslandVariants.pill}
      layout
    >
      {variantMap.get(variant)}
    </motion.div>
  )
}

export const PillLoadingState = () => {
  return (
    <div className="IslandMain">
      <Loading className="" height="3.5rem" radius="4rem" />
    </div>
  )
}

const pillVariants: Variants = {
  initial: { borderColor: "transparent" },
  animate: {
    opacity: 1,
    borderColor: "rgba(var(--skeleton-glow), 1)",
    transition: {
      type: "spring",
      damping: 1,
      stiffness: 400,
      borderColor: { duration: 2 },
      opacity: { duration: 2 },
    },
  },
  hover: {
    // scale: 1.05,
  },
}

/**
 * Pill island
 */
const PillIsland = ({ score }: { score: number }) => {
  const { generate, formState } = useContext(FormContext)
  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0

  const buttonSize = 32
  return (
    <motion.button
      onClick={() => void generate(formState)}
      className="IslandBackground"
      variants={pillVariants}
      whileHover="hover"
      initial="initial"
      animate="animate"
    >
      <m.span
        tabIndex={0}
        style={{ filter: "blur(4px)" }}
        initial={{ opacity: 0, scale: 0.16 }}
        whileHover={{ scale: 1.25 }}
        whileFocus={{ scale: 1.25 }}
        whileTap={{ scale: isTouchDevice() ? 0.9 : 1 }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.6,
            delay: 0.2,
            scale: { duration: 0.4 },
          },
        }}
        className="IslandGenerateButton"
      >
        <Plus strokeWidth={2} height={buttonSize} width={buttonSize} />
      </m.span>
      <StrengthIndicator score={score} />
    </motion.button>
  )
}

type SettingsIslandProps = {
  storage: string | undefined
  result?: ZxcvbnResult
}
const SettingsIsland = ({ storage, result }: SettingsIslandProps) => {
  const { t } = useTranslation()

  // function isLanguageDownloaded(lang: Language) {
  //   if (formState.dataset.deletedDatasets.includes(lang)) {
  //     return false
  //   }
  //   return true
  // }

  // const getNextValidLanguage = (langToToggle: Language): Language | undefined => {
  //   const validLanguages = supportedLanguages.filter(
  //     () => !formState.dataset.deletedDatasets.includes(langToToggle),
  //   )

  //   if (validLanguages.length > 0) {
  //     return validLanguages[0]
  //   }

  //   // no valid languages were found
  //   return undefined
  // }

  // function removeLangFromArr(arr: Language[], langToRemove: Language): Language[] {
  //   const filtered = arr.filter((lang) => lang !== langToRemove)

  //   return filtered
  // }

  // async function handleTogglingDataset(lang: Language): Promise<void> {
  //   if (formState.dataset.deletedDatasets.includes(lang)) {
  //     dispatch(
  //       setDatasetFields({
  //         ...formState.dataset,
  //         deletedDatasets: removeLangFromArr(supportedLanguages, lang),
  //       }),
  //     )
  //   }

  //   const del = await deleteKey(Stores.Languages, lang)
  //   if (!del) {
  //     dispatch(
  //       setDatasetFields({
  //         ...formState.dataset,
  //         deletedDatasets: [...formState.dataset.deletedDatasets, lang],
  //       }),
  //     )

  //     const nextValidLanguage = getNextValidLanguage(lang)
  //     // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  //     console.log("next: ", nextValidLanguage)
  //     if (nextValidLanguage) {
  //       dispatch(setLanguage(nextValidLanguage))
  //     } else if (!nextValidLanguage) {
  //       dispatch(
  //         setFormField({
  //           field: "words",
  //           selected: false,
  //         }),
  //       )
  //     }
  //   }
  // }

  return (
    <motion.div
      className="IslandSettings flex flex-column"
      style={{ height: 200 }}
      variants={settingsVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        style={{ filter: "blur(6px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
        className="SettingsContent"
      >
        <div className="SettingsTitleContainer">
          <h3>{t("settingsTitle")}</h3>
          <p className="SecondaryText">
            {/* {t("storageUsed")}  */}
            {storage ? (
              <output
                title={t("storageUsedDesc", { storage: storage }).toString()}
                className="StorageUsed"
              >
                {storage}&nbsp;{t("megaByte")}
              </output>
            ) : (
              "--"
            )}
          </p>
        </div>
        <div>
          {result ? (
            <p>
              {t("timeToCrack")}: {result.crackTimesDisplay.offlineFastHashing1e10PerSecond}
              <br />
              {t("guessesNeeded")}: {result.guesses.toExponential(2)}
            </p>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  )
}

const settingsVariants: Variants = {
  initial: {},
  animate: {},
}
