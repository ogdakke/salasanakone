import { useState } from "react";

export default function useString(str: string) {
  const [finalPassword, setFinalPassword] = useState("") 
  const changeString = setFinalPassword(str)

  return {finalPassword, changeString}
}