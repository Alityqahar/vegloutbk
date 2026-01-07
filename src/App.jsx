import { Routes, Route, Link } from 'react-router-dom';
import MateriLBE from './pages/subtest/lbe/materi'
import Latsol from './pages/latsol/Latsol'
import Home from './pages/home/Home'
import './App.css'
import Materi from './pages/materi/Materi';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CheckEmail from './pages/auth/CheckEmail';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materi" element={<Materi />} />
        <Route path="/latsol" element={<Latsol />} />
        <Route path="/materi/lbe" element={<MateriLBE />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<CheckEmail />} />
      </Routes>
    </>
  )
}

export default App
