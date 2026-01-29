import pg from 'pg';

async function checkTypes() {
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
        const res = await client.query("SELECT typname FROM pg_type WHERE typname IN ('user_role', 'listing_status');");
        console.log('Types found:');
        res.rows.forEach(row => console.log(` - ${row.typname}`));
    } finally {
        await client.end();
    }
}

checkTypes();
