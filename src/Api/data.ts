
const cookie = new Date().getTime().toString()

document.cookie = `key=${cookie}; Samesite=lax;`
// document.cookie = `${cookie}=${}; Samesite=lax;`

export const DataFunc = (event: React.SyntheticEvent<HTMLElement, Event>) => {
  console.log("🚀 ~ file: data.ts:8 ~ DataFunc ~ event:", event)
  const timerStart = new Date().getTime()
  

}