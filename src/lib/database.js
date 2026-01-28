import { supabase } from './supabase';

/**
 * Fetch listings with optional filters
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of results
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.category - Filter by category
 * @param {string} options.search - Search term
 * @param {boolean} options.featured - Filter featured listings
 * @returns {Promise} - Listings query result
 */
export const getListings = async (options = {}) => {
  try {
    const {
      limit = 20,
      offset = 0,
      category,
      search,
      featured,
      userId,
    } = options;

    let query = supabase
      .from('listings')
      .select('*, users(name, avatar_url)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return { 
      success: true, 
      listings: data || [],
      count 
    };
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    return { 
      success: false, 
      error: error.message,
      listings: [] 
    };
  }
};

/**
 * Fetch a single listing by ID
 * @param {string} id - Listing ID
 * @returns {Promise} - Listing query result
 */
export const getListingById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*, users(name, avatar_url)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { 
      success: true, 
      listing: data 
    };
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Create a new listing
 * @param {Object} listingData - Listing data
 * @returns {Promise} - Create result
 */
export const createListing = async (listingData) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('listings')
      .insert({
        ...listingData,
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { 
      success: true, 
      listing: data 
    };
  } catch (error) {
    console.error('Error creating listing:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Update an existing listing
 * @param {string} id - Listing ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} - Update result
 */
export const updateListing = async (id, updates) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    // Check if user owns the listing
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!listing) throw new Error('Listing not found');
    if (listing.user_id !== user.id) throw new Error('Not authorized to update this listing');

    const { data, error } = await supabase
      .from('listings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { 
      success: true, 
      listing: data 
    };
  } catch (error) {
    console.error(`Error updating listing ${id}:`, error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Delete a listing
 * @param {string} id - Listing ID
 * @returns {Promise} - Delete result
 */
export const deleteListing = async (id) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    // Check if user owns the listing
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!listing) throw new Error('Listing not found');
    if (listing.user_id !== user.id) throw new Error('Not authorized to delete this listing');

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error(`Error deleting listing ${id}:`, error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Save a listing to user's favorites
 * @param {string} listingId - Listing ID
 * @returns {Promise} - Save result
 */
export const saveListing = async (listingId) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('saved_listings')
      .insert({
        user_id: user.id,
        listing_id: listingId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { 
      success: true, 
      saved: data 
    };
  } catch (error) {
    console.error(`Error saving listing ${listingId}:`, error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Remove a listing from user's favorites
 * @param {string} listingId - Listing ID
 * @returns {Promise} - Remove result
 */
export const unsaveListing = async (listingId) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('saved_listings')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listingId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error(`Error unsaving listing ${listingId}:`, error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Get user's saved listings
 * @returns {Promise} - Saved listings result
 */
export const getSavedListings = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('saved_listings')
      .select('listing_id, listings(*)')
      .eq('user_id', user.id);

    if (error) throw error;

    // Extract the listings from the joined data
    const listings = data.map(item => item.listings);

    return { 
      success: true, 
      listings 
    };
  } catch (error) {
    console.error('Error fetching saved listings:', error.message);
    return { 
      success: false, 
      error: error.message,
      listings: [] 
    };
  }
};

// Export all database functions
export default {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  saveListing,
  unsaveListing,
  getSavedListings,
};