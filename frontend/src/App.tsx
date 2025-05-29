import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ClassifyImage from './pages/ClassifyImage';
import Categories from './pages/Categories';
import History from './pages/History';
import About from './pages/About';
import DisposalSites from './pages/DisposalSites';
import ApiDocs from './pages/ApiDocs';
import AuthGuard from './components/AuthGuard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';
import { LogOut } from 'lucide-react';
import LogoutButton from './pages/logout';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/classify" element={
                <AuthGuard>
                  <ClassifyImage />
                </AuthGuard>
              } />
              <Route path="/categories" element={<Categories />} />
              <Route path="/disposal-sites" element={<DisposalSites />} />
              <Route path="/history" element={
                <AuthGuard>
                  <History />
                </AuthGuard>
              } />
              <Route path="/about" element={<About />} />
              <Route path='/api-docs' element ={<ApiDocs/>} />
              <Route path="/admin" element={
                <AuthGuard requireAdmin>
                  <AdminDashboard />
                </AuthGuard>
              } />
              <Route path='/logout' element ={<LogoutButton/>} />
            </Routes>
          </main>
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 MediSort AI</p>
            <p className="text-sm mt-1">Helping healthcare facilities manage waste safely and efficiently</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App