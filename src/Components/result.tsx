import {
  type HighlightCondition,
  Highlighter,
  InputComponent,
  Loading,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui"
import { FormContext } from "@/common/providers/FormProvider"
import { ResultContext } from "@/common/providers/ResultProvider"
import { useTranslation } from "@/common/utils/getLanguage"
import { getConfig } from "@/config"
import { Language } from "@/models/translations"
import copyToClipboard from "@/services/copyToClipboard"
import "@/styles/Result.css"
import { type Transition, m } from "framer-motion"
import { Check, ClipboardCheck, EditPencil, OpenSelectHandGesture } from "iconoir-react"
import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

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

type CopyConditions = {
  isCopied: boolean
  copyIconShouldAnimate: boolean
  copyIconIsHidden: boolean
}

type EditorProps = {
  handleSave: (stringToSave?: string) => void
}

type ResultNoEditProps = {
  handleCopyClick: (finalPassword: string) => Promise<void>
  finalPassword: string
  highlightConditions: HighlightCondition[]
  conditions: CopyConditions
}

type CopiedButtonProps = {
  conditions: CopyConditions
  handleCopyClick: (finalPassword: string) => Promise<void>
}

type EditButtonProps = {
  handleEditClick: () => void
}

type InputContextProps = {
  inputValue?: string
  setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>
}

const InputContext = createContext<InputContextProps>({
  setInputValue: () => undefined,
})

const Result = () => {
  const { t } = useTranslation()

  const { generate, formState } = useContext(FormContext)
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
    setInputValue(value)
    changeToResult()
    setFinalPassword({ passwordValue: value, isEdited: true })
  }

  /** Early return for loading state */
  if (passwordValue === undefined) {
    return (
      <div className="resultWrapper">
        <div className="flex space-between">
          <Loading height="1.0625rem" width="7.5rem" radius="0.5rem" />
          <Loading height="1.0625rem" width="1.5rem" radius="0.5rem" />
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
    <m.div
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
    </m.div>
  )
}

/**
 * Editor component
 */
const Editor = ({ handleSave }: EditorProps) => {
  const { t } = useTranslation()
  const { setInputValue } = useContext(InputContext)
  const { passwordValue } = useContext(ResultContext).finalPassword

  const handleFocusingInput = () => {
    document.getElementById("resultInput")?.focus()
    return () => {}
  }

  return (
    <m.div
      title={t("clickToCopyOrEdit").toString()}
      className="ResultButton interact resultCard relative"
      itemType="button"
      tabIndex={0}
      onClick={handleFocusingInput}
    >
      <InputComponent
        id="resultInput"
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
    </m.div>
  )
}

const EditButton = ({ handleEditClick }: EditButtonProps) => {
  const { t } = useTranslation()
  return (
    <m.span
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
    </m.span>
  )
}

const CopiedButton = ({ conditions, handleCopyClick }: CopiedButtonProps) => {
  const passwordValue = useContext(ResultContext).finalPassword.passwordValue ?? ""
  const { isCopied, copyIconShouldAnimate } = conditions
  const { t } = useTranslation()
  return (
    <m.span
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
    </m.span>
  )
}

const SaveEditButton = ({ handleSave }: EditorProps) => {
  const { t } = useTranslation()
  const { inputValue } = useContext(InputContext)

  return (
    <m.span
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
    </m.span>
  )
}

export default Result
