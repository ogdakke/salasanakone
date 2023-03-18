import React, { useEffect, useState } from "react"
import { Suspense } from "react"
import { FormType } from "./form"

const checker = async (password: string) => {
  const check = await import("../Api/checkStrength").then((r) => r.checkStrength)
  return (await check(password.toString()))
}
export default function Strength (props: {password: string}) {
    

  const [score, setScore] = useState(Number)
  const [time, setTime] = useState("")

  useEffect(() => {
    checker(props.password).then(r => {
      const time = r.crack_times_display.online_no_throttling_10_per_second.toString()
      
      setScore(r.score)
      setTime(time)
      return;
    })
    
  }, [props.password])
  

  return (
    <>
    <Suspense>
      <div>
        <p>
        {score}
        </p>
        <p>
        {time}
        </p>
      </div>
    </Suspense>
    </>
  )
}