UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    last_sign_in_at = NOW() 
WHERE email = 'roger@poundtrades.co.uk';
