import pg from 'pg';

async function createBucket() {
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

        console.log('Creating listings bucket...');
        // Inserting into storage.buckets
        await client.query(`
            INSERT INTO storage.buckets (id, name, public)
            VALUES ('listings', 'listings', true)
            ON CONFLICT (id) DO NOTHING;
        `);

        // Setup RLS for storage
        await client.query(`
            CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'listings');
            CREATE POLICY "Full Access" ON storage.objects FOR ALL USING (bucket_id = 'listings') WITH CHECK (bucket_id = 'listings');
        `);

        console.log('Bucket created or verified.');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

createBucket();
