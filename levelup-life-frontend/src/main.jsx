import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx' //imports the main App component that contains all other components

// Create a root for React to render into
// This is where the entire React application will be rendered
// The root element is the element with the ID of 'root' in the index.html file
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Wrap the App component with BrowserRouter for routing */}
    {/* Render the main App component */}
    <App />
    </BrowserRouter>
  </StrictMode>, //a tool for highlighting potential problems in an application
)
