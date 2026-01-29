import pg from 'pg';

async function cleanupAndSchema() {
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

        console.log('Renaming old tables...');
        await client.query(`
            DO $$ 
            BEGIN
                IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'listings' AND table_schema = 'public') THEN
                    ALTER TABLE public.listings RENAME TO listings_old;
                END IF;
                IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories' AND table_schema = 'public') THEN
                    ALTER TABLE public.categories RENAME TO categories_old;
                END IF;
                IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments' AND table_schema = 'public') THEN
                    ALTER TABLE public.payments RENAME TO payments_old;
                END IF;
            END $$;
        `);

        console.log('Running Premium Schema...');
        const fs = await import('fs');
        const schema = fs.readFileSync('supabase/migrations/20260128000000_initial_schema.sql', 'utf8');
        await client.query(schema);

        console.log('Schema applied successfully.');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

cleanupAndSchema();
