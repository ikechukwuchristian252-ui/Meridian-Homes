import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './layouts/App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './pages/homepage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route  element={<App/>}> 
        <Route index element={<Homepage/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
