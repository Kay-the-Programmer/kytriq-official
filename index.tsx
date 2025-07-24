import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './contexts/CartContext';
import { OptimizedContentProvider } from './contexts/OptimizedContentProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <OptimizedContentProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </OptimizedContentProvider>
  </React.StrictMode>
);
