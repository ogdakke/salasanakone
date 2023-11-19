import { ReactNode, createContext } from "react"

export const ThemeContext = createContext<"dark" | "light" | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const darkMode = window.matchMedia("prefers-color-scheme: dark").matches

  const currentTheme = darkMode ? "dark" : "light"
  return <ThemeContext.Provider value={currentTheme}>{children}</ThemeContext.Provider>
}

