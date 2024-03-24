import { StrengthIndicator } from "@/Components/indicator"
import { NumberListScrollWheel, StrengthCircle } from "@/Components/strengthCircle"
import { Loading } from "@/Components/ui"
import { useTranslation } from "@/common/hooks/useLanguage"
import { FormContext } from "@/common/providers/FormProvider"
import { ResultContext } from "@/common/providers/ResultProvider"
import { debounce } from "@/common/utils/debounce"
import { validateLength } from "@/common/utils/helpers"
import { supportedLanguages } from "@/config"
import type { Language } from "@/models/translations"
import { Stores, deleteKey } from "@/services/database/db"
import { worker } from "@/services/initWorker"
import "@/styles/Island.css"
import type { ZxcvbnResult } from "@zxcvbn-ts/core"
import { type Variants, animate, m, motion } from "framer-motion"
import { ArrowDown, Plus, SystemRestart, Xmark } from "iconoir-react"
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

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
        <SettingsIsland
          fetchStorage={fetchStorage}
          result={result}
          storage={usedSpace}
          key={IslandVariants.full}
        />
      ) : (
        <PillLoadingState />
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

export const PillLoadingState = () => {
  return (
    <div className="IslandAndButton" style={{ marginRight: 0 }}>
      <Loading className="" height="10rem" radius="1rem" />
    </div>
  )
}

const pillVariants: Variants = {
  initial: { borderColor: "rgba(0,0,0,0)" },
  animate: {
    opacity: 1,
    borderColor: "rgba(22, 22, 22, 1)",
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

  const buttonSize = 26
  return (
    <motion.button
      onClick={() => {
        generate(formState)
      }}
      className="IslandBackground"
      variants={pillVariants}
      whileHover="hover"
      initial="initial"
      animate="animate"
    >
      <m.span
        tabIndex={-1}
        style={{ filter: "blur(4px)" }}
        initial={{ opacity: 0, scale: 0.16 }}
        whileHover={{ scale: 1.05 }}
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
  fetchStorage: () => void
  result: ZxcvbnResult
}
const SettingsIsland = ({ storage, result, fetchStorage }: SettingsIslandProps) => {
  const { t } = useTranslation()
  const { score, crackTimesDisplay } = result
  const { offlineSlowHashing1e4PerSecond, onlineNoThrottling10PerSecond } = crackTimesDisplay
  const { formState, generate } = useContext(FormContext)

  function isLanguageDeleted(lang: Language) {
    if (formState.dataset.deletedDatasets.includes(lang)) {
      return true
    }
    return false
  }

  function isLanguageFailed(lang: Language) {
    if (formState.dataset.failedToFetchDatasets.includes(lang)) {
      return true
    }
    return false
  }

  function isLanguageFetched(lang: Language) {
    if (formState.dataset.fetchedDatasets.includes(lang)) {
      return true
    }
    return false
  }

  async function handleDeletingDataset(lang: Language): Promise<void> {
    if (!formState.dataset.deletedDatasets.includes(lang)) {
      formState.dataset.deletedDatasets.push(lang)
      // If current language is the one being deleted, switch words to false
      if (formState.language === lang) {
        formState.formValues.words.selected = false
      }

      const deleted = await deleteKey(Stores.Languages, lang)

      if (deleted === "failed") {
        // if deletion failes, eg. the key was not for some reason found, pop the latest language off
        formState.dataset.deletedDatasets.pop()
      }

      fetchStorage()

      // If the current language is the one being deleted, dataset cache needs to be invalidated
      if (formState.language === lang) {
        // on deletion success, invalidate cache and generate
        return await generate(formState, "invalidate")
      }
      await generate(formState)
    }
  }

  const handleReDownLoadingDataset = async (lang: Language) => {
    if (formState.dataset.failedToFetchDatasets.includes(lang)) {
      const updatedFailedDatasets = formState.dataset.failedToFetchDatasets.filter(
        (l) => l !== lang,
      )
      // Remove language from failed to fetch datasets to allow retrying fetching
      formState.dataset.failedToFetchDatasets = updatedFailedDatasets
      // set words to true and languge to the one being downloaded to trigger fetching dataset
      formState.formValues.words.selected = true
      formState.language = lang
      // Inform worker of language change
      worker.postMessage(lang)
      await generate(formState, "invalidate")
      fetchStorage()
    }

    if (formState.dataset.deletedDatasets.includes(lang)) {
      const updatedDeletedLanguges = formState.dataset.deletedDatasets.filter(
        (language) => language !== lang,
      )
      formState.dataset.deletedDatasets = updatedDeletedLanguges

      // set words to true and languge to the one being downloaded to trigger fetching dataset
      formState.formValues.words.selected = true
      formState.language = lang
      worker.postMessage(lang)
      await generate(formState, "invalidate")
      fetchStorage()
    }
  }

  const debounceDownloading = useCallback(
    debounce(
      (lang: Language) => {
        handleReDownLoadingDataset(lang)
      },
      600,
      true,
    ),
    [],
  )

  const debounceClick = useCallback(
    debounce(async (language: Language, isDeleted: boolean) => {
      isDeleted ? debounceDownloading(language) : await handleDeletingDataset(language)
    }, 160),
    [],
  )

  const langCanBeDownLoaded = (lang: Language) =>
    isLanguageDeleted(lang) || isLanguageFailed(lang) || !isLanguageFetched(lang)

  const crackTimeIdentical = offlineSlowHashing1e4PerSecond === onlineNoThrottling10PerSecond

  return (
    <motion.div
      className="IslandSettings flex flex-column blurFadeIn"
      style={{ height: 160 }}
      initial="initial"
      animate="animate"
    >
      <motion.div
        style={{ filter: "blur(6px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
        className="SettingsContent"
      >
        <div className="flex gap-1">
          <div className="ScoreCircleContainer">
            <StrengthCircle score={score} />
            <div className="NumberListOuterBox">
              <NumberListScrollWheel selectedNumber={score} />
            </div>
          </div>
          <div className="SettingsTopRowElement">
            <p>{t("timeToCrack")}</p>
            <p>
              <StaggerWords
                str={
                  !crackTimeIdentical
                    ? `${offlineSlowHashing1e4PerSecond} - ${onlineNoThrottling10PerSecond}`
                    : `${offlineSlowHashing1e4PerSecond}`
                }
              />
            </p>
          </div>
        </div>
        <div>
          <div className="SettingsFooter">
            <div className="flex flex-column gap-025">
              <span className="SecondaryText opacity-75">{t("storageUsed")}</span>
              {storage ? <StorageIndicator storage={storage} /> : null}
            </div>
            <div className="flex flex-column gap-025">
              <span className="SecondaryText opacity-75">{t("manageLanguages")}</span>
              <div className="flex gap-05">
                {supportedLanguages.map((language) => {
                  const isDeleted = langCanBeDownLoaded(language)
                  return (
                    <button
                      key={language}
                      className="LanguageSettingItem"
                      type="button"
                      onClick={() => debounceClick(language, isDeleted)}
                      data-state={isDeleted ? "download" : "delete"}
                      title={
                        isDeleted
                          ? t("downloadDataset", { language: t(language).toString() }).toString()
                          : t("deleteDataset", { language: t(language).toString() }).toString()
                      }
                      value={language}
                    >
                      {isDeleted ? (
                        <ArrowDown
                          style={{ margin: "1px 2px" }}
                          className="Icon"
                          width={14}
                          height={14}
                        />
                      ) : (
                        <Xmark className="Icon" width={18} height={18} />
                      )}
                      <span>{t(language)}</span>{" "}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function StorageIndicator({ storage }: { storage: string }) {
  const { t } = useTranslation()

  return (
    <output title={t("storageUsedDesc", { storage: storage }).toString()} className="StorageUsed">
      <span className="CircleBackground" />
      {storage} {t("megaByte")}
    </output>
  )
}

function StaggerWords({ str }: { str: string }) {
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
