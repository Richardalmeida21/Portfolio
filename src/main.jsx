import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Sobre from './pages/Sobre.jsx'
import Projetos from './pages/Projetos.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import PeekRobot from './components/PeekRobot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CustomCursor />
      <PeekRobot />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/projetos" element={<Projetos />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
