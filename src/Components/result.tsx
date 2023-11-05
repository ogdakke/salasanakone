import { FormContext, FormDispatchContext, ResultContext } from "@/Components/FormContext"
import {
  HighlightCondition,
  Highlighter,
  InputComponent,
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
import { createContext, useContext, useEffect, useState } from "react"

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

  const [isCopied, setCopied] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [editor, setEditor] = useState<EditorState>(EditorState.RESULT)

  const showEditComponents = !isEditing && !isCopied

  const copy = () => {
    setShouldAnimate(true)
    setTimeout(() => setShouldAnimate(false), 700)
    setCopied(true)
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
    setShouldAnimate(false)
    setCopied(false)
  }, [passwordValue])

  const highlightConditions = [highlightNumbers, highlightSpecials]

  const handleEditClick = () => {
    changeToEditor()
    focus()
  }

  const handleSave = (value?: string) => {
    if (!value || value.length < 1) {
      return
    }

    setInputValue(value)
    changeToResult()
    setFinalPassword({ passwordValue: value, isEdited: true })
    console.log("saved", value)
  }

  const resultOptions = {
    [EditorState.RESULT]: (
      <ResultComponentNoEdit
        handleCopyClick={handleCopyClick}
        highlightConditions={highlightConditions}
        isCopied
        finalPassword={passwordValue}
      />
    ),
    [EditorState.EDITOR]: <Editor handleSave={handleSave} />,
  }

  const resultIconOptions = {
    [EditorState.EDITOR]: <SaveEditButton handleSave={handleSave} />,
    [EditorState.RESULT]: !showEditComponents ? (
      <CopiedButton
        shouldAnimate={shouldAnimate}
        isCopied={isCopied}
        handleCopyClick={handleCopyClick}
      />
    ) : (
      <EditButton handleCopyClick={handleEditClick} />
    ),
  }

  const tooltipContentOptions = {
    [EditorState.EDITOR]: t("saveResult"),
    [EditorState.RESULT]: showEditComponents ? t("editResult") : t("hasCopiedPassword"),
  }

  return (
    <InputContext.Provider value={{ inputValue, setInputValue }}>
      <div className="resultWrapper">
        <p className="resultHelperText">{t("clickToCopy")}</p>
        {passwordValue && passwordValue?.length > 0 ? (
          <div className="relative">
            {resultOptions[editor]}
            <TooltipProvider delayDuration={600}>
              <Tooltip>
                <TooltipTrigger type="button" asChild>
                  <span className="absolute resultButtonWrapper">{resultIconOptions[editor]}</span>
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
        ) : (
          <div className="card">{t("errorNoGeneration")}</div>
        )}
      </div>
    </InputContext.Provider>
  )
}

type EditButtonProps = {
  handleCopyClick: () => void
}

const EditButton = ({ handleCopyClick }: EditButtonProps) => {
  return (
    <motion.span
      className="Shine absoluteCopiedIcon EditButton interact"
      onClick={() => handleCopyClick()}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleCopyClick()
        }
      }}
      initial={{
        translateX: 30,
        filter: "blur(4px)",
        opacity: 0,
      }}
      animate={{
        translateX: 0,
        filter: "blur(0px)",
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
      initial={{
        scale: 1,
        filter: "blur(4px)",
      }}
      animate={{
        filter: isCopied ? "blur(0px)" : "blur(4px)",
        translateX: isCopied ? 0 : 20,
        opacity: isCopied ? 1 : 0,
        scale: shouldAnimate ? 0.95 : 1,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={fade}
      onClick={() => void handleCopyClick(passwordValue).catch(console.error)}
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
  if (!finalPassword) {
    throw new Error(t("errorNoGeneration").toString())
  }

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
      title={t("clickToCopy").toString()}
      className="card interact resultCard relative"
      itemType="button"
      tabIndex={0}
      onClick={() => void handleCopyClick(finalPassword).catch(console.error)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          void handleCopyClick(finalPassword).catch(console.error)
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
      title={t("clickToCopy").toString()}
      className="card interact resultCard relative"
      itemType="button"
      tabIndex={0}
    >
      <InputComponent
        className="ResultInput"
        placeholder={t("resultInputPlaceholder").toString()}
        defaultValue={passwordValue}
        onKeyDown={(e) => {
          ;() => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return setInputValue(e.target.value)
          }
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
        translateX: 30,
        filter: "blur(4px)",
        opacity: 0,
      }}
      animate={{
        translateX: 0,
        filter: "blur(0px)",
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
