
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

async function handlePaymentSuccess(paymentIntent) {
  try {
    const { accountId, userId, description } = paymentIntent.metadata;
    const amount = paymentIntent.amount / 100; // Convert from cents

    // Update transaction status
    const { error: updateError } = await supabaseAdmin
      .from('transactions')
      .update({ status: 'completed' })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (updateError) {
      console.error('Error updating transaction status:', updateError);
      return;
    }

    // Update account balance
    const { data: account, error: accountError } = await supabaseAdmin
      .from('accounts')
      .select('balance')
      .eq('id', accountId)
      .single();

    if (accountError) {
      console.error('Error fetching account:', accountError);
      return;
    }

    const newBalance = parseFloat(account.balance || 0) + amount;

    const { error: balanceError } = await supabaseAdmin
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId);

    if (balanceError) {
      console.error('Error updating account balance:', balanceError);
      return;
    }

    console.log(`Payment successful: $${amount} deposited to account ${accountId}`);

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    // Update transaction status to failed
    const { error: updateError } = await supabaseAdmin
      .from('transactions')
      .update({ status: 'failed' })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (updateError) {
      console.error('Error updating failed transaction:', updateError);
    }

    console.log(`Payment failed for intent: ${paymentIntent.id}`);

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
