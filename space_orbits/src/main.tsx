import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "react-redux";
import store from './store.ts';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
  
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
    .register("./serviceWorker.js")
      .then(() => console.log('Service worker registered'))
      .catch((err) => console.log('Service worker not registered', err));
  });
}