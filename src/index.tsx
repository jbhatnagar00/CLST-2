import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'

// Debug: Check what's in the config
console.log('Amplify config:', outputs)
console.log('Auth config:', outputs.auth)

// Configure Amplify - it handles token storage automatically
Amplify.configure(outputs)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
