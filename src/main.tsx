import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import NotFound from './notFound';
import './index.css';
import Loader from './components/loader';
import { Toaster } from 'sonner';


import AdminContainerLayouts  from './views/admin/AdminContainerLayouts';
import FacultyContainerLayouts from './views/faculty/FacultyContainerLayouts';

// Lazy-loaded components with simulated delay
const Login = lazy(() => 
  wait(3000).then(() => import('./views/auth/Login'))
);

const FacultyNotification = lazy(() => 
  wait(3000).then(() => import('./views/faculty/notification/FacultyNotification'))
);

const FacultySettings = lazy(() => 
  wait(3000).then(() => import('./views/faculty/settings/FacultySettings'))
);

const FacultyProfileContainer = lazy(() => 
  wait(3000).then(() => import('./views/faculty/profile/FacultyProfileContainer'))
);

const ReportsContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/reports/ReportsContainer'))
);

const ProfileContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/profile/ProfileContainer'))
);

const NotificationContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/notification/NotificationContainer'))
);

const SettingsContainer = lazy(() => 
  wait(3000).then(() => import('./views/admin/settings/SettingsContainer'))
);

const FacultySchedule = lazy(() => 
  wait(3000).then(() => import('./views/faculty/schedule/FacultySchedule'))
);

const Announcement = lazy(() => 
  wait(3000).then(() => import('./views/admin/announcement/AnnouncementPage'))
);

const FacultyLoading = lazy(() => 
  wait(3000).then(() => import('./views/faculty/facultyLoading/FacultyLoading'))
);

const FacultyDashboardContainer = lazy(() => 
  wait(3000).then(() => import('./views/faculty/dashboard/FacultyDashboardContainer'))
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
    path: '/facultyscheduler',
    element: <Navigate to="/facultyscheduler/user-login" />,
  },
  {
    path: 'facultyscheduler/user-login',
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: 'facultyscheduler/forgot-password',
    element: (
      <Suspense fallback={<Loader />}>
        <ForgotPassword  />
      </Suspense>
    ),
  },
  {
    path: 'facultyscheduler/admin',
    element: <AdminContainerLayouts />,
    children: [
      {
        path: '',
        element: <Navigate to="facultyscheduler/admin/user-dashboard" />,
      },
      {
        path: 'user-dashboard',
        element: 
          <Suspense fallback={<Loader />}>
            <DashboardContainer />
          </Suspense>
      },
      {
        path: 'announcement',
        element: 
          <Suspense fallback={<Loader />}>
            <Announcement />
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
        path: 'curriculum-management',
        element: 
          <Suspense fallback={<Loader />}>
            <CourseContainer />
          </Suspense>
      },
      {
        path: 'faculty-loading',
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
      {
        path: 'notifications',
        element: 
          <Suspense fallback={<Loader />}>
            <NotificationContainer />
          </Suspense>
      },
      {
        path: 'settings',
        element: 
          <Suspense fallback={<Loader />}>
            <SettingsContainer />
          </Suspense>
      },
      {
        path: 'profile',
        element: 
          <Suspense fallback={<Loader />}>
            <ProfileContainer />
          </Suspense>
      },

    ],
  },
   {
    path: 'facultyscheduler/faculty',
    element: <FacultyContainerLayouts />,
    children: [
      {
        path: '',
        element: <Navigate to="facultyscheduler/faculty/user-dashboard" />,
      },
      {
        path: 'user-dashboard',
        element: 
          <Suspense fallback={<Loader />}>
            <FacultyDashboardContainer />
          </Suspense>
      },
      {
        path: 'my-schedule',
        element: 
          <Suspense fallback={<Loader />}>
            <FacultySchedule />
          </Suspense>
      },
      {
        path: 'faculty-loading',
        element: 
          <Suspense fallback={<Loader />}>
            <FacultyLoading />
          </Suspense>
      },
      {
        path: 'notifications',
        element: 
          <Suspense fallback={<Loader />}>
            <FacultyNotification />
          </Suspense>
      },
      {
        path: 'profile',
        element: 
          <Suspense fallback={<Loader />}>
            <FacultyProfileContainer />
          </Suspense>
      },
      {
        path: 'settings',
        element: 
          <Suspense fallback={<Loader />}>
            <FacultySettings />
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