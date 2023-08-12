import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App"

// import { DataFunc } from "./Api/data"

export const createCrypto = import("./Api/createCrypto")
  .then((res) => {
    return res.createCryptoKey
  })
  .catch((err) => {
    console.error(err, "Failed to import script")
    throw err
  })

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
