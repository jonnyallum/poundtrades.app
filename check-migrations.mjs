import pg from 'pg';

async function checkMigrations() {
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
        const res = await client.query('SELECT version FROM supabase_migrations.schema_migrations;');
        console.log('Applied migrations:');
        res.rows.forEach(row => console.log(` - ${row.version}`));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkMigrations();
