declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_APP_ENV?: string;
    readonly EXPO_PUBLIC_SUPABASE_URL?: string;
    readonly EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
    readonly EXPO_PUBLIC_STRIPE_FUNCTION_NAME?: string;
    readonly EXPO_PUBLIC_STRIPE_FUNCTION_URL?: string;
    readonly EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
    readonly EXPO_PUBLIC_MAPBOX_TOKEN?: string;
    readonly SUPABASE_URL?: string;
    readonly SUPABASE_ANON_KEY?: string;
    readonly STRIPE_FUNCTION_NAME?: string;
    readonly STRIPE_FUNCTION_URL?: string;
    readonly STRIPE_PUBLISHABLE_KEY?: string;
    readonly MAPBOX_API_KEY?: string;
    readonly APP_ENV?: string;
  }
}
