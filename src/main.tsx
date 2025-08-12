import React from 'react' // ✅ 기본 import 방식
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App7.tsx'
import { Provider } from 'react-redux'
// import { store } from './store/store.ts'
import { testStore } from "./store/testStore";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={testStore}>
      <App />
    </Provider>
  </React.StrictMode>
)
