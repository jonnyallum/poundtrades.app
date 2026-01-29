import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://otwslrepaneebmlttkwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d3NscmVwYW5lZWJtbHR0a3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTI1NDMsImV4cCI6MjA2NzkyODU0M30.Rm5fzbSt9H7Vl0f00eiFEzP252IS5lQ_MmmxjaGYsvA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('full_name', 'Roger Holman')
            .single();

        if (profileError || !profile) {
            console.error('Could not find Roger Holman:', profileError?.message);
            return;
        }
        const rogerId = profile.id;

        // Clean up partials
        console.log('Cleaning up old listings...');
        await supabase.from('listings').delete().eq('seller_id', rogerId);

        const files = fs.readdirSync(photosDir).filter(f => f.endsWith('.jpg')).sort();
        console.log(`Found ${files.length} files.`);

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i];
            const itemIndex = i + 1;
            const filePath = path.join(photosDir, fileName);
            const fileBuffer = fs.readFileSync(filePath);

            const storagePath = `listing_${itemIndex}_${fileName}`;
            const { data: storageData, error: uploadError } = await supabase.storage
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

            const { error: insertError } = await supabase
                .from('listings')
                .insert({
                    seller_id: rogerId,
                    title: itemInfo.title,
                    description: itemInfo.description,
                    price_pounds: itemInfo.price,
                    status: 'active',
                    image_url: imageUrl,
                    category: 'Building Materials'
                });

            if (insertError) {
                console.error(`Insert failed for ${itemInfo.title}:`, insertError.message);
            } else {
                console.log(`Successfully created: ${itemInfo.title}`);
            }
        }
        console.log('Finished uploading all listings.');
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

uploadListings();
