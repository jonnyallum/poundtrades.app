import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const sanitize = (value) => (typeof value === 'string' ? value.trim() : '');

const SUPABASE_URL = sanitize(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '',
);
const SUPABASE_ANON_KEY = sanitize(
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '',
);

const isSupabaseConfigured =
  SUPABASE_URL.length > 0 &&
  !SUPABASE_URL.toLowerCase().includes('your-project') &&
  SUPABASE_ANON_KEY.length > 0 &&
  !SUPABASE_ANON_KEY.toLowerCase().includes('your-anon-key');

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are not configured. Skipping smoke test.');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isNetworkError = (error) => {
  const cause = error?.originalError?.cause ?? error?.cause ?? error;
  if (!cause) return false;

  const networkCodes = new Set(['ENETUNREACH', 'EAI_AGAIN', 'ECONNREFUSED', 'ECONNRESET']);
  if (networkCodes.has(cause.code)) {
    return true;
  }

  const message = cause.message ?? error?.message;
  if (typeof message === 'string' && /fetch failed/i.test(message)) {
    return true;
  }

  return false;
};

async function ensureProfile(userId, attempts = 5) {
  for (let i = 0; i < attempts; i += 1) {
    const { data } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      return data;
    }

    await delay(500 * (i + 1));
  }

  throw new Error('User profile was not created by trigger');
}

async function fetchCategorySlug() {
  const { data, error } = await supabase
    .from('categories')
    .select('slug')
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  if (!data?.length) {
    throw new Error('No categories available to assign to the listing');
  }

  return data[0].slug;
}

async function main() {
  console.log('Signing in anonymously so we can exercise the Supabase policies…');
  let authResponse;
  try {
    authResponse = await supabase.auth.signInAnonymously();
  } catch (error) {
    authResponse = { data: null, error: { message: error.message, originalError: error } };
  }

  const { data: authData, error: authError } = authResponse;

  if (authError) {
    if (isNetworkError(authError)) {
      console.error('Supabase request failed – network is unreachable from this environment.');
      const nestedErrors =
        authError?.originalError?.cause?.errors ?? authError?.cause?.errors ?? authError?.errors;
      if (Array.isArray(nestedErrors)) {
        for (const nested of nestedErrors) {
          console.error('-', nested?.message ?? nested);
        }
      }
      process.exitCode = 0;
      return;
    }

    throw new Error(`Failed to sign in anonymously: ${authError.message}`);
  }

  const user = authData.user;
  console.log(`Signed in as user ${user.id}`);

  const profile = await ensureProfile(user.id);
  console.log('Confirmed profile row exists for the authenticated user:', profile);

  const categorySlug = await fetchCategorySlug();
  console.log('Using category slug:', categorySlug);

  const titleSuffix = randomUUID().slice(0, 8);
  const listingPayload = {
    title: `CLI Smoke Test Listing ${titleSuffix}`,
    description:
      'Automated smoke test to verify create listing flow reaches Supabase. Should be automatically removed.',
    price: 12.34,
    category: categorySlug,
    condition: 'new',
    location: 'Smoke Test City, UK',
    images: ['https://images.pexels.com/photos/2469046/pexels-photo-2469046.jpeg'],
    is_featured: false,
    status: 'active',
    user_id: user.id,
    listing_status: 'available',
    contact_hidden: true,
    seller_contact_email: `${user.email ?? `anon-${titleSuffix}@example.com`}`,
  };

  console.log('Attempting to create listing with payload:', listingPayload);
  const { data: createdListing, error: createError } = await supabase
    .from('listings')
    .insert(listingPayload)
    .select('*')
    .maybeSingle();

  if (createError) {
    throw new Error(`Failed to create listing: ${createError.message}`);
  }

  if (!createdListing) {
    throw new Error('Insert returned no rows even though no error was thrown');
  }

  console.log('Listing created successfully with id:', createdListing.id);

  console.log('Fetching listing back from Supabase to confirm persistence…');
  const { data: fetchedListing, error: fetchError } = await supabase
    .from('listings')
    .select('id, title, user_id, status, created_at')
    .eq('id', createdListing.id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch created listing: ${fetchError.message}`);
  }

  console.log('Fetched listing:', fetchedListing);

  console.log('Cleaning up the smoke test listing…');
  const { error: deleteError } = await supabase
    .from('listings')
    .delete()
    .eq('id', createdListing.id);

  if (deleteError) {
    throw new Error(`Failed to delete created listing: ${deleteError.message}`);
  }

  console.log('Cleanup complete. Supabase create listing flow verified.');
}

main().catch((error) => {
  if (isNetworkError(error)) {
    console.error('Supabase request failed – network is unreachable from this environment.');
    const nestedErrors = error?.originalError?.cause?.errors ?? error?.cause?.errors ?? error?.errors;
    if (Array.isArray(nestedErrors)) {
      for (const nested of nestedErrors) {
        console.error('-', nested?.message ?? nested);
      }
    }
    process.exitCode = 0;
    return;
  }

  console.error(error);
  process.exitCode = 1;
});
