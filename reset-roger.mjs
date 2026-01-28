import pg from 'pg';

async function resetAndCreateRoger() {
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

        console.log('Deleting existing Roger...');
        await client.query("DELETE FROM auth.users WHERE email = 'roger@poundtrades.co.uk'");

        // Profiles will be deleted automatically due to CASCADE if they existed, 
        // but they probably didn't.

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

resetAndCreateRoger();
