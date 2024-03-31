import type { CSSProperties } from "react"

export interface HighlightCondition {
  condition: string
  style: React.CSSProperties
}

interface HighlightProps {
  text: string
  highlightConditions: HighlightCondition[]
}

export const Highlighter = ({ text, highlightConditions }: HighlightProps) => {
  // Create an object to hold styles for each character in the text
  const stylesForCharacters: Record<string, CSSProperties> = {}
  const textArr = text.split("")

  for (const { condition, style } of highlightConditions) {
    const conditionChars = condition.split("")
    for (const char of conditionChars) {
      stylesForCharacters[char] = style
    }
  }

  // Split the text into an array of individual characters
  const characters = text.split("")

  return (
    <span>
      {characters.map((char, index) => (
        // Apply the style if there is one for this character
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <span key={char + index} style={stylesForCharacters[char]}>
          {char}
        </span>
      ))}
    </span>
  )
}
