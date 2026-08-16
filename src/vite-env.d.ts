/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_AUTH_API_URL?: string;
  readonly VITE_DATA_API_URL?: string;
  readonly VITE_NOTIFICATION_POLL_INTERVAL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
