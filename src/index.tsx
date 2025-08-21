import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // This imports the CSS file you showed
import App from './App'

// TODO: Uncomment when Amplify is configured
// import { Amplify } from 'aws-amplify'
// import awsconfig from './aws-exports'
// Amplify.configure(awsconfig)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
