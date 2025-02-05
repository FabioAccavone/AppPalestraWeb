import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'  
import AreaRiservata from './pages/AreaRiservata.jsx'
import ProtectedRoute from './components/ProtectedRouter.jsx'
import AuthProvider from './context/AuthContext.jsx'
import Allenamenti from './pages/Allenamenti.jsx'
import Prenotazioni from './pages/Prenotazioni.jsx'
import ModificaPrenotazione from './pages/ModificaPrenotazione.jsx'
import MieSchede from './pages/MieSchede.jsx'
import DettagliScheda from './pages/DettagliScheda.jsx'
import Anagrafica from './pages/Anagrafica.jsx'


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
        element: (<ProtectedRoute> {/* Avvolgi la rotta dashboard */}
        <Prenotazioni/>
        </ProtectedRoute>),
    },
    {
        path:"/allenamenti",
        element: (<ProtectedRoute> {/* Avvolgi la rotta dashboard */}
            <Allenamenti/>
            </ProtectedRoute>),
    },
    {
        path:"/modifica-prenotazione/:idPrenotazione",
        element:(<ProtectedRoute> {/* Avvolgi la rotta dashboard */}
            <ModificaPrenotazione/>
            </ProtectedRoute>),
    },
    {
        path:"/schede",
        element:(<ProtectedRoute> {/* Avvolgi la rotta dashboard */}
            <MieSchede/>
            </ProtectedRoute>),
    },
    {
        path:"dettagli-scheda/:idScheda",
        element:(<ProtectedRoute> {/* Avvolgi la rotta dashboard */}
            <DettagliScheda/>
            </ProtectedRoute>),
    },
    {
        path:"anagrafica",
        element:(<ProtectedRoute> {/* Avvolgi la rotta dashboard */}
            <Anagrafica/>
            </ProtectedRoute>),
    }
    
]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router}/>
            </AuthProvider>
    </React.StrictMode>
)
