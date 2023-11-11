import { ReactNode, createContext, useEffect, useState } from "react"

export const ThemeContext = createContext<"dark" | "light" | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)")
  const initialTheme: "dark" | "light" = darkModeQuery.matches ? "dark" : "light"

  const [currentTheme, setcurrentTheme] = useState<"dark" | "light">(initialTheme)

  function handleThemechange(event: MediaQueryListEvent) {
    event.matches && currentTheme !== "dark" ? setcurrentTheme("dark") : setcurrentTheme("light")
  }

  useEffect(() => {
    darkModeQuery.addEventListener("change", (ev) => handleThemechange(ev))

    return () => darkModeQuery.removeEventListener("change", (ev) => handleThemechange(ev))
  }, [handleThemechange])

  return <ThemeContext.Provider value={currentTheme}>{children}</ThemeContext.Provider>
}

