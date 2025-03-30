import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import TransactionPage from './pages/transactions.jsx';
import AccountPage from './pages/accounts.jsx';
import CategoryPage from './pages/categories.jsx';
import BudgetPage from './pages/budget.jsx';
import ReportPage from './pages/reports.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "transactions",
        element: <TransactionPage />
      },
      {
        path: "accounts",
        element: <AccountPage />
      },
      {
        path: "categories",
        element: <CategoryPage />
      },
      {
        path: "budgets",
        element: <BudgetPage />
      },
      {
        path: "reports",
        element: <ReportPage />
      },
    ]
  },
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "login",
    element: <LoginPage />
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)
