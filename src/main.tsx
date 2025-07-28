import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import NotFound from './notFound';
import './index.css';
import Loader from './components/loader';
import { Toaster } from 'sonner';


import AdminContainerLayouts  from './views/admin/AdminContainerLayouts';



// Lazy-loaded components with simulated delay
const Login = lazy(() => 
  wait(3000).then(() => import('./views/auth/Login'))
);

const ReportsContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/reports/ReportsContainer'))
);

const ForgotPassword = lazy(() => 
  wait(3000).then(() => import('./views/auth/FotgotPassword'))
);

const ScheduleContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/schedule/ScheduleContainer'))
);

const CourseContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/course/CourseContainer'))
);

const RoomContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/room/RoomContainer'))
);

const DashboardContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/dashboard/DashboardContainer'))
);

const FacultyContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/faculty/FacultyContainer'))
);

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
    path: '/forgot-password',
    element: (
      <Suspense fallback={<Loader />}>
        <ForgotPassword  />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: <AdminContainerLayouts />,
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
      {
        path: 'faculty',
        element: 
          <Suspense fallback={<Loader />}>
            <FacultyContainer />
          </Suspense>
      },
      {
        path: 'room',
        element: 
          <Suspense fallback={<Loader />}>
            <RoomContainer />
          </Suspense>
      },
      {
        path: 'course',
        element: 
          <Suspense fallback={<Loader />}>
            <CourseContainer />
          </Suspense>
      },
      {
        path: 'schedule',
        element: 
          <Suspense fallback={<Loader />}>
            <ScheduleContainer />
          </Suspense>
      },
      {
        path: 'reports',
        element: 
          <Suspense fallback={<Loader />}>
            <ReportsContainer />
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
    <Toaster richColors position="top-right" /> 
  </React.StrictMode>
);