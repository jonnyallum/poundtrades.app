import pg from 'pg';

async function polishListings() {
    const client = new pg.Client({
        user: 'postgres.otwslrepaneebmlttkwu',
        host: 'aws-0-eu-west-2.pooler.supabase.com',
        database: 'postgres',
        password: 'Theonlywayisup69!',
        port: 6543,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Polishing listings...');

        // Set default location to London (example) for all of Roger's listings
        // And ensure they all have a category
        await client.query(`
            UPDATE public.listings 
            SET location_lat = 51.5074, 
                location_lng = -0.1278,
                category = COALESCE(category, 'Building Materials')
            WHERE seller_id = (SELECT id FROM public.profiles WHERE full_name = 'Roger Holman' LIMIT 1);
        `);

        console.log('Listings polished with default location.');
    } finally {
        await client.end();
    }
}

polishListings();
