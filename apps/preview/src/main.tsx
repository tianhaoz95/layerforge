import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './firebase'
import App from './App'
import { JoinedPage } from './pages/JoinedPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/joined" element={<JoinedPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
