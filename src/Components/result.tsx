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
import useEventListener from "@/common/hooks/useEventListener"
import { t } from "@/common/utils"
import { numbers, specials } from "@/config"
import copyToClipboard from "@/services/copyToClipboard"
import { FormActionKind } from "@/services/reducers/formReducer"
import "@/styles/Result.css"
import { Transition, motion } from "framer-motion"
import { Check, ClipboardCheck, EditPencil, OpenSelectHandGesture } from "iconoir-react"
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

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

export const InputContext = createContext<InputContextProps>({
  setInputValue: () => undefined,
})

const Result = () => {
  const {
    generate,
    formState: { isEditing, formValues },
  } = useContext(FormContext)

  const {
    finalPassword: { passwordValue },
    setFinalPassword,
  } = useContext(ResultContext)

  const { dispatch } = useContext(FormDispatchContext)

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
    dispatch({ type: FormActionKind.SET_EDITING, payload: true })
    setEditor(EditorState.EDITOR)
  }

  function changeToResult() {
    dispatch({ type: FormActionKind.SET_EDITING, payload: false })
    setEditor(EditorState.RESULT)
  }

  useEffect(() => {
    const hideCopyIcon = () => setConditions((s) => ({ ...s, copyIconIsHidden: true }))
    const hiderTimeout = setTimeout(hideCopyIcon, 3000)

    return () => clearTimeout(hiderTimeout)
  }, [conditions.copyIconIsHidden])

  useEffect(() => {
    changeToResult()
  }, [formValues, passwordValue])

  useEffect(() => {
    setConditions({ isCopied: false, copyIconShouldAnimate: false, copyIconIsHidden: true })
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
  const documentRef = useRef<Document>(document)

  function handleKeyPress(e: KeyboardEvent) {
    if (!isEditing && e.ctrlKey && e.key === "e") {
      return handleEditClick()
    }
    if (e.ctrlKey && e.key === "Enter") {
      return void generate()
    }
  }

  useEventListener("keypress", handleKeyPress, documentRef)

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
      iconTooltip: (string | JSX.Element)[]
      component: ReactNode
    }
  >([
    [
      EditorState.RESULT,
      {
        iconTooltip: showEditComponents ? t("editResult") : t("hasCopiedPassword"),
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
              <TooltipContent sideOffset={4} className="TooltipContent">
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

  return (
    <motion.div
      // TODO: fix this role stuff and just make this a button
      role="button"
      transition={{ duration: 0.175 }}
      initial={{ scale: 1 }}
      title={t("clickToCopyOrEdit").toString()}
      className="card interact resultCard relative"
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
  const { setInputValue } = useContext(InputContext)
  const { passwordValue } = useContext(ResultContext).finalPassword

  const handleFocusingInput = useCallback(() => {
    document.getElementById("resultInput")?.focus()
    return () => {}
  }, [])

  return (
    <motion.div
      title={t("clickToCopyOrEdit").toString()}
      className="card interact resultCard relative"
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

const EditButton = ({ handleEditClick }: EditButtonProps) => {
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
  return (
    <motion.span
      layout
      aria-hidden={!isCopied}
      aria-label={t("hasCopiedPassword").toString()}
      className="Shine absoluteCopiedIcon interact"
      data-animate={copyIconShouldAnimate ? true : false}
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
