'use client' // if using Next.js 13 app directory
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ConfirmPage() {
  const [account, setAccount] = useState(null)
  const [message, setMessage] = useState('Checking your confirmation...')

  useEffect(() => {
    async function handleConfirmation() {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        setMessage('Error fetching session: ' + error.message)
        return
      }

      if (!session?.user) {
        setMessage('No logged-in user found. Please log in first.')
        return
      }

      const userId = session.user.id

      // Call backend API to create account
      const res = await fetch('/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      const result = await res.json()

      if (result.success) {
        setAccount(result.account)
        setMessage('Your bank account has been created successfully!')
      } else {
        setMessage('Error creating account: ' + result.error)
      }
    }

    handleConfirmation()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Email Confirmation</h1>
      <p>{message}</p>
      {account && (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
          <p><strong>Account Number:</strong> {account.account_number}</p>
          <p><strong>Type:</strong> {account.account_type}</p>
          <p><strong>Balance:</strong> ${account.balance}</p>
        </div>
      )}
    </div>
  )
}
