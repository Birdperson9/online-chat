import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './components/PrivateRoutes'
import Room from './pages/Room'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/' element={<Room />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
