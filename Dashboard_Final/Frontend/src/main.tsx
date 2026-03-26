import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// Importing a real but small package that is not installed to trigger the healing installer
import isOdd from 'is-odd';

console.log(isOdd(3));

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
