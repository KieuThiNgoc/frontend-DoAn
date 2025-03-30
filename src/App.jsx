import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize"
import { useContext, useEffect } from "react"
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, appLoading, setAppLoading, auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get(`/v1/api/account`);
        if (res && !res.message) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.email,
              name: res.name
            }
          });
          // Nếu đã đăng nhập và đang ở trang login, chuyển về trang chủ
          if (location.pathname === '/login') {
            navigate('/');
          }
        } else {
          // Nếu chưa đăng nhập và không ở trang login, chuyển về trang login
          if (location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/login');
          }
        }
      } catch (error) {
        // Nếu có lỗi (chưa đăng nhập) và không ở trang login, chuyển về trang login
        if (location.pathname !== '/login' && location.pathname !== '/register') {
          navigate('/login');
        }
      }
      setAppLoading(false);
    }

    fetchAccount()
  }, [location.pathname])

  return (
    <div>
      {appLoading === true ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Spin />
        </div>
        :
        <>
          {auth.isAuthenticated && <Header />}
          <div className="main-content">
            <Outlet />
          </div>
        </>
      }
    </div>
  )
}

export default App
