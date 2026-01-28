import pg from 'pg';

async function verify() {
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
        const res = await client.query('SELECT title, price_pounds, image_url FROM listings ORDER BY id DESC LIMIT 5;');
        console.log('Recent listings:');
        res.rows.forEach(r => {
            console.log(`- ${r.title}: £${r.price_pounds}`);
            console.log(`  URL: ${r.image_url}`);
        });
    } finally {
        await client.end();
    }
}

verify();
