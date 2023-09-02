import store from "@/store"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"

export const createCrypto = import("./services/createCrypto")
  .then((res) => {
    return res.createCryptoKey
  })
  .catch((err) => {
    console.error(err, "Failed to import script")
    throw err
  })

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
