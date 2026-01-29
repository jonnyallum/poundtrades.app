import pg from 'pg';

async function addImageUrl() {
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
        console.log('Connected.');

        await client.query(`
            ALTER TABLE public.listings 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `);

        console.log('Column image_url added.');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

addImageUrl();
