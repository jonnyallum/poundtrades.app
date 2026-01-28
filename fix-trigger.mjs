import pg from 'pg';

async function fixTrigger() {
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

        await client.query(`
            DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
            
            CREATE OR REPLACE FUNCTION public.handle_new_user()
            RETURNS TRIGGER AS $$
            BEGIN
              INSERT INTO public.profiles (id, full_name, role)
              VALUES (
                new.id, 
                new.raw_user_meta_data->>'full_name', 
                (COALESCE(new.raw_user_meta_data->>'role', 'private'))::user_role
              );
              RETURN new;
            EXCEPTION WHEN OTHERS THEN
              -- If it fails, still return new so the user creation doesn't fail
              RETURN new;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;

            CREATE TRIGGER on_auth_user_created
              AFTER INSERT ON auth.users
              FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `);

        console.log('Trigger updated with error handling.');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

fixTrigger();
