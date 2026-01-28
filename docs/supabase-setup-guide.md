# Supabase Setup Guide for PoundTrades

This guide walks through setting up Supabase for the PoundTrades mobile app.

## 1. Create a Supabase Project

1. Sign up or log in at [supabase.com](https://supabase.com)
2. Create a new project with a name like "poundtrades"
3. Choose a strong database password and save it securely
4. Select a region closest to your users (e.g., London for UK users)
5. Wait for your project to be created (usually takes 1-2 minutes)

## 2. Get Your API Keys

Once your project is created, you'll need two important values:

1. **Project URL**: Found in the Project Settings > API section
2. **anon/public** key: Also found in Project Settings > API

These values will be used in your `.env` file:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 3. Set Up Database Schema

The PoundTrades app requires several tables and relationships. You can set these up using the SQL editor in Supabase:

1. Go to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase/schema.sql` from this repository
4. Run the query to create all tables, policies, and functions

## 4. Seed Initial Data (Optional)

To populate your database with test data:

1. Go to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase/seed.sql` from this repository
4. Run the query to insert sample data

## 5. Set Up Storage Buckets

PoundTrades uses Supabase Storage for image uploads:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `listings`
3. Set the bucket's privacy to "Public"
4. Create another bucket called `avatars` with "Public" access

## 6. Configure Authentication

PoundTrades uses email/password authentication:

1. Go to Authentication > Settings in your Supabase dashboard
2. Under "Email Auth", ensure it's enabled
3. Configure Site URL to your app's URL (for production) or localhost for development
4. Optionally, customize email templates for confirmation, magic links, etc.

## 7. Set Up Row Level Security (RLS)

The schema.sql file already includes RLS policies, but verify they're active:

1. Go to Database > Tables in your Supabase dashboard
2. For each table, check that "RLS is enabled" appears
3. Click on "Policies" to review the access rules

## 8. Configure the Mobile App

1. Copy `.env.example` to `.env` in your project root
2. Update with your Supabase URL and anon key
3. Install dependencies with `npm install`
4. Start the app with `npm start`

## 9. Testing the Connection

To verify your Supabase connection is working:

1. Run the app in development mode
2. Try to sign up a new user
3. Check the Authentication > Users section in Supabase to see if the user was created
4. Try creating a listing and check if it appears in the Database > Tables > listings table

## 10. Troubleshooting

Common issues and solutions:

- **Authentication errors**: Check that your Supabase URL and anon key are correct
- **CORS errors**: Ensure your app's domain is added to the allowed origins in Supabase
- **RLS blocking access**: Review your policies to ensure they allow the intended operations
- **Storage upload failures**: Check bucket permissions and ensure the user is authenticated

## 11. Deployment Considerations

When deploying to production:

1. Create a separate Supabase project for production
2. Set up proper environment variables for each environment
3. Consider enabling additional security features like MFA
4. Set up monitoring and backups for your database

## 12. Useful Supabase Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)