import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);

    const { data, error } = await supabase.from('listings').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Connection failed:', error.message);
        if (error.message.includes('relation "listings" does not exist')) {
            console.log('HINT: The table "listings" exists but might not be in the public schema or RLS is blocking access.');
        }
    } else {
        console.log('Successfully connected to Supabase!');
        console.log('Listings count:', data || 0);
    }
}

testConnection();
