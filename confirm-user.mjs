import pg from 'pg';

async function confirmUser() {
    const client = new pg.Client({
        user: 'postgres.otwslrepaneebmlttkwu',
        host: 'aws-0-eu-west-2.pooler.supabase.com',
        database: 'postgres',
        password: '[Theonlywayisup69!]',
        port: 6543,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to database...');
        await client.connect();

        console.log('Confirming user roger@poundtrades.co.uk...');
        const res = await client.query(`
            UPDATE auth.users 
            SET email_confirmed_at = NOW(), 
                confirmed_at = NOW(), 
                last_sign_in_at = NOW() 
            WHERE email = 'roger@poundtrades.co.uk'
            RETURNING id;
        `);

        if (res.rowCount > 0) {
            console.log('User confirmed successfully. User ID:', res.rows[0].id);
        } else {
            console.log('User not found.');
        }

    } catch (err) {
        console.error('Operation failed:', err.message);
    } finally {
        await client.end();
    }
}

confirmUser();
