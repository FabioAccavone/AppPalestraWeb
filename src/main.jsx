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
import ModificaPrenotazione from './pages/ModificaPrenotazione.jsx'
//import Schede from './pages/Schede.jsx'

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
        element: <Prenotazioni/>
    },
    {
        path:"/allenamenti",
        element: <Allenamenti/>
    },
    {
        path:"/modifica-prenotazione/:idPrenotazione",
        element:<ModificaPrenotazione/>
    }
   /* {
        path:"/schede",
        element:<Schede/>
    }*/
    
]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router}/>
            </AuthProvider>
    </React.StrictMode>
)
