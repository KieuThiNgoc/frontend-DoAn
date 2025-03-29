import React, { useContext, useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import '../../styles/header.css'
import logo from '../../assets/logo.svg'

const Header = () => {

    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    console.log(">>> check auth: ", auth)
    const items = [
        {
            label: <Link to={"/"}><img
            src= {logo}
            alt="Logo"
        /></Link>,
            key: 'home',
            icon: null,
        },
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/reports"}>Báo cáo</Link>,
            key: 'report',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/budgets"}>Ngân sách</Link>,
            key: 'budget',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/categories"}>Danh mục</Link>,
            key: 'category',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/accounts"}>Tài khoản</Link>,
            key: 'account',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/transactions"}>Giao dịch</Link>,
            key: 'transaction',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/dashboard"}>Tổng quan</Link>,
            key: 'dashboard',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/notifications"}>Thông báo</Link>,
            key: 'notification',
            icon: <UsergroupAddOutlined />,
        }] : []),

        {
            label: auth.isAuthenticated ? `Xin chào, ${auth?.user?.name ?? ""}` : 'Tài khoản',
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                ...(auth.isAuthenticated ? [{
                    label: <span onClick={() => {
                        localStorage.clear("access_token");
                        setCurrent("home");
                        setAuth({
                            isAuthenticated: false,
                            user: {
                                email: "",
                                name: ""
                            }
                        })
                        navigate("/");

                    }}>Đăng xuất</span>,
                    key: 'logout',
                }] : [
                    {
                        label: <Link to={"/login"}>Đăng nhập</Link>,
                        key: 'login',
                    }
                ]),
            ],
        },

    ];

    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default Header;

