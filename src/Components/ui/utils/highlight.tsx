import { CSSProperties } from "react"

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

  // Process each highlight condition
  highlightConditions.forEach(({ condition, style }) => {
    // Convert the condition string into an array for iteration
    const conditionChars = condition.split("")
    // Apply the style to all characters that match the condition
    conditionChars.forEach((char) => {
      stylesForCharacters[char] = style
    })
  })

  // Split the text into an array of individual characters
  const characters = text.split("")

  return (
    <span>
      {characters.map((char, index) =>
        // Apply the style if there is one for this character
        stylesForCharacters[char] ? (
          <span key={index} style={stylesForCharacters[char]}>
            {char}
          </span>
        ) : (
          char
        ),
      )}
    </span>
  )
}
