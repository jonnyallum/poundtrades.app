iimport pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function populateListings() {
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

        // Get Roger's ID
        const userRes = await client.query("SELECT id FROM profiles WHERE full_name = 'Roger Holman' LIMIT 1;");
        if (userRes.rows.length === 0) {
            console.error('Roger Holman not found in profiles.');
            return;
        }
        const rogerId = userRes.rows[0].id;
        console.log(`Found Roger's ID: ${rogerId}`);

        const listings = [
            { title: 'Zinc nails', description: 'Zinc nails per bag', price: 5, category: 'Hardware' },
            { title: 'Wall ties', description: 'Wall ties', price: 5, category: 'Building Materials' },
            { title: 'Mastic', description: 'Mastic tube', price: 2, category: 'Building Materials' },
            { title: 'Extractor fan', description: 'Extractor fan in box', price: 15, category: 'Electrical' },
            { title: 'Various Timber', description: 'Various Timber per length', price: 3, category: 'Timber' },
            { title: '18mm shuttering ply', description: '18mm shuttering ply sheet', price: 15, category: 'Timber' },
            { title: 'Various Timber (Ref 27)', description: 'Various Timber from £3 per length', price: 3, category: 'Timber' },
            { title: 'Wall ties (Large)', description: 'Wall ties in box', price: 10, category: 'Building Materials' }
        ];

        console.log('Inserting listings...');
        for (const item of listings) {
            await client.query(
                `INSERT INTO listings (seller_id, title, description, price_pounds, category, status) 
                 VALUES ($1, $2, $3, $4, $5, 'active')`,
                [rogerId, item.title, item.description, item.price, item.category]
            );
            console.log(`Inserted: ${item.title}`);
        }

        console.log('All listings populated successfully.');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

populateListings();
