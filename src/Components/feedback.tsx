import { useState } from "react"
import { InputComponent } from "./ui/input"
import "../styles/ui/Feedback.css"
export const Feedback = () => {
  const [clicked, setClicked] = useState(false)
  const questionText = "Mitä mieltä olet sivusta?"
  if (clicked) {
    return (
      <>
      <div 
      // onClick={() => setClicked(!clicked)}
      >
        painettu
      </div>
    </>
  )
} else {
  return (
    <div >
      <form className="card" action="submit" method="post" style={{opacity: 1}}>
        <div className="flex-center">
        {questionText} 
        <InputComponent />
        <button type="submit" className="inputButton submitButton">Lähetä</button>
        </div>
      </form>
    </div>
  )
}
}