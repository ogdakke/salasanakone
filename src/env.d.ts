/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_X_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
