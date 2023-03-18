import React, { Suspense, useEffect, useState } from "react";

const checker = async (password: string) => {
  const check = await import("../Api/checkStrength").then((r) => r.checkStrength)
  return (await check(password.toString()))
}

export function StrengthIndicator(props: { password: string; sliderValue: number | null; }): JSX.Element {  

  const [score, setScore] = useState(Number)
  const [output, setOutput] = useState("")
  const [time, setTime] = useState("")

  useEffect(() => {
    // kikkailua, jotta ei tarvis laskea aina scorea.
    if (props.sliderValue === null) {
      setScore(4)
      setOutput(numberToString(4))
    } else {
      checker(props.password).then(r => {
        const rtime = r.crack_times_display.offline_slow_hashing_1e4_per_second.toString()
        
        setScore(r.score)
        setTime(rtime)
        setOutput(numberToString(r.score))
        return;
      })
    }
  }, [props.password])
  

  return (
  <div className="strengthWrapper">
    <Suspense fallback={
      <div className="strengthIndicator"><span>Arvio</span></div>
    }>
      <div className={`strengthIndicator case${score.toString()}`}
        >
        <span>
        {output}  
        </span>
      </div>
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