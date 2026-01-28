import pg from 'pg';

async function checkDbFinal() {
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

        console.log('--- Tables ---');
        const tables = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        tables.rows.forEach(r => console.log(r.table_name));

        console.log('\n--- Profiles Columns ---');
        const cols = await client.query("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'profiles'");
        cols.rows.forEach(r => console.log(`${r.column_name}: ${r.data_type} (${r.udt_name})`));

        console.log('\n--- Types ---');
        const types = await client.query("SELECT typname FROM pg_type WHERE typname IN ('user_role', 'listing_status')");
        types.rows.forEach(r => console.log(r.typname));

    } finally {
        await client.end();
    }
}

checkDbFinal();
