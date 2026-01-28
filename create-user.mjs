import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otwslrepaneebmlttkwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d3NscmVwYW5lZWJtbHR0a3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTI1NDMsImV4cCI6MjA2NzkyODU0M30.Rm5fzbSt9H7Vl0f00eiFEzP252IS5lQ_MmmxjaGYsvA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUser() {
    const { data, error } = await supabase.auth.signUp({
        email: 'roger@poundtrades.co.uk',
        password: 'Theonlywayisup69!',
        options: {
            data: {
                full_name: 'Roger Holman',
                role: 'admin'
            }
        }
    });

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('User created successfully:', data.user?.id);
        console.log('Please check roger@poundtrades.co.uk for a confirmation email.');
    }
}

createUser();
