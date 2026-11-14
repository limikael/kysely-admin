import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import CrudApp from '../ui/CrudApp.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CrudApp url={(new URL("/api",window.location.href)).href}/>
    </StrictMode>
)
