import Stripe from 'stripe'
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
})

let stripePromise: Promise<StripeJS | null>
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export const STRIPE_CONFIG = {
  plans: {
    basic: {
      priceId: 'price_1SQgQiG2CYoG7mpFesq874LF', // Replace with your actual Price ID
      name: 'Basic Plan',
      price: 999, // $9.99 in cents
      features: [
        'Connect up to 2 social accounts',
        'Basic analytics dashboard',
        'AI insights and recommendations',
        'Email support',
      ],
    },
    pro: {
      priceId: 'price_1SQCbnG2CYoG7mpF53o7dbTk', // Replace with your actual Price ID
      name: 'Pro Plan',
      price: 1999, // $19.99 in cents
      features: [
        'Connect unlimited social accounts',
        'Advanced analytics dashboard',
        'Premium AI insights',
        'Custom reporting',
        'Priority support',
        'API access',
      ],
    },
  },
}

export type PlanType = keyof typeof STRIPE_CONFIG.plans
