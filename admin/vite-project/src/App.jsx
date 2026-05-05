import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NavLink from './components/NavLink';
import Sidebar from './components/Sidebar'
import Login from './components/Login';
import Adding from './pages/Adding'
import Orders from './pages/Orders'
import List from './pages/List'

function App() {
  // Initialize token from localStorage
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Synchronize localStorage whenever token changes
  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <NavLink setToken={setToken} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
          <hr />
          <div className='flex w-full relative'>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className='w-full lg:w-[70%] lg:mx-auto lg:ml-[max(5vw,25px)] my-4 lg:my-8 px-4 lg:px-0 text-gray-600 text-base'>
              <Routes>
                <Route path='/Adding' element={<Adding token={token} />} />
                <Route path='/List' element={<List token={token} />} />
                <Route path='/Orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
