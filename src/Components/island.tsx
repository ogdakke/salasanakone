import { StrengthIndicator } from "@/Components/indicator"
import { Divider, Loading } from "@/Components/ui"
import { useTranslation } from "@/common/hooks/useLanguage"
import { FormContext } from "@/common/providers/FormProvider"
import { ResultContext } from "@/common/providers/ResultProvider"
import { debounce } from "@/common/utils/debounce"
import { strengthToColorAndLabel, validateLength } from "@/common/utils/helpers"
import { supportedLanguages } from "@/config"
import type { Language } from "@/models/translations"
import { Stores, deleteKey } from "@/services/database/db"
import { worker } from "@/services/initWorker"
import "@/styles/Island.css"
import type { Score, ZxcvbnResult } from "@zxcvbn-ts/core"
import { type Variants, animate, m, motion, useAnimate, useAnimation } from "framer-motion"
import { Download, FloppyDisk, Plus, SystemRestart, Xmark } from "iconoir-react"
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
        onClick={handleIslandChange}
      >
        <SystemRestart strokeWidth={1} className="Icon" style={{ opacity: isPill ? 1 : 0 }} />
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
      <SettingsIsland
        fetchStorage={fetchStorage}
        result={result}
        storage={usedSpace}
        key={IslandVariants.full}
      />,
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
  result?: ZxcvbnResult
}
const SettingsIsland = ({ storage, result, fetchStorage }: SettingsIslandProps) => {
  const { t } = useTranslation()
  const score = result?.score !== undefined ? result.score : 4
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

  async function handleDeletingDataset(lang: Language) {
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
      // on deletion success, invalidate cache and generate
      await generate(formState, "invalidate")
      fetchStorage()
    }
  }

  async function handleReDownLoadingDataset(lang: Language) {
    if (formState.dataset.failedToFetchDatasets.includes(lang)) {
      const updatedFailedDatasets = formState.dataset.failedToFetchDatasets.filter(
        (l) => l !== lang,
      )
      // Remove language from failed to fetch datasets to allow retrying fetching
      formState.dataset.failedToFetchDatasets = updatedFailedDatasets
      // set words to true and languge to the one being downloaded to trigger fetching dataset
      formState.formValues.words.selected = true
      formState.language = lang
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
      await generate(formState, "invalidate")
      fetchStorage()
    }
  }
  const offlineSlowHashing = result?.crackTimesDisplay.offlineSlowHashing1e4PerSecond
  const online10PerSec = result?.crackTimesDisplay.onlineNoThrottling10PerSecond
  const crackTimeIdentical = offlineSlowHashing === online10PerSec
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
              {!crackTimeIdentical
                ? `${offlineSlowHashing} - ${online10PerSec}`
                : offlineSlowHashing}
            </p>
          </div>
        </div>

        <div>
          <Divider className="IslandDivider" margin="0 -0.875rem" />
          <div className="SettingsFooter">
            <div className="flex flex-column gap-025">
              <span className="SecondaryText">{t("storageUsed")}</span>
              {storage ? <StorageIndicator storage={storage} /> : null}
            </div>
            <div className="flex flex-column gap-025">
              <span className="SecondaryText">{t("manageLanguages")}</span>
              <div className="flex gap-05">
                {supportedLanguages.map((language) => (
                  <button
                    key={language}
                    className="LanguageSettingItem"
                    type="button"
                    onClick={async () => {
                      isLanguageDeleted(language) || isLanguageFailed(language)
                        ? await handleReDownLoadingDataset(language)
                        : await handleDeletingDataset(language)
                    }}
                    value={language}
                  >
                    <span>{t(language)}</span>{" "}
                    {isLanguageDeleted(language) || isLanguageFailed(language) ? (
                      <Download width={18} height={18} />
                    ) : (
                      <Xmark style={{ marginTop: "1px" }} width={18} height={18} />
                    )}
                  </button>
                ))}
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
      <span className="CircleBackground">
        <FloppyDisk color="" strokeWidth={2} width={14} height={14} />
      </span>
      {storage}
      {t("megaByte")}
    </output>
  )
}

function StrengthCircle({ score }: { score: number }) {
  const { t } = useTranslation()
  const { color } = strengthToColorAndLabel(score)
  const percentageOfMax = Math.max(6, (score / 4) * 100)

  return (
    <motion.svg className="SettingsStrength" viewBox="0 0 36 36" initial="hidden" animate="animate">
      <title>{t("scoreDescription", { score: score.toString() })}</title>
      <path
        style={{ color: "#000" }}
        className=""
        d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
        fill="none"
        stroke="currentColor"
        strokeDasharray="100, 100"
        strokeWidth="4"
      />
      <motion.path
        animate={{ stroke: color, strokeDasharray: `${percentageOfMax}, 100` }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 12,
        }}
        d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
        fill="none"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </motion.svg>
  )
}

function NumberListScrollWheel({ selectedNumber }: { selectedNumber: number }) {
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
          await animate(scope.current, { filter: "blur(2px)", opacity: 0.7 })
          await animate(scope.current, { filter: "blur(0px)", opacity: 1 })
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
          >
            {score}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const settingsVariants: Variants = {
  initial: {},
  animate: {},
}
