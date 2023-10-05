/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_DISABLE_LOGGER: string
  readonly VITE_IDENTITY_PROVIDERS: string[]
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
