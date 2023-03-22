import { Suspense, useEffect, useState } from "react";
import { FormType } from "./form";

const checker = async (password: string) => {
  // const then = performance.now()
  const check = await import("../Api/checkStrength").then((r) => r.checkStrength)
  // const now = performance.now()
  // console.log("🚀 ~ file: indicator.tsx:8 ~ checker ~ now:", now-then, "ms")
  
  return (await check(password.toString()))
}

export function StrengthIndicator(props: { formValues: FormType; password: string; sliderValue: number; }): JSX.Element {  
  const {formValues, password, sliderValue} = props;
  
  function validateString(): boolean {
    if (!formValues.words && sliderValue > 15) {
      // a rndm string needs not be checked if its longer than 15
      return false
    } else if (formValues.words && sliderValue > 3) {
      return false
    }
    return true
  }

  const [score, setScore] = useState(Number)
  const [output, setOutput] = useState("")

  useEffect(() => {
      checker(password).then(r => {
        // console.log("🚀 ~ file: indicator.tsx:25 ~ checker ~ password:", password)
        setScore(r.score)
        setOutput(numberToString(r.score))
      })
    return ;
  }, [])

  useEffect(() => {
    // kikkailua, jotta ei tarvis laskea aina scorea, koska se on kallista.
    if (validateString() === false) {
      setScore(4)
      setOutput(numberToString(4))
      return;
    } else {
      checker(password).then(r => {
            
        setScore(r.score)
        setOutput(numberToString(score))
        return;
      }) 
    }
  }, [score, password])
  

  return (
  <div className="strengthWrapper">
    <Suspense fallback={<div className="strengthIndicator case5"><span>Arvio</span></div>}>
      <div className={`strengthIndicator case${score.toString()}`}>
        <span>
        {output}  
        </span>
      </div>
      {/* <div className="strengthIndicator case5"><span>Arvio</span></div> */}
    </Suspense>
  </div>
  )
}

function numberToString(value: number) {
  switch(value) {
    case 0:
      return "Surkea";
    case 1:
      return "Huono";
    case 2:
      return "Ok";
    case 3:
      return "Hyvä";
    case 4:
      return "Loistava";
    default:
      return "Arvio";
  }
}