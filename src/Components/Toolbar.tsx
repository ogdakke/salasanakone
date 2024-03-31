import BottomContainer from "@/Components/ui/bottomContainer"
import "@/styles/Toolbar.css"
import { useState } from "react"

const isDev = import.meta.env.DEV

export default function Toolbar({ visible }: { visible?: boolean }) {
  const [isVisible, setVisible] = useState<boolean>(isDev ? true : !!visible)

  return (
    <BottomContainer visible={isVisible}>
      <div className="ToolbarContainer">
        <button type="button">Hello</button>
      </div>
    </BottomContainer>
  )
}
