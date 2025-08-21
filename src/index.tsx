import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { sessionStorage } from 'aws-amplify/utils'
import outputs from '../amplify_outputs.json'

// Configure token persistence with cookies for better persistence
cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage)

// Configure Amplify with Gen 2 outputs
Amplify.configure(outputs, {
  ssr: false // Disable SSR for client-side app
})

console.log('Amplify configured with outputs:', outputs)

// Test configuration immediately
import { fetchAuthSession } from 'aws-amplify/auth'
fetchAuthSession()
  .then(session => {
    console.log('Initial session check:', {
      hasTokens: !!session.tokens,
      hasCredentials: !!session.credentials
    })
  })
  .catch(err => console.log('Initial session error:', err))

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
