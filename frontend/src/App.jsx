

import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ToastContainer } from 'react-toastify';
import { useUserStore } from './stores/useUserStore';

function App() {
  const fetchUser = useUserStore(state => state.fetchUser);

  useEffect(() => {

    fetchUser();
  }, [fetchUser]);

  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  )
}

export default App
