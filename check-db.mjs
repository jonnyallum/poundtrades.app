import pg from 'pg';

async function checkDatabase() {
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
        console.log('Connected to database.');

        console.log('Fetching tables in public schema...');
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);

        console.log('Tables found:');
        res.rows.forEach(row => console.log(` - ${row.table_name}`));

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkDatabase();
