/**
 * Application Entry Point
 * 
 * Renders the React application into the DOM
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure index.html has a div with id="root"');
}

// Create root and render
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);