export {};

declare global {
  interface Window {
    dcfDesktop?: {
      getIdentity: () => Promise<{ fullName: string; email: string } | null>;
      saveIdentity: (identity: { fullName: string; email: string }) => Promise<boolean>;
      getBackendUrl: () => Promise<string>;
    };
  }
}
