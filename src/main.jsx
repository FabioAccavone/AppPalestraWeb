import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'  
import AreaRiservata from './pages/AreaRiservata.jsx'
import ProtectedRoute from './components/ProtectedRouter.jsx'
import AuthProvider from './context/AuthContext.jsx';
import Allenamenti from './pages/Allenamenti.jsx'
import Prenotazioni from './pages/Prenotazioni.jsx'

const router = createBrowserRouter([
    {
        path:"/",
        element: <App />,
    },
    {
        path:"/login",
        element:<Login />,
    },
    {
        path:"/AreaRiservata",
        element:(
            <ProtectedRoute> {/* Avvolgi la rotta dashboard */}
              <AreaRiservata />
            </ProtectedRoute>
          ),
    },
    {
        path:"/prenotazioni",
        element:(
            <ProtectedRoute> {/* Avvolgi la rotta dashboard */}
              <Prenotazioni />
            </ProtectedRoute>
          ),
    },
    {
        path:"/allenamenti",
        element:(
            <ProtectedRoute> {/* Avvolgi la rotta dashboard */}
              <Allenamenti />
            </ProtectedRoute>
          ),
    }
    
]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router}/>
            </AuthProvider>
    </React.StrictMode>
)
