import React from 'react'
import ReactDOM from 'react-dom/client'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import NavBar from './components/NavBar'
import { ToastContainer } from 'react-toastify';  // Importa il componente ToastContainer

function App() {

  return (
    <>
    {/* Posizione globale del ToastContainer */}
      <NavBar/>
      <h1>Benvenuto nella HomePage</h1>
    </>
  )
}

export default App
