import { FormContext, FormDispatchContext, ResultContext } from "@/Components/FormContext"
import {
  HighlightCondition,
  Highlighter,
  InputComponent,
  Loading,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui"
import { t } from "@/common/utils"
import { numbers, specials } from "@/config"
import copyToClipboard from "@/services/copyToClipboard"
import { FormActionKind } from "@/services/reducers/formReducer"
import "@/styles/Result.css"
import { Transition, motion } from "framer-motion"
import { Check, ClipboardCheck, EditPencil, OpenSelectHandGesture } from "iconoir-react"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"

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
  condition: numbers,
  style: {
    fontWeight: "bold",
    color: "var(--emphasis)",
  },
}

const highlightSpecials: HighlightCondition = {
  condition: specials,
  style: {
    fontWeight: "bold",
    opacity: "0.7",
  },
}

type InputContextProps = {
  inputValue?: string
  setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const InputContext = createContext<InputContextProps>({
  setInputValue: () => undefined,
})

const Result = () => {
  const {
    formState: { isEditing, formValues },
  } = useContext(FormContext)

  const {
    finalPassword: { passwordValue },
    setFinalPassword,
  } = useContext(ResultContext)

  const { dispatch } = useContext(FormDispatchContext)

  const [inputValue, setInputValue] = useState<string | undefined>(undefined)
  const [conditions, setConditions] = useState({
    isCopied: false,
    shouldAnimate: false,
  })

  const [editor, setEditor] = useState<EditorState>(EditorState.RESULT)

  const showEditComponents = !isEditing && !conditions.isCopied

  const copy = () => {
    setConditions((s) => ({ ...s, shouldAnimate: true }))
    const time = setTimeout(() => setConditions((s) => ({ ...s, shouldAnimate: false })), 700)
    setConditions((s) => ({ ...s, isCopied: true }))
    clearTimeout(time)
  }

  const handleCopyClick = async (word: string) => {
    await copyToClipboard(word)
    copy()
  }

  function changeToEditor() {
    dispatch({ type: FormActionKind.SET_EDITING, payload: true })
    setEditor(EditorState.EDITOR)
  }

  function changeToResult() {
    dispatch({ type: FormActionKind.SET_EDITING, payload: false })
    setEditor(EditorState.RESULT)
  }

  useEffect(() => {
    changeToResult()
  }, [formValues, passwordValue])

  useEffect(() => {
    setConditions({ isCopied: false, shouldAnimate: false })
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

  window.addEventListener("keypress", (ev) => {
    if (!isEditing && ev.ctrlKey && ev.key === "e") {
      handleEditClick()
      return
    }
  })

  const resultOptions = {
    [EditorState.RESULT]: (
      <ResultComponentNoEdit
        handleCopyClick={handleCopyClick}
        highlightConditions={highlightConditions}
        finalPassword={passwordValue}
        isCopied
      />
    ),
    [EditorState.EDITOR]: <Editor handleSave={handleSave} />,
  }

  const resultIconOptions = new Map<EditorState, ReactNode>()

  resultIconOptions.set(EditorState.EDITOR, <SaveEditButton handleSave={handleSave} />)
  resultIconOptions.set(
    EditorState.RESULT,
    !showEditComponents ? (
      <CopiedButton
        shouldAnimate={conditions.shouldAnimate}
        isCopied={conditions.isCopied}
        handleCopyClick={handleCopyClick}
      />
    ) : (
      <EditButton handleEditClick={handleEditClick} />
    ),
  )

  const tooltipContentOptions = {
    [EditorState.EDITOR]: t("saveResult"),
    [EditorState.RESULT]: showEditComponents ? t("editResult") : t("hasCopiedPassword"),
  }

  if (passwordValue === undefined) {
    return (
      <div className="resultWrapper">
        <Loading height="1.3125rem" width="20%" radius="8px" />
        <Loading height="68px" radius="12px" />
      </div>
    )
  }

  return (
    <InputContext.Provider value={{ inputValue, setInputValue }}>
      <div className="resultWrapper">
        <p className="resultHelperText">{t("clickToCopyOrEdit")}</p>
        <div className="relative">
          {resultOptions[editor]}
          <TooltipProvider delayDuration={600}>
            <Tooltip>
              <TooltipTrigger type="button" asChild>
                <span className="absolute resultButtonWrapper">
                  {resultIconOptions.get(editor)}
                </span>
              </TooltipTrigger>
              <TooltipContent sideOffset={4} className="TooltipContent">
                <div className="flex-center">
                  <OpenSelectHandGesture width={20} height={20} />
                  {tooltipContentOptions[editor]}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </InputContext.Provider>
  )
}

type EditButtonProps = {
  handleEditClick: () => void
}

const EditButton = ({ handleEditClick }: EditButtonProps) => {
  return (
    <motion.span
      className="Shine absoluteCopiedIcon EditButton interact"
      onClick={() => handleEditClick()}
      onKeyDown={(e) => {
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

type CopiedButtonProps = {
  shouldAnimate: boolean
  isCopied: boolean
  handleCopyClick: (finalPassword: string) => Promise<void>
}

const CopiedButton = ({ shouldAnimate, isCopied, handleCopyClick }: CopiedButtonProps) => {
  const passwordValue = useContext(ResultContext).finalPassword.passwordValue ?? ""

  return (
    <motion.span
      layout
      aria-hidden={!isCopied}
      className="Shine absoluteCopiedIcon interact"
      data-animate={shouldAnimate ? true : false}
      initial={{ scale: 0.4 }}
      animate={{
        opacity: isCopied ? 1 : 0,
        scale: shouldAnimate ? 0.95 : 1,
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

/**
 * Editor
 */
type ResultNoEditProps = {
  handleCopyClick: (finalPassword: string) => Promise<void>
  finalPassword?: string
  highlightConditions: HighlightCondition[]
  isCopied: boolean
}

const ResultComponentNoEdit = ({
  handleCopyClick,
  finalPassword,
  highlightConditions,
  isCopied,
}: ResultNoEditProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.175 }}
      animate={{ scale: 1 }}
      whileTap={{
        scale: 0.985,
        transition: {
          duration: 0.25,
        },
      }}
      initial={{ scale: 1 }}
      title={t("clickToCopyOrEdit").toString()}
      className="card interact resultCard relative"
      itemType="button"
      tabIndex={0}
      onClick={() => void handleCopyClick(finalPassword)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
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
 * Editor
 */
type EditorProps = {
  handleSave: (stringToSave?: string) => void
}

const Editor = ({ handleSave }: EditorProps) => {
  const { setInputValue } = useContext(InputContext)
  const { passwordValue } = useContext(ResultContext).finalPassword

  return (
    <motion.div
      transition={{ duration: 0.175 }}
      animate={{ scale: 1 }}
      whileTap={{
        scale: 0.985,
        transition: {
          duration: 0.25,
        },
      }}
      initial={{ scale: 1 }}
      title={t("clickToCopyOrEdit").toString()}
      className="card interact resultCard relative"
      itemType="button"
      tabIndex={0}
    >
      <InputComponent
        className="ResultInput"
        placeholder={t("resultInputPlaceholder").toString()}
        defaultValue={passwordValue}
        onFocus={(e) => {
          setInputValue(e.target.value)
        }}
        onChange={(e) => {
          setInputValue(e.target.value)
        }}
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

const SaveEditButton = ({ handleSave }: EditorProps) => {
  const { inputValue } = useContext(InputContext)

  return (
    <motion.span
      className="Shine absoluteCopiedIcon EditButton interact"
      onClick={() => handleSave(inputValue)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSave(inputValue)
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
      <Check alignmentBaseline="central" className="flex-center" />
    </motion.span>
  )
}

export default Result

