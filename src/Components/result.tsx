import { InputComponent } from "@/Components/ui/input"
import { Loading } from "@/Components/ui/loading"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"
import { type HighlightCondition, Highlighter } from "@/Components/ui/utils/highlight"
import { Features } from "@/assets/constants/features"
import { useTranslation } from "@/common/hooks/useLanguage"
import { FormContext } from "@/common/providers/FormProvider"
import { ResultContext } from "@/common/providers/ResultProvider"
import { getConfig } from "@/config"
import type {
  CopiedButtonProps,
  CopyConditions,
  EditButtonProps,
  EditorProps,
  InputContextProps,
  ResultNoEditProps,
} from "@/models"
import { Language } from "@/models/translations"
import copyToClipboard from "@/services/copyToClipboard"
import "@/styles/Result.css"
import { type Transition, motion } from "framer-motion"
import { Check, ClipboardCheck, EditPencil, OpenSelectHandGesture } from "iconoir-react"
import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react"

enum EditorState {
  EDITOR = "editor",
  RESULT = "result",
}

const fade: Transition = {
  type: "spring",
  damping: 10,
  bounce: 0.1,
  opacity: { type: "tween" },
  filter: { type: "tween" },
  scale: { duration: 0.2 },
}

const highlightNumbers: HighlightCondition = {
  condition: getConfig(Language.fi).generationStrings.numbers,
  style: {
    fontWeight: "bold",
    color: "var(--emphasis)",
  },
}

const highlightSpecials: HighlightCondition = {
  condition: getConfig(Language.fi).generationStrings.specials,
  style: {
    fontWeight: "bold",
    opacity: "0.7",
  },
}

function handleFeature(feature: Features) {
  const prev = localStorage.getItem(feature) === "true"
  localStorage.setItem(feature, String(!prev))
}

const InputContext = createContext<InputContextProps>({
  setInputValue: () => undefined,
})

const Result = () => {
  const { t } = useTranslation()

  const { formState } = useContext(FormContext)
  const { isEditing, formValues } = formState

  const {
    finalPassword: { passwordValue },
    setFinalPassword,
  } = useContext(ResultContext)

  const [inputValue, setInputValue] = useState<string | undefined>(undefined)
  const [conditions, setConditions] = useState<CopyConditions>({
    isCopied: false,
    copyIconShouldAnimate: false,
    copyIconIsHidden: true,
  })

  const [editor, setEditor] = useState<EditorState>(EditorState.RESULT)

  const showEditComponents = !isEditing && conditions.copyIconIsHidden

  const copy = () => {
    setConditions((s) => ({ ...s, copyIconShouldAnimate: true }))
    const time = setTimeout(
      () => setConditions((s) => ({ ...s, copyIconShouldAnimate: false })),
      700,
    )
    setConditions((s) => ({ ...s, isCopied: true, copyIconIsHidden: false }))
    return () => clearTimeout(time)
  }

  const handleCopyClick = async (word: string) => {
    await copyToClipboard(word)
    copy()
  }

  function changeToEditor() {
    formState.isEditing = true
    setEditor(EditorState.EDITOR)
  }

  function changeToResult() {
    formState.isEditing = false
    setEditor(EditorState.RESULT)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const hideCopyIcon = () => setConditions((s) => ({ ...s, copyIconIsHidden: true }))
    const hiderTimeout = setTimeout(hideCopyIcon, 3000)

    return () => clearTimeout(hiderTimeout)
  }, [conditions.copyIconIsHidden])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    changeToResult()
  }, [formValues, passwordValue])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setConditions({
      isCopied: false,
      copyIconShouldAnimate: false,
      copyIconIsHidden: true,
    })
  }, [passwordValue])

  const highlightConditions = [highlightNumbers, highlightSpecials]

  const handleEditClick = () => {
    changeToEditor()
  }

  const handleSave = (value?: string) => {
    if (!value || value.trim().length < 1) {
      return
    }
    if (value.substring(0, 3) === Features.Prefix) {
      handleFeature(value.substring(3, value.length) as Features)
    }

    setInputValue(value)
    changeToResult()
    setFinalPassword({ passwordValue: value, isEdited: true })
  }

  /** Early return for loading state */
  if (passwordValue === undefined) {
    return (
      <div className="resultWrapper">
        <div className="flex space-between">
          <Loading height="1.1875rem" width="7.5rem" radius="0.5rem" />
          <Loading height="1.1875rem" width="1.5rem" radius="0.5rem" />
        </div>
        <Loading height="68px" radius="12px" />
      </div>
    )
  }

  const resultOptions = new Map<
    EditorState,
    {
      icon: ReactNode
      iconTooltip: (string | ReactNode)[]
      component: ReactNode
    }
  >([
    [
      EditorState.RESULT,
      {
        iconTooltip: t("editResult"),
        icon: !showEditComponents ? (
          <CopiedButton conditions={conditions} handleCopyClick={handleCopyClick} />
        ) : (
          <EditButton handleEditClick={handleEditClick} />
        ),
        component: (
          <ResultComponentNoEdit
            key={EditorState.RESULT}
            handleCopyClick={handleCopyClick}
            highlightConditions={highlightConditions}
            finalPassword={passwordValue}
            conditions={conditions}
          />
        ),
      },
    ],
    [
      EditorState.EDITOR,
      {
        iconTooltip: t("saveResult"),
        icon: <SaveEditButton key={EditorState.EDITOR} handleSave={handleSave} />,
        component: <Editor key={EditorState.EDITOR} handleSave={handleSave} />,
      },
    ],
  ])

  return (
    <InputContext.Provider value={{ inputValue, setInputValue }}>
      <div className="resultWrapper blurFadeIn">
        <div className="flex space-between">
          <label className="resultHelperText">{t("clickToCopyOrEdit")}</label>
          <span aria-label={t("length").toString()} className="resultHelperText pr-025">
            {isEditing ? inputValue?.length : passwordValue.length ?? "-"}
          </span>
        </div>
        <div className="relative">
          {resultOptions.get(editor)?.component}
          <TooltipProvider delayDuration={600}>
            <Tooltip>
              <TooltipTrigger type="button" asChild>
                <span className="absolute resultButtonWrapper">
                  {resultOptions.get(editor)?.icon}
                </span>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={4}
                className={
                  editor === EditorState.EDITOR || showEditComponents
                    ? "TooltipContent"
                    : "invisible"
                }
              >
                <div className="flex-center">
                  <OpenSelectHandGesture width={20} height={20} />
                  {resultOptions.get(editor)?.iconTooltip}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </InputContext.Provider>
  )
}

/**
 * Result component
 */
const ResultComponentNoEdit = ({
  handleCopyClick,
  finalPassword,
  highlightConditions,
  conditions,
}: ResultNoEditProps) => {
  const { isCopied } = conditions
  const { t } = useTranslation()

  return (
    <motion.div
      // TODO: fix this role stuff and just make this a button
      role="button"
      transition={{ duration: 0.175 }}
      initial={{ scale: 1 }}
      title={t("clickToCopyOrEdit").toString()}
      className="ResultButton interact resultCard relative"
      itemType="button"
      tabIndex={0}
      onClick={() => void handleCopyClick(finalPassword)}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === "Space") {
          void handleCopyClick(finalPassword)
        }
      }}
    >
      <span>
        <span className={isCopied ? "copiedSpanText" : "notCopiedSpan"}>
          {finalPassword.length !== 0 ? (
            <Highlighter text={finalPassword} highlightConditions={highlightConditions} />
          ) : (
            t("errorNoGeneration")
          )}
        </span>
      </span>
    </motion.div>
  )
}

/**
 * Editor component
 */
const Editor = ({ handleSave }: EditorProps) => {
  const { t } = useTranslation()
  const { setInputValue } = useContext(InputContext)
  const { passwordValue } = useContext(ResultContext).finalPassword
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocusingInput = () => {
    inputRef.current?.focus()
  }

  return (
    <motion.div
      title={t("clickToCopyOrEdit").toString()}
      className="ResultButton interact resultCard relative"
      itemType="button"
      tabIndex={0}
      onClick={handleFocusingInput}
    >
      <InputComponent
        ref={inputRef}
        className="ResultInput"
        placeholder={t("resultInputPlaceholder").toString()}
        defaultValue={passwordValue}
        minLength={1}
        maxLength={128}
        onFocus={(e) => {
          setInputValue(e.target.value)
        }}
        onBlur={(e) => handleSave(e.target.value)}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSave(e.currentTarget.value)
          }
        }}
        autoFocus
      />
    </motion.div>
  )
}

const EditButton = ({ handleEditClick }: EditButtonProps) => {
  const { t } = useTranslation()
  return (
    <motion.span
      className="Shine absoluteCopiedIcon EditButton interact"
      aria-label={t("editResultDesc").toString()}
      data-animate={true}
      onClick={() => handleEditClick()}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          handleEditClick()
        }
      }}
      initial={{
        scale: 0.4,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={fade}
    >
      <EditPencil alignmentBaseline="central" className="flex-center" />
    </motion.span>
  )
}

const CopiedButton = ({ conditions, handleCopyClick }: CopiedButtonProps) => {
  const passwordValue = useContext(ResultContext).finalPassword.passwordValue ?? ""
  const { isCopied, copyIconShouldAnimate } = conditions
  const { t } = useTranslation()
  return (
    <motion.span
      layout
      aria-hidden={!isCopied}
      aria-label={t("hasCopiedPassword").toString()}
      className="Shine absoluteCopiedIcon interact"
      data-animate={!!copyIconShouldAnimate}
      initial={{ scale: 0.4 }}
      animate={{
        opacity: isCopied ? 1 : 0,
        scale: copyIconShouldAnimate ? 0.95 : 1,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={fade}
      onClick={() => void handleCopyClick(passwordValue)}
    >
      <ClipboardCheck alignmentBaseline="central" className="flex-center" />
    </motion.span>
  )
}

const SaveEditButton = ({ handleSave }: EditorProps) => {
  const { t } = useTranslation()
  const { inputValue } = useContext(InputContext)

  return (
    <motion.span
      className="Shine absoluteCopiedIcon EditButton interact"
      aria-label={t("saveAndCheckString").toString()}
      data-animate={true}
      onClick={() => handleSave(inputValue)}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          handleSave(inputValue)
        }
      }}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={fade}
    >
      <Check alignmentBaseline="central" className="flex-center" />
    </motion.span>
  )
}

export default Result
