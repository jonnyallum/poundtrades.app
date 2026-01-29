import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otwslrepaneebmlttkwu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // I should probably check if I have this or use anon key if allowed

// I'll try with anon key first, but usually upload needs authenticated/service role
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d3NscmVwYW5lZWJtbHR0a3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTI1NDMsImV4cCI6MjA2NzkyODU0M30.Rm5fzbSt9H7Vl0f00eiFEzP252IS5lQ_MmmxjaGYsvA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBuckets() {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('Error listing buckets:', error.message);
    } else {
        console.log('Buckets:', data.map(b => b.name));
    }
}

checkBuckets();
