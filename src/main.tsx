import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { UserProvider } from './contexts/UserContext'
import { ProjectProvider } from './contexts/ProjectContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
