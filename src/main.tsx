import React from 'react' // ✅ 기본 import 방식
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App6.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
