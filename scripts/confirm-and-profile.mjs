import pg from 'pg';

async function confirmUserFinal() {
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

        console.log('Confirming user...');
        await client.query(`
            UPDATE auth.users 
            SET email_confirmed_at = NOW(), 
                last_sign_in_at = NOW() 
            WHERE email = 'roger@poundtrades.co.uk';
        `);

        console.log('Checking profile...');
        const res = await client.query("SELECT * FROM public.profiles WHERE full_name = 'Roger Holman'");
        if (res.rows.length > 0) {
            console.log('Profile exists:', res.rows[0].id);
        } else {
            console.log('Profile DOES NOT exist. Creating manually...');
            const userRes = await client.query("SELECT id FROM auth.users WHERE email = 'roger@poundtrades.co.uk'");
            if (userRes.rows.length > 0) {
                const userId = userRes.rows[0].id;
                await client.query(`
                    INSERT INTO public.profiles (id, full_name, role)
                    VALUES ($1, 'Roger Holman', 'admin'::user_role)
                `, [userId]);
                console.log('Profile created manually.');
            }
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

confirmUserFinal();
