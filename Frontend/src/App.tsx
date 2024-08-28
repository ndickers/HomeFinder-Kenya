import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Error from './pages/Error'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout> <Landing /> </Layout>,
      errorElement: <Error />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
