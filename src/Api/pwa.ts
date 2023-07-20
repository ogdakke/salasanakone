declare module "virtual:pwa-register/react" {
    import type { Dispatch, SetStateAction } from "react";

    export interface RegisterSWOptions {
        immediate?: boolean;
        onNeedRefresh?: () => void;
        onOfflineReady?: () => void;
        /**
         * Called only if `onRegisteredSW` is not provided.
         *
         * @deprecated Use `onRegisteredSW` instead.
         * @param registration The service worker registration if available.
         */
        onRegistered?: (
            registration: ServiceWorkerRegistration | undefined,
        ) => void;
        /**
         * Called once the service worker is registered (requires version `0.12.8+`).
         *
         * @param swScriptUrl The service worker script url.
         * @param registration The service worker registration if available.
         */
        onRegisteredSW?: (
            swScriptUrl: string,
            registration: ServiceWorkerRegistration | undefined,
        ) => void;
        onRegisterError?: (error: unknown) => void;
    }

    export function useRegisterSW(options?: RegisterSWOptions): {
        needRefresh: [boolean, Dispatch<SetStateAction<boolean>>];
        offlineReady: [boolean, Dispatch<SetStateAction<boolean>>];
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
    };
}
