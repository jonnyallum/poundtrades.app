import pg from 'pg';

async function checkExtension() {
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
        const res = await client.query("SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';");
        if (res.rows.length === 0) {
            console.log('uuid-ossp extension is MISSING. Enabling it...');
            await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
            console.log('Extension enabled.');
        } else {
            console.log('uuid-ossp extension already exists.');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkExtension();
