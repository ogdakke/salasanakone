import { StorageIndicator } from "@/Components/StorageIndicator"
import { NumberListScrollWheel } from "@/Components/numberListScrollWheel"
import { StrengthCircle } from "@/Components/strengthCircle"
import { Loading } from "@/Components/ui/loading"
import { StaggerWords } from "@/Components/ui/staggerWords"
import { useTranslation } from "@/common/hooks/useLanguage"
import { FormContext } from "@/common/providers/FormProvider"
import { debounce } from "@/common/utils/debounce"
import { supportedLanguages } from "@/config"
import type { Language } from "@/models/translations"
import { Stores, deleteKey } from "@/services/database/db"
import { worker } from "@/services/initWorker"
import "@/styles/FullIsland.css"
import type { ZxcvbnResult } from "@zxcvbn-ts/core"
import { motion } from "framer-motion"
import { ArrowDown, Xmark } from "iconoir-react"
import { useCallback, useContext } from "react"

type SettingsIslandProps = {
  storage: string | undefined
  fetchStorage: () => void
  result: ZxcvbnResult
}
export const FullIsland = ({
  storage,
  result,
  fetchStorage,
}: SettingsIslandProps) => {
  const { t } = useTranslation()
  const { score, crackTimesDisplay } = result
  const { offlineSlowHashing1e4PerSecond, onlineNoThrottling10PerSecond } =
    crackTimesDisplay
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
      const updatedFailedDatasets =
        formState.dataset.failedToFetchDatasets.filter((l) => l !== lang)
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
        (language) => language !== lang
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
      true
    ),
    []
  )

  const debounceClick = useCallback(
    debounce(async (language: Language, isDeleted: boolean) => {
      isDeleted
        ? debounceDownloading(language)
        : await handleDeletingDataset(language)
    }, 160),
    []
  )

  const langCanBeDownLoaded = (lang: Language) =>
    isLanguageDeleted(lang) ||
    isLanguageFailed(lang) ||
    !isLanguageFetched(lang)

  const crackTimeIdentical =
    offlineSlowHashing1e4PerSecond === onlineNoThrottling10PerSecond

  return (
    <motion.div
      className='IslandSettings flex flex-column blurFadeIn'
      style={{ height: 160 }}
      initial='initial'
      animate='animate'
    >
      <motion.div
        style={{ filter: "blur(6px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
        className='SettingsContent'
      >
        <div className='flex gap-1'>
          <div className='ScoreCircleContainer' data-score={score}>
            <span className='StrengthCircleBackground' />
            <StrengthCircle score={score} />
            <div className='NumberListOuterBox'>
              <NumberListScrollWheel selectedNumber={score} />
            </div>
          </div>
          <div className='SettingsTopRowElement'>
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
          <div className='SettingsFooter'>
            <div className='flex flex-column gap-025'>
              <span className='SecondaryText opacity-75'>
                {t("storageUsed")}
              </span>
              {storage ? <StorageIndicator storage={storage} /> : null}
            </div>
            <div className='flex flex-column gap-025'>
              <span className='SecondaryText opacity-75'>
                {t("manageLanguages")}
              </span>
              <div className='flex gap-05'>
                {supportedLanguages.map((language) => {
                  const isDeleted = langCanBeDownLoaded(language)
                  return (
                    <button
                      key={language}
                      className='LanguageSettingItem'
                      type='button'
                      onClick={() => debounceClick(language, isDeleted)}
                      data-state={isDeleted ? "download" : "delete"}
                      title={
                        isDeleted
                          ? t("downloadDataset", {
                              language: t(language).toString(),
                            }).toString()
                          : t("deleteDataset", {
                              language: t(language).toString(),
                            }).toString()
                      }
                      value={language}
                    >
                      {isDeleted ? (
                        <ArrowDown
                          style={{ margin: "1px 2px" }}
                          className='Icon'
                          width={14}
                          height={14}
                        />
                      ) : (
                        <Xmark className='Icon' width={18} height={18} />
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

export const FullIslandLoading = () => {
  return (
    <div className='IslandAndButton' style={{ marginRight: 0 }}>
      <Loading className='' height='10rem' radius='40px' />
    </div>
  )
}
