import pg from 'pg';
import fs from 'fs';

async function runSchema() {
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
        console.log('Connected.');

        const schema = fs.readFileSync('supabase/migrations/20260128000000_initial_schema.sql', 'utf8');

        console.log('Executing schema-v2.sql logic manually...');
        // We'll run it in a single query block
        await client.query(schema);

        console.log('Schema executed successfully.');

    } catch (err) {
        console.error('Execution Error:', err.message);
        if (err.detail) console.error('Detail:', err.detail);
    } finally {
        await client.end();
    }
}

runSchema();
