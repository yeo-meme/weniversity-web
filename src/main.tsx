import React from 'react' 
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import StudyLayoutPlayer from "./components/video/StudyLayoutPlayer";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* 기본 페이지 */}
          <Route path="/" element={<App />} />
          <Route path="/my-courses" element={<StudyLayoutPlayer />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
