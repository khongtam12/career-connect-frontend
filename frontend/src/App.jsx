

import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ToastContainer } from 'react-toastify';
import { useUserStore } from './stores/useUserStore';
import AuthModal from './components/auth/AuthModal';

function App() {
  const fetchUser = useUserStore(state => state.fetchUser);

  useEffect(() => {

    fetchUser();
  }, []);


  return (
    <div>
      <RouterProvider router={router} />
      <AuthModal />
      <ToastContainer />
    </div>
  )
}

export default App
