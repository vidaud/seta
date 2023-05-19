/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_DISABLE_LOGGER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
