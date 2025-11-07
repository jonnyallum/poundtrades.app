import { useStripe } from '@stripe/stripe-react-native';
import type { useStripe as useStripeType } from '@stripe/stripe-react-native';

type StripeHook = ReturnType<typeof useStripeType>;

type StripeSafeHook = {
  initPaymentSheet: StripeHook['initPaymentSheet'];
  presentPaymentSheet: StripeHook['presentPaymentSheet'];
  isPlatformSupported: boolean;
};

export const useStripeSafe = (): StripeSafeHook => {
  const stripe = useStripe();

  return {
    initPaymentSheet: stripe.initPaymentSheet,
    presentPaymentSheet: stripe.presentPaymentSheet,
    isPlatformSupported: true,
  };
};
