// Supabase Edge Function for creating Stripe payment intents
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Stripe } from 'https://esm.sh/stripe@12.0.0?target=deno';

// Initialize Stripe with the secret key from environment variables
const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(secretKey, {
  httpClient: Stripe.createFetchHttpClient(),
});

// Handle HTTP requests
serve(async (req) => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }

    // Parse the request body
    const { amount, currency = 'gbp', description, customer_email } = await req.json();

    if (!amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: amount' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Create or retrieve a customer
    let customer;
    if (customer_email) {
      // Check if customer already exists
      const customers = await stripe.customers.list({
        email: customer_email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customer = customers.data[0].id;
      } else {
        // Create a new customer
        const newCustomer = await stripe.customers.create({
          email: customer_email,
        });
        customer = newCustomer.id;
      }
    }

    // Create ephemeral key for the customer
    let ephemeralKey;
    if (customer) {
      ephemeralKey = await stripe.ephemeralKeys.create(
        { customer },
        { apiVersion: '2023-10-16' }
      );
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer || undefined,
      description,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the payment details
    return new Response(
      JSON.stringify({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey?.secret,
        customer,
        publishableKey: Deno.env.get('STRIPE_PUBLIC_KEY'),
      }),
      { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Handle errors
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});