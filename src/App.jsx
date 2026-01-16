import { Routes, Route, Link } from 'react-router-dom';
import MateriLBE from './pages/subtest/lbe/materi'
import Latsol from './pages/latsol/Latsol'
import Home from './pages/home/Home'
import './App.css'
import Materi from './pages/materi/Materi';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CheckEmail from './pages/auth/CheckEmail';
import RequireAuth from './components/auth/RequireAuth';
import AuthRequired from './pages/auth/AuthRequired';
import NeedLogin from './pages/auth/NeedLogin';
import LatsolLBE from './pages/subtest/lbe/latsol';
import MateriLBI from './pages/subtest/lbi/materi';
import LatsolLBI from './pages/subtest/lbi/latsol';
import LatsolPK from './pages/subtest/pk/latsol';
import MateriPK from './pages/subtest/pk/materi';
import LatsolPM from './pages/subtest/pm/latsol';
import MateriPM from './pages/subtest/pm/materi';
import LatsolPPU from './pages/subtest/ppu/latsol';
import MateriPPU from './pages/subtest/ppu/materi';
import MateriPU from './pages/subtest/pu/materi';
import LatsolPU from './pages/subtest/pu/latsol';
import FeedbackPage from './pages/feedback/Feedback';
import LatsolPBM from './pages/subtest/pbm/latsol';
import MateriPBM from './pages/subtest/pbm/materi';
import TodoPage from './pages/todo/Todo';
import SocialPage from './pages/social/Social';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materi" element={
          <RequireAuth>
            <Materi />
          </RequireAuth>
        } />
        <Route path="/latsol" element={
          <RequireAuth>
            <Latsol />
          </RequireAuth>
        } />
        <Route path="/materi/lbe" element={
          <RequireAuth>
            <MateriLBE />
          </RequireAuth>
        } />
        <Route path="/latsol/lbe" element={
          <RequireAuth>
            <LatsolLBE />
          </RequireAuth>
        } />
        <Route path="/materi/lbi" element={
          <RequireAuth>
            <MateriLBI />
          </RequireAuth>
        } />
        <Route path="/latsol/lbi" element={
          <RequireAuth>
            <LatsolLBI />
          </RequireAuth>
        } />
        <Route path="/materi/pk" element={
          <RequireAuth>
            <MateriPK />
          </RequireAuth>
        } />
        <Route path="/latsol/pk" element={
          <RequireAuth>
            <LatsolPK />
          </RequireAuth>
        } />
        <Route path="/materi/pm" element={
          <RequireAuth>
            <MateriPM />
          </RequireAuth>
        } />
        <Route path="/latsol/pm" element={
          <RequireAuth>
            <LatsolPM />
          </RequireAuth>
        } />
        <Route path="/materi/ppu" element={
          <RequireAuth>
            <MateriPPU />
          </RequireAuth>
        } />
        <Route path="/latsol/ppu" element={
          <RequireAuth>
            <LatsolPPU />
          </RequireAuth>
        } />
        <Route path="/materi/pu" element={
          <RequireAuth>
            <MateriPU />
          </RequireAuth>
        } />
        <Route path="/latsol/pu" element={
          <RequireAuth>
            <LatsolPU />
          </RequireAuth>
        } />
        <Route path="/materi/pbm" element={
          <RequireAuth>
            <MateriPBM />
          </RequireAuth>
        } />
        <Route path="/latsol/pbm" element={
          <RequireAuth>
            <LatsolPBM />
          </RequireAuth>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/auth-required" element={<AuthRequired />} />
        <Route path="/need-login" element={<NeedLogin />} />
        <Route path="/feedback" element={
          <RequireAuth>
            <FeedbackPage />
          </RequireAuth>
        } />
        <Route path="/todo" element={
          <RequireAuth>
            <TodoPage />
          </RequireAuth>
        } />
        <Route path="/social" element={
          <RequireAuth>
            <SocialPage />
          </RequireAuth>
        } />
      </Routes>
    </>
  )
}

export default App
