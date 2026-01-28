import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://otwslrepaneebmlttkwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d3NscmVwYW5lZWJtbHR0a3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTI1NDMsImV4cCI6MjA2NzkyODU0M30.Rm5fzbSt9H7Vl0f00eiFEzP252IS5lQ_MmmxjaGYsvA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const pgClient = new pg.Client({
    user: 'postgres.otwslrepaneebmlttkwu',
    host: 'aws-0-eu-west-2.pooler.supabase.com',
    database: 'postgres',
    password: 'Theonlywayisup69!',
    port: 6543,
    ssl: {
        rejectUnauthorized: false
    }
});

const photosDir = 'c:\\Users\\jonny\\Poundtrades.app-antigravity\\Poundtrades-Extracted\\Poundtrades';

const itemsData = {
    21: { title: 'Zinc nails', price: 5, description: 'Zinc nails per bag' },
    22: { title: 'Wall ties', price: 5, description: 'Wall ties' },
    23: { title: 'Mastic', price: 2, description: 'Mastic tube' },
    24: { title: 'Extractor fan', price: 15, description: 'Extractor fan in box' },
    25: { title: 'Various Timber', price: 3, description: 'Various Timber from £3 per length' },
    26: { title: '18mm shuttering ply', price: 15, description: '18mm shuttering ply sheet' },
    27: { title: 'Various Timber (Ref 27)', price: 3, description: 'Various Timber from £3 per length' },
    28: { title: 'Wall ties (Large)', price: 10, description: 'Wall ties in box' }
};

async function uploadListings() {
    try {
        await pgClient.connect();
        console.log('Connected to DB.');

        // Get Roger's ID via PG
        const profileRes = await pgClient.query("SELECT id FROM public.profiles WHERE full_name = 'Roger Holman' LIMIT 1");
        if (profileRes.rows.length === 0) {
            console.error('Roger Holman not found.');
            return;
        }
        const rogerId = profileRes.rows[0].id;

        // Clean up
        await pgClient.query("DELETE FROM public.listings WHERE seller_id = $1", [rogerId]);

        const files = fs.readdirSync(photosDir).filter(f => f.endsWith('.jpg')).sort();
        console.log(`Found ${files.length} files.`);

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i];
            const itemIndex = i + 1;
            const filePath = path.join(photosDir, fileName);
            const fileBuffer = fs.readFileSync(filePath);

            const storagePath = `listing_${itemIndex}_${fileName}`;
            console.log(`Uploading image ${itemIndex}/${files.length}...`);

            const { error: uploadError } = await supabase.storage
                .from('listings')
                .upload(storagePath, fileBuffer, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (uploadError) {
                console.error(`Upload failed for ${fileName}:`, uploadError.message);
                continue;
            }

            const imageUrl = `${supabaseUrl}/storage/v1/object/public/listings/${storagePath}`;

            const itemInfo = itemsData[itemIndex] || {
                title: `Building Material Item ${itemIndex}`,
                price: 10,
                description: 'High quality building material cleared from site.'
            };

            await pgClient.query(
                `INSERT INTO public.listings (seller_id, title, description, price_pounds, category, status, image_url) 
                 VALUES ($1, $2, $3, $4, $5, 'active', $6)`,
                [rogerId, itemInfo.title, itemInfo.description, itemInfo.price, 'Building Materials', imageUrl]
            );
            console.log(`Created listing: ${itemInfo.title}`);
        }
        console.log('Finished uploading all listings.');
    } catch (err) {
        console.error('Unexpected error:', err.message);
    } finally {
        await pgClient.end();
    }
}

uploadListings();
