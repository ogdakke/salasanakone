// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_VERSION: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
