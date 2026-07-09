/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional read-only Delivery API key for loading project content types in the browser. */
  readonly VITE_DELIVERY_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
