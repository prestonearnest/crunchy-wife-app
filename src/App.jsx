import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Newsletter from './pages/Newsletter'
import SubmitStory from './pages/SubmitStory'
import Stories from './pages/Stories'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/submit" element={<SubmitStory />} />
        <Route path="/stories" element={<Stories />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
