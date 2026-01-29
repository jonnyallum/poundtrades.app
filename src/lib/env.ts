const normalize = (value?: string | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const containsPlaceholder = (value: string): boolean => {
  const lowered = value.toLowerCase();
  return lowered.includes('your-') || lowered.includes('example');
};

const supabaseUrlRaw = normalize(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? null,
);
const supabaseAnonKeyRaw = normalize(
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? null,
);
const mapboxTokenRaw = normalize(
  process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? process.env.MAPBOX_API_KEY ?? null,
);
const stripePublishableKeyRaw = normalize(
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? process.env.STRIPE_PUBLISHABLE_KEY ?? null,
);
const stripeFunctionNameRaw = normalize(
  process.env.EXPO_PUBLIC_STRIPE_FUNCTION_NAME ?? process.env.STRIPE_FUNCTION_NAME ?? 'create-payment-intent',
);
const stripeFunctionUrlOverride = normalize(
  process.env.EXPO_PUBLIC_STRIPE_FUNCTION_URL ?? process.env.STRIPE_FUNCTION_URL ?? null,
);
const appEnvRaw = normalize(process.env.EXPO_PUBLIC_APP_ENV ?? process.env.APP_ENV ?? null);

const isSupabaseConfigured = Boolean(
  supabaseUrlRaw &&
    supabaseAnonKeyRaw &&
    !containsPlaceholder(supabaseUrlRaw) &&
    !containsPlaceholder(supabaseAnonKeyRaw),
);

const isMapboxConfigured = Boolean(mapboxTokenRaw && !containsPlaceholder(mapboxTokenRaw));
const isStripeConfigured = Boolean(
  stripePublishableKeyRaw &&
    !containsPlaceholder(stripePublishableKeyRaw) &&
    (stripeFunctionUrlOverride || (isSupabaseConfigured && stripeFunctionNameRaw)),
);

const resolvedStripeFunctionUrl = stripeFunctionUrlOverride
  ? stripeFunctionUrlOverride
  : isSupabaseConfigured && stripeFunctionNameRaw
    ? `${supabaseUrlRaw}/functions/v1/${stripeFunctionNameRaw}`
    : undefined;

export const env = {
  appEnv: appEnvRaw ?? 'development',
  supabaseUrl: isSupabaseConfigured ? supabaseUrlRaw : undefined,
  supabaseAnonKey: isSupabaseConfigured ? supabaseAnonKeyRaw : undefined,
  isSupabaseConfigured,
  mapboxToken: isMapboxConfigured ? mapboxTokenRaw : undefined,
  isMapboxConfigured,
  stripePublishableKey: isStripeConfigured ? stripePublishableKeyRaw : undefined,
  stripeFunctionName: stripeFunctionNameRaw,
  stripeFunctionUrl: resolvedStripeFunctionUrl,
  isStripeConfigured,
} as const;

export type AppEnv = typeof env;
