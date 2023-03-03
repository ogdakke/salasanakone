import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// const myWorker = new Worker("./Api/worker.ts", {type: "module"})

// myWorker.postMessage({scriptUrl: "./sanat.js"})

// myWorker.addEventListener("message", ({data}) => {
//   console.log("parsed data");
// })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
