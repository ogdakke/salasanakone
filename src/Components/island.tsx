import { FormContext, FormDispatchContext } from "@/Components/FormContext"
import { StrengthIndicator } from "@/Components/indicator"
import { Loading } from "@/Components/ui"
import { useLanguage, useTranslation } from "@/common/utils/getLanguage"
import { supportedLanguages } from "@/config"
import { Language } from "@/models/translations"
import { Stores, deleteKey } from "@/services/database/db"
import { setDatasetFields, setFormField, setLanguage } from "@/services/reducers/formReducer"
import "@/styles/Island.css"
import { Variants, m, motion } from "framer-motion"
import { Download, Plus, Settings, Xmark } from "iconoir-react"
import { useContext, useEffect, useState } from "react"

enum IslandVariants {
  full = "full",
  pill = "pill",
}

export const Island = () => {
  const [islandVariant, setIslandVariant] = useState(IslandVariants.pill)

  function handleIslandChange() {
    if (islandVariant === IslandVariants.pill) {
      return setIslandVariant(IslandVariants.full)
    }
    setIslandVariant(IslandVariants.pill)
  }

  return (
    <div className="IslandAndButton">
      <SimpleIsland variant={islandVariant} />
      <button type="button" onClick={handleIslandChange}>
        <Settings />
      </button>
    </div>
  )
}

type SimpleIslandProps = {
  variant: IslandVariants
}

const SimpleIsland = ({ variant }: SimpleIslandProps) => {
  const [usedSpace, setUsedSpace] = useState<string>()
  const { language } = useLanguage()

  const fetchStorage = async () => {
    try {
      const estimate = await navigator.storage.estimate()
      setUsedSpace((estimate.usage! / 1024 / 1024).toFixed(2))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    void fetchStorage()
  }, [language])

  const variantMap = new Map([
    [IslandVariants.pill, <PillIsland key={IslandVariants.pill} />],
    [IslandVariants.full, <SettingsIsland storage={usedSpace} key={IslandVariants.full} />],
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
const PillIsland = () => {
  const { generate } = useContext(FormContext)
  const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0

  const buttonSize = 32
  return (
    <motion.button
      onClick={() => void generate()}
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
      <StrengthIndicator />
    </motion.button>
  )
}

type SettingsIslandProps = {
  storage: string | undefined
}
const SettingsIsland = ({ storage }: SettingsIslandProps) => {
  const { t } = useTranslation()
  const { formState } = useContext(FormContext)
  const { dispatch } = useContext(FormDispatchContext)

  function isLanguageDownloaded(lang: Language) {
    if (formState.dataset.deletedDatasets.includes(lang)) {
      return false
    }
    return true
  }

  const getNextValidLanguage = (): Language | undefined => {
    const validLanguages = supportedLanguages.filter(
      (lang) => !formState.dataset.deletedDatasets.includes(lang),
    )

    if (validLanguages.length > 0) {
      return validLanguages[0]
    }

    // no valid languages were found
    return undefined
  }

  async function handleTogglingDataset(lang: Language): Promise<void> {
    if (formState.dataset.deletedDatasets.includes(lang)) {
      return
    }

    const del = await deleteKey(Stores.Languages, lang)
    if (!del) {
      dispatch(
        setDatasetFields({
          ...formState.dataset,
          deletedDatasets: [...formState.dataset.deletedDatasets, lang],
        }),
      )

      const nextValidLanguage = getNextValidLanguage()
      console.log("next: ", nextValidLanguage)
      if (nextValidLanguage) {
        dispatch(setLanguage(nextValidLanguage))
      } else if (!nextValidLanguage) {
        dispatch(
          setFormField({
            field: "words",
            selected: false,
          }),
        )
      }
    }
  }

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
        <div className="flex space-between pb-025">
          <h3>Settings</h3>
          <p className="SecondaryText" title={"Storage usage estimation"}>
            Storage: <output>{storage ? storage : "--"}</output> Mb
          </p>
        </div>
        <div>
          <h5>Manage your languages</h5>
          <div className="LangaugesContainer">
            {supportedLanguages.map((lang) => {
              return (
                <motion.button
                  key={lang}
                  type="button"
                  className="LanguageSettingItem interact"
                  whileHover={{ scale: 1.05 }}
                  whileFocus={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleTogglingDataset(lang)}
                >
                  <span className="SecondaryText">{t(lang)}</span>
                  {isLanguageDownloaded(lang) ? (
                    <Xmark width={16} height={16} />
                  ) : (
                    <Download width={16} height={16} />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const settingsVariants: Variants = {
  initial: {},
  animate: {},
}
