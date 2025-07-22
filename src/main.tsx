import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import NotFound from './notFound';
import './index.css';
import Loader from './components/loader';

import AdminContainer  from './views/admin/AdminContainer';

// Lazy-loaded components with simulated delay
const Login = lazy(() => wait(3000).then(() => import('./views/auth/Login')));

const DashboardContainer = lazy(() => wait(3000).then(() => import('./views/admin/dashboard/DashboardContainer')));

// Route configuration
const routes = [
  {
    path: '/',
    element: <Navigate to="/user-login" />,
  },
  {
    path: '/user-login',
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: <AdminContainer />,
    children: [
      {
        path: '',
        element: <Navigate to="/admin/user-dashboard" />,
      },
      {
        path: 'user-dashboard',
        element: 
          <Suspense fallback={<Loader />}>
            <DashboardContainer />
          </Suspense>
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

// Create router
const router = createBrowserRouter(routes);

// Simulate delay function
function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// Render application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);