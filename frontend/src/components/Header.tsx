import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Trash2, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

/* ─ helpers ───────────────────────────────────────────── */
const ADMIN_EMAIL = 'admin@gmail.com';
const isAdminEmail = (email?: string | null) => email === ADMIN_EMAIL;

/* ─ component ─────────────────────────────────────────── */
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close menu on route change */
  useEffect(() => setIsMenuOpen(false), [location]);

  /* auth listener */
  // 
  useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getSession();
    setUser(data.session?.user || null);
  };
  checkUser();

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  const isAdmin = isAdminEmail(user?.email);

  /* sign-out */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');              // go home
  };
 


  /* nav items (desktop) */
  const CommonLinks = () => (
    <>
      <NavLink to="/" current={location.pathname}>Home</NavLink>
      <NavLink to="/classify" current={location.pathname}>Classify</NavLink>
      <NavLink to="/categories" current={location.pathname}>Categories</NavLink>
      <NavLink to="/disposal-sites" current={location.pathname}>Disposal Sites</NavLink>
      <NavLink to="/history" current={location.pathname}>History</NavLink>
      <NavLink to="/about" current={location.pathname}>About</NavLink>
      <NavLink to="/api-docs" current={location.pathname}>API EXPO</NavLink>
    </>
  );

  return (
    <header className={`sticky top-0 z-50 transition ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2">
            <Trash2 className="h-8 w-8 text-blue-500" />
            <span className="font-bold text-xl text-gray-800">MediSort AI</span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {user && isAdmin && (
              <>
                <NavLink to="/admin-dashboard" current={location.pathname}>Dashboard</NavLink>
              </>
            )}

            {!isAdmin && <CommonLinks />}

            {/* logout (only when logged-in) */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
          </nav>

          {/* mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* mobile nav */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 bg-white">
            <div className="flex flex-col space-y-3">
              {user && isAdmin && (
                <MobileNavLink to="/admin-dashboard" current={location.pathname}>Dashboard</MobileNavLink>
              )}
              {!isAdmin && (
                <>
                  <MobileNavLink to="/" current={location.pathname}>Home</MobileNavLink>
                  <MobileNavLink to="/classify" current={location.pathname}>Classify</MobileNavLink>
                  <MobileNavLink to="/categories" current={location.pathname}>Categories</MobileNavLink>
                  <MobileNavLink to="/disposal-sites" current={location.pathname}>Disposal Sites</MobileNavLink>
                  <MobileNavLink to="/history" current={location.pathname}>History</MobileNavLink>
                  <MobileNavLink to="/about" current={location.pathname}>About</MobileNavLink>
                  <MobileNavLink to="/api-docs" current={location.pathname}>API EXPO</MobileNavLink>
                </>
              )}
              {user && (
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                  className="text-left px-4 py-2 text-red-600 hover:bg-gray-50 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

/* ─ link helpers ─ */
interface NavLinkProps { to: string; current: string; children: React.ReactNode; }

const NavLink: React.FC<NavLinkProps> = ({ to, current, children }) => (
  <Link
    to={to}
    className={`relative px-1 py-2 font-medium transition ${
      current === to ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<NavLinkProps> = ({ to, current, children }) => (
  <Link
    to={to}
    className={`block px-4 py-2 text-lg ${
      current === to ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    {children}
  </Link>
);

export default Header;

// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X, Trash2 } from 'lucide-react';
// import { supabase } from '../lib/supabase';

// const Header: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [user, setUser] = useState<any>(null); // Track user
//   const location = useLocation();

//   // Scroll shadow effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Close menu on route change
//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location]);

//   // Check user login state
//   useEffect(() => {
//     const checkUser = async () => {
//       const { data } = await supabase.auth.getSession();
//       setUser(data.session?.user || null);
//     };
//     checkUser();

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <header 
//       className={`sticky top-0 z-50 transition-all duration-300 ${
//         isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
//       }`}
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <Link to="/" className="flex items-center space-x-2">
//             <Trash2 className="h-8 w-8 text-blue-500" />
//             <span className="font-bold text-xl text-gray-800">MediSort AI</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             <NavLink to="/" current={location.pathname}>Home</NavLink>
//             <NavLink to="/classify" current={location.pathname}>Classify</NavLink>
//             <NavLink to="/categories" current={location.pathname}>Categories</NavLink>
//             <NavLink to="/disposal-sites" current={location.pathname}>Disposal Sites</NavLink>
//             <NavLink to="/history" current={location.pathname}>History</NavLink>
//             <NavLink to="/about" current={location.pathname}>About</NavLink>
//             <NavLink to="/api-docs" current={location.pathname}>API EXPO</NavLink>
//             {user && <NavLink to="/logout" current={location.pathname}>Logout</NavLink>}
//           </nav>

//           {/* Mobile Menu Button */}
//           <button 
//             className="md:hidden text-gray-700 focus:outline-none"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <nav className="md:hidden py-4 bg-white">
//             <div className="flex flex-col space-y-3">
//               <MobileNavLink to="/" current={location.pathname}>Home</MobileNavLink>
//               <MobileNavLink to="/classify" current={location.pathname}>Classify</MobileNavLink>
//               <MobileNavLink to="/categories" current={location.pathname}>Categories</MobileNavLink>
//               <MobileNavLink to="/disposal-sites" current={location.pathname}>Disposal Sites</MobileNavLink>
//               <MobileNavLink to="/history" current={location.pathname}>History</MobileNavLink>
//               <MobileNavLink to="/about" current={location.pathname}>About</MobileNavLink>
//               <MobileNavLink to="/api-docs" current={location.pathname}>API EXPO</MobileNavLink>
//               {user && <MobileNavLink to="/logout" current={location.pathname}>Logout</MobileNavLink>}
//             </div>
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// };

// interface NavLinkProps {
//   to: string;
//   current: string;
//   children: React.ReactNode;
// }

// const NavLink: React.FC<NavLinkProps> = ({ to, current, children }) => {
//   const isActive = current === to;
//   return (
//     <Link 
//       to={to}
//       className={`relative px-1 py-2 font-medium transition-colors ${
//         isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
//       }`}
//     >
//       {children}
//       {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
//     </Link>
//   );
// };

// const MobileNavLink: React.FC<NavLinkProps> = ({ to, current, children }) => {
//   const isActive = current === to;
//   return (
//     <Link
//       to={to}
//       className={`block px-4 py-2 text-lg ${
//         isActive ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
//       }`}
//     >
//       {children}
//     </Link>
//   );
// };

// export default Header;

// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X, Trash2 } from 'lucide-react';

// const Header: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location]);

//   return (
//     <header 
//       className={`sticky top-0 z-50 transition-all duration-300 ${
//         isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
//       }`}
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <Link to="/" className="flex items-center space-x-2">
//             <Trash2 className="h-8 w-8 text-blue-500" />
//             <span className="font-bold text-xl text-gray-800">MediSort AI</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             <NavLink to="/" current={location.pathname}>Home</NavLink>
//             <NavLink to="/classify" current={location.pathname}>Classify</NavLink>
//             <NavLink to="/categories" current={location.pathname}>Categories</NavLink>
//             <NavLink to="/disposal-sites" current={location.pathname}>Disposal Sites</NavLink>
//             <NavLink to="/history" current={location.pathname}>History</NavLink>
//             <NavLink to="/about" current={location.pathname}>About</NavLink>
//             <NavLink to="/api-docs" current={location.pathname}>API EXPO</NavLink>
//             <NavLink to="/logout" current={location.pathname}>Logout</NavLink>
//           </nav>

//           {/* Mobile Menu Button */}
//           <button 
//             className="md:hidden text-gray-700 focus:outline-none"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? 
//               <X className="h-6 w-6" /> : 
//               <Menu className="h-6 w-6" />
//             }
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <nav className="md:hidden py-4 bg-white">
//             <div className="flex flex-col space-y-3">
//               <MobileNavLink to="/" current={location.pathname}>Home</MobileNavLink>
//               <MobileNavLink to="/classify" current={location.pathname}>Classify</MobileNavLink>
//               <MobileNavLink to="/categories" current={location.pathname}>Categories</MobileNavLink>
//               <MobileNavLink to="/disposal-sites" current={location.pathname}>Disposal Sites</MobileNavLink>
//               <MobileNavLink to="/history" current={location.pathname}>History</MobileNavLink>
//               <MobileNavLink to="/about" current={location.pathname}>About</MobileNavLink>
//               <MobileNavLink to="/api-docs" current={location.pathname}>API EXPO</MobileNavLink>
//               <MobileNavLink to="/logout" current={location.pathname}>Logout</MobileNavLink>
//             </div>
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// };

// interface NavLinkProps {
//   to: string;
//   current: string;
//   children: React.ReactNode;
// }

// const NavLink: React.FC<NavLinkProps> = ({ to, current, children }) => {
//   const isActive = current === to;
  
//   return (
//     <Link 
//       to={to}
//       className={`relative px-1 py-2 font-medium transition-colors ${
//         isActive 
//           ? 'text-blue-600' 
//           : 'text-gray-700 hover:text-blue-600'
//       }`}
//     >
//       {children}
//       {isActive && (
//         <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform" />
//       )}
//     </Link>
//   );
// };

// const MobileNavLink: React.FC<NavLinkProps> = ({ to, current, children }) => {
//   const isActive = current === to;
  
//   return (
//     <Link
//       to={to}
//       className={`block px-4 py-2 text-lg ${
//         isActive 
//           ? 'text-blue-600 bg-blue-50 font-medium' 
//           : 'text-gray-700 hover:bg-gray-50'
//       }`}
//     >
//       {children}
//     </Link>
//   );
// };

// export default Header;