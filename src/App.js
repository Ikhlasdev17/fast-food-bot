import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Products from './Pages/Products'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<center>
          <h1>Page not found!</h1>
        </center>} />
        <Route path='/:userId/:lang' element={<Products />} />
      </Routes>
    </div>
  )
}

export default App