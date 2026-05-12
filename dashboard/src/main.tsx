import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './routes/Home.tsx'
import Wizard from './routes/Wizard.tsx'
import Onboard from './routes/Onboard.tsx'
import Pool from './routes/Pool.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wizard/:slug" element={<Wizard />} />
        <Route path="/dashboard/:slug" element={<App />} />
        <Route path="/dashboard" element={<App />} />
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/pool" element={<Pool />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
