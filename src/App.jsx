import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { NotificationContext, NotificationProvider } from "./components/context/notification.context";
import { Spin } from "antd";

const AppContent = () => {
  const { setAuth, appLoading, setAppLoading, auth } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setAppLoading(false);
          return;
        }

        const res = await axios.get(`/v1/api/account`);
        if (res && !res.message) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.email,
              name: res.name,
              _id: res._id
            }
          });
        } else {
          localStorage.removeItem("access_token");
          setAuth({
            isAuthenticated: false,
            user: {
              email: '',
              name: '',
              _id: ''
            }
          });
        }
      } catch (error) {
        console.error("Error fetching account:", error);
        localStorage.removeItem("access_token");
        setAuth({
          isAuthenticated: false,
          user: {
            email: '',
            name: '',
            _id: ''
          }
        });
      } finally {
        setAppLoading(false);
      }
    };

    fetchAccount();
  }, [setAuth, setAppLoading]);

  useEffect(() => {
    if (appLoading) return;

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const token = localStorage.getItem("access_token");
    const isProtectedRoute = ['/dashboard', '/transactions', '/accounts', '/categories', '/budgets', '/reports'].includes(location.pathname);

    if (token && auth.isAuthenticated) {
      if (isAuthPage) {
        navigate('/', { replace: true });
      }
    } else if (!token || !auth.isAuthenticated) {
      if (isProtectedRoute) {
        navigate('/login', { replace: true });
      }
    }
  }, [location.pathname, navigate, appLoading, auth.isAuthenticated]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const interval = setInterval(() => {
      addNotification(null);
    }, 30000);

    return () => clearInterval(interval);
  }, [auth, addNotification]);

  return (
    <>
      {appLoading ? (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <Spin size="large" />
          <div>Vui lòng đợi nội dung đang tải!</div>
        </div>
      ) : (
        <div>
          <Header />
          <div style={{
            marginTop: '64px', // Đẩy nội dung xuống dưới header cố định
            // padding: '24px',
            backgroundColor: '#f0f2f5',
            minHeight: 'calc(100vh - 64px)' // Đảm bảo nội dung tối thiểu bằng màn hình trừ header
          }}>
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;