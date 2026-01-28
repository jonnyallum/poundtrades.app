export type StripeSafeHook = {
  initPaymentSheet: (...args: unknown[]) => Promise<{ error?: unknown }>;
  presentPaymentSheet: (...args: unknown[]) => Promise<{ error?: unknown }>;
  isPlatformSupported: boolean;
};

export declare function useStripeSafe(): StripeSafeHook;
