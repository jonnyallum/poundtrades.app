type StripeSafeHook = {
  initPaymentSheet: (...args: unknown[]) => Promise<{ error?: undefined }>;
  presentPaymentSheet: (...args: unknown[]) => Promise<{ error?: undefined }>;
  isPlatformSupported: boolean;
};

const warnUnsupported = () => {
  console.warn('Stripe payment sheet is not supported on web. The unlock action will be skipped.');
};

const noop = async () => {
  warnUnsupported();
  return { error: undefined } as const;
};

export const useStripeSafe = (): StripeSafeHook => ({
  initPaymentSheet: noop,
  presentPaymentSheet: noop,
  isPlatformSupported: false,
});
