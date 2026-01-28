import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://otwslrepaneebmlttkwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d3NscmVwYW5lZWJtbHR0a3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTI1NDMsImV4cCI6MjA2NzkyODU0M30.Rm5fzbSt9H7Vl0f00eiFEzP252IS5lQ_MmmxjaGYsvA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpload() {
    const filePath = 'c:\\Users\\jonny\\Poundtrades.app-antigravity\\Poundtrades-Extracted\\Poundtrades\\IMG-20250428-WA0017.jpg';
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
        .from('listings')
        .upload('test.jpg', fileBuffer, {
            contentType: 'image/jpeg',
            upsert: true
        });

    if (error) {
        console.error('Upload Error:', error.message);
    } else {
        console.log('Upload Success:', data.path);
    }
}

testUpload();
