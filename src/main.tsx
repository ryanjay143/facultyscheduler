import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy, type ReactNode } from 'react';
import NotFound from './notFound';
import './index.css';
import Loader from './components/loader';
import { Toaster } from 'sonner';

import AdminContainerLayouts from './views/admin/AdminContainerLayouts';
import FacultyContainerLayouts from './views/faculty/FacultyContainerLayouts';
import DeparmentContainerLayouts from './views/department/DeparmentContainerLayouts';

// Define a type for our route objects for better type safety
interface RouteConfig {
  path: string;
  element: ReactNode;
}

// Helper function for lazy loading with a delay
const lazyWithDelay = (path: string, delay = 3000) =>
  lazy(() => wait(delay).then(() => import(`./views/${path}`)));

// Lazy-loaded components
const Login = lazyWithDelay('auth/Login');
const ForgotPassword = lazyWithDelay('auth/FotgotPassword');
const DashboardContainer = lazyWithDelay('admin/dashboard/DashboardContainer');
const FacultyContainer = lazyWithDelay('admin/faculty/FacultyContainer');
const RoomContainer = lazyWithDelay('admin/room/RoomContainer');
const CourseContainer = lazyWithDelay('admin/curriculum/CourseContainer');
const ScheduleContainer = lazyWithDelay('admin/faculty-loading/ScheduleContainer');
const ReportsContainer = lazyWithDelay('admin/reports/ReportsContainer');
const SettingsContainer = lazyWithDelay('admin/settings/SettingsContainer');
const ProfileContainer = lazyWithDelay('admin/profile/ProfileContainer');
const DepartmentDashboardContainer = lazyWithDelay('department/dashboard/DeanDashboardContainer');
const DepartmentFacultyLoading = lazyWithDelay('department/facultyLoading/FacultyLoading');
const ClassroomSchedule = lazyWithDelay('department/classrommSchedule/ClassroomScheduleLayout');
const FacultyDashboardContainer = lazyWithDelay('faculty/dashboard/FacultyDashboardContainer');
const FacultySchedule = lazyWithDelay('faculty/schedule/FacultySchedule');
const FacultyLoading = lazyWithDelay('faculty/facultyLoading/FacultyLoading');
const FacultyNotification = lazyWithDelay('faculty/notification/FacultyNotification');
const FacultyProfileContainer = lazyWithDelay('faculty/profile/FacultyProfileContainer');

// Route configurations
const adminRoutes: RouteConfig[] = [
  { path: 'user-dashboard', element: <DashboardContainer /> },
  { path: 'faculty', element: <FacultyContainer /> },
  { path: 'room', element: <RoomContainer /> },
  { path: 'curriculum-management', element: <CourseContainer /> },
  { path: 'faculty-loading', element: <ScheduleContainer /> },
  { path: 'reports', element: <ReportsContainer /> },
  { path: 'settings', element: <SettingsContainer /> },
  { path: 'profile', element: <ProfileContainer /> },
];

const deanRoutes: RouteConfig[] = [
  { path: 'user-dashboard', element: <DepartmentDashboardContainer /> },
  { path: 'faculty-loading', element: <DepartmentFacultyLoading /> },
  { path: 'class-management', element: <ClassroomSchedule /> },
];

const facultyRoutes: RouteConfig[] = [
  { path: 'user-dashboard', element: <FacultyDashboardContainer /> },
  { path: 'my-schedule', element: <FacultySchedule /> },
  { path: 'faculty-loading', element: <FacultyLoading /> },
  { path: 'notifications', element: <FacultyNotification /> },
  { path: 'profile', element: <FacultyProfileContainer /> },
];

// This function now expects an array of objects matching the RouteConfig interface
const generateSuspenseRoutes = (routes: RouteConfig[]) =>
  routes.map(({ path, element }) => ({
    path,
    element: <Suspense fallback={<Loader />}>{element}</Suspense>,
  }));

const routes = [
  { path: '/facultyscheduler', element: <RedirectFrom404 /> },
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
        <ForgotPassword />
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
      ...generateSuspenseRoutes(adminRoutes),
    ],
  },
  {
    path: 'facultyscheduler/dean',
    element: <DeparmentContainerLayouts />,
    children: [
      {
        path: '',
        element: <Navigate to="facultyscheduler/dean/user-dashboard" />,
      },
      ...generateSuspenseRoutes(deanRoutes),
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
      ...generateSuspenseRoutes(facultyRoutes),
    ],
  },
  { path: '*', element: <NotFound /> },
];

// Create router
const router = createBrowserRouter(routes);

// Component to handle redirects coming from GitHub Pages 404
function RedirectFrom404() {
  const params = new URLSearchParams(window.location.search);
  const shouldRedirect = params.get('redirect') === 'true';
  if (shouldRedirect) {
    const saved = sessionStorage.getItem('redirectPath') || '/facultyscheduler/user-login';
    sessionStorage.removeItem('redirectPath');
    return <Navigate to={saved} replace />;
  }
  return <Navigate to="/facultyscheduler/user-login" replace />;
}

// Simulate delay function with a number type for the parameter
function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// Find the root element to render the app into
const rootElement = document.getElementById('root');

// Ensure the root element exists before trying to render the app
if (!rootElement) {
  throw new Error("Failed to find the root element with id 'root'");
}

// Render application
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster richColors position="top-right" />
  </React.StrictMode>
);