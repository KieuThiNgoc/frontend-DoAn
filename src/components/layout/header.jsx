import React, { useContext, useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { Menu, Button, Drawer } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import '../../styles/header.css'
import logo from '../../assets/logo.svg'

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [current, setCurrent] = useState('mail');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const items = [
        {
            label: <Link to={"/"}><img src={logo} alt="Logo" /></Link>,
            key: 'home',
            icon: null,
        },
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/reports"}>Báo cáo</Link>,
            key: 'reports',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/budgets"}>Ngân sách</Link>,
            key: 'budgets',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/categories"}>Danh mục</Link>,
            key: 'categories',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/accounts"}>Tài khoản</Link>,
            key: 'accounts',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/transactions"}>Giao dịch</Link>,
            key: 'transactions',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/dashboard"}>Tổng quan</Link>,
            key: 'dashboard',
            icon: <UsergroupAddOutlined />,
        }] : []),
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/notifications"}>Thông báo</Link>,
            key: 'notifications',
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

    const onClick = (e) => {
        setCurrent(e.key);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <div className="mobile-menu-button">
                <Button 
                    type="text" 
                    icon={<MenuOutlined />} 
                    onClick={() => setMobileMenuOpen(true)}
                    style={{ fontSize: '24px' }}
                />
            </div>
            <Menu 
                onClick={onClick} 
                selectedKeys={[current]} 
                mode="horizontal" 
                items={items} 
                className="desktop-menu"
            />
            <Drawer
                title="Menu"
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={250}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={items}
                />
            </Drawer>
        </>
    );
};

export default Header;

