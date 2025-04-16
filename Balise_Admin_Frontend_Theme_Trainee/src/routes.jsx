import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
// import CustomerList from 'views/Pages/CustomerList';

import { APP_PREFIX_PATH, BASE_URL } from './config/constant';

// ==============================|| ROUTES ||============================== //

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  // {
  //   exact: 'true',
  //   path: '/auth/signup-1',
  //   element: lazy(() => import('./views/auth/signup/SignUp1'))
  // },
  {
    exact: 'true',
    path: APP_PREFIX_PATH + '/signin',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: APP_PREFIX_PATH + '/forgot-password-1',
    element: lazy(() => import('./views/auth/forgot-password/ForgotPassword1'))
  },
  {
    exact: 'true',
    path: APP_PREFIX_PATH + '/reset-password',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/dashboard',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/customer_list',
        element: lazy(() => import('./views/Pages/CustomerList'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/deleted_list',
        element: lazy(() => import('./views/Pages/DeletedCustomer'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/viewcustomer/:id',
        element: lazy(() => import('./views/Pages/ViewCustomer'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/bookings/view/:id',
        element: lazy(() => import('./views/Pages/ViewBooking'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/view-deleted-customer/:id',
        element: lazy(() => import('./views/Pages/ViewDeletedCustomer'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/manage_banner',
        element: lazy(() => import('./views/Pages/ManageBanner'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/view_banner/:id',
        element: lazy(() => import('./views/Pages/ViewBanner'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/view-question/:question_id',
        element: lazy(() => import('./views/Pages/viewQuestion'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/manage_category',
        element: lazy(() => import('./views/Pages/ManageCategory'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/manage-contact',
        element: lazy(() => import('./views/Pages/ManageContact'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/manage-broadcast',
        element: lazy(() => import('./views/Pages/ManageBroadcast'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/manage_banner',
        element: lazy(() => import('./views/Pages/ManageBanner'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/manage-booking',
        element: lazy(() => import('./views/Pages/ManageBooking'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/manage-content',
        element: lazy(() => import('./views/Pages/ManageContent'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/customer-report',
        element: lazy(() => import('./views/Pages/CustomerReport'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/customer-ana-report',
        element: lazy(() => import('./views/Pages/AnalyticsReport'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/profile',
        element: lazy(() => import('./views/Pages/Profile'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/basic/button',
        element: lazy(() => import('./views/ui-elements/BasicButton'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/basic/badges',
        element: lazy(() => import('./views/ui-elements/BasicBadges'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/basic/breadcrumb-pagination',
        element: lazy(() => import('./views/ui-elements/BasicBreadcrumbPagination'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/BasicCollapse'))
      },

      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/basic/typography',
        element: lazy(() => import('./views/ui-elements/BasicTypography'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/basic/tooltip-popovers',
        element: lazy(() => import('./views/ui-elements/BasicTooltipsPopovers'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        exact: 'true',
        path: APP_PREFIX_PATH + '/question',
        element: lazy(() => import('./views/Pages/ManageQuestion'))
      },

      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default renderRoutes;
