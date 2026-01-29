import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

export type GenericSupabaseClient = SupabaseClient<any, 'public', any>;

const createUnconfiguredClient = (): GenericSupabaseClient => {
  const message =
    'Supabase environment variables are not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable backend features.';

  const handler: ProxyHandler<object> = {
    get: (_, property) => {
      if (property === '__isSupabaseStub') {
        return true;
      }

      throw new Error(message);
    },
    apply: () => {
      throw new Error(message);
    },
  };

  return new Proxy(() => undefined, handler) as unknown as GenericSupabaseClient;
};

export const supabase: GenericSupabaseClient = env.isSupabaseConfigured
  ? createClient<any>(env.supabaseUrl!, env.supabaseAnonKey!)
  : createUnconfiguredClient();

export const isSupabaseConfigured = env.isSupabaseConfigured;

if (!env.isSupabaseConfigured) {
  console.warn(
    'Supabase client initialised with a stub implementation because configuration variables are missing. '
    + 'Define EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable data synchronisation.',
  );
}

interface ListingFilters {
  category?: string;
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

interface ListingPayload {
  [key: string]: unknown;
}

export const listingsService = {
  async getListings(filters: ListingFilters = {}) {
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          categories(name, description)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters.category && filters.category !== 'All') {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', filters.category)
          .maybeSingle();

        if (categoryData?.id) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (typeof filters.minPrice === 'number') {
        query = query.gte('price', filters.minPrice);
      }

      if (typeof filters.maxPrice === 'number') {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching listings:', error);
        return { data: [] as unknown[], error };
      }

      return { data: data ?? ([] as unknown[]), error: null };
    } catch (error) {
      console.error('Error in getListings:', error);
      return { data: [] as unknown[], error };
    }
  },

  async createListing(listingData: ListingPayload) {
    try {
      const { data, error } = await supabase.from('listings').insert([listingData]).select().maybeSingle();

      if (error) {
        console.error('Error creating listing:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in createListing:', error);
      return { data: null, error };
    }
  },

  async updateListing(id: string | number, updates: ListingPayload) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating listing:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in updateListing:', error);
      return { data: null, error };
    }
  },

  async deleteListing(id: string | number) {
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id);

      if (error) {
        console.error('Error deleting listing:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Error in deleteListing:', error);
      return { error };
    }
  },
};

export const categoriesService = {
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return { data: [] as unknown[], error };
      }

      return { data: data ?? ([] as unknown[]), error: null };
    } catch (error) {
      console.error('Error in getCategories:', error);
      return { data: [] as unknown[], error };
    }
  },
};

export const authService = {
  async signUp(email: string, password: string, userData: Record<string, unknown> = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error('Error signing up:', error);
        return { user: null, error };
      }

      return { user: data.user ?? null, error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { user: null, error };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        return { user: null, error };
      }

      return { user: data.user ?? null, error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { user: null, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error };
    }
  },

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error getting current user:', error);
        return { user: null, error };
      }

      return { user: user ?? null, error: null };
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return { user: null, error };
    }
  },

  onAuthStateChange(callback: Parameters<GenericSupabaseClient['auth']['onAuthStateChange']>[0]) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default supabase;
