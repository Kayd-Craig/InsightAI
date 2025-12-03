'use client'

import { useState } from 'react'
import { subscriptionService } from '@/lib/subscriptionService'

export default function SubscriptionTest() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testSubscription = async () => {
    setLoading(true)
    try {
      const { isSubscribed, subscription } = await subscriptionService.checkSubscription()
      setResult(`Subscribed: ${isSubscribed}\nSubscription: ${JSON.stringify(subscription, null, 2)}`)
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Subscription Test</h3>
      <button
        onClick={testSubscription}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Subscription Check'}
      </button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  )
}