import React, { useContext, useState } from 'react';
import {
    MenuOutlined,
    HomeOutlined,
    BarChartOutlined,
    WalletOutlined,
    TagsOutlined,
    BankOutlined,
    TransactionOutlined,
    BellOutlined,
    UserOutlined,
    InfoCircleOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { Menu, Button, Drawer, Badge, List, Dropdown } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { NotificationContext } from '../context/notification.context';
import '../../styles/header.css';
import logo from '../../assets/logo.svg';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuth } = useContext(AuthContext);
    const { notifications, markAsRead, deleteNotification, clearNotifications } = useContext(NotificationContext);
    const [current, setCurrent] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: { email: '', name: '' }
        });
        navigate("/login");
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const notificationMenu = (
        <Menu style={{ width: 350 }}>
            {notifications.length > 0 ? (
                <>
                    <Menu.ItemGroup title="Thông báo">
                        <List
                            dataSource={notifications}
                            renderItem={item => (
                                <List.Item
                                    style={{
                                        backgroundColor: item.isRead ? '#fff' : '#f0f5ff',
                                        padding: '8px 16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <div style={{ width: '100%' }}>
                                        <p style={{ margin: 0 }}>{item.message}</p>
                                        <span style={{ fontSize: '12px', color: '#888' }}>
                                            {new Date(item.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        <Button
                                            type="link"
                                            onClick={() => markAsRead(item.id)}
                                            disabled={item.isRead}
                                            style={{ padding: 0, marginRight: '16px' }}
                                        >
                                            Đánh dấu đã đọc
                                        </Button>
                                        <Button
                                            type="link"
                                            danger
                                            onClick={() => deleteNotification(item.id)}
                                            style={{ padding: 0 }}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </List.Item>
                            )}
                            style={{ maxHeight: '300px', overflowY: 'auto' }}
                        />
                    </Menu.ItemGroup>
                    <Menu.Divider />
                    <Menu.Item key="clear" onClick={clearNotifications}>
                        Xóa tất cả thông báo
                    </Menu.Item>
                </>
            ) : (
                <Menu.Item key="no-noti">Không có thông báo</Menu.Item>
            )}
        </Menu>
    );

    const fullMenuItems = [
        {
            label: <Link to={"/dashboard"}><img src={logo} alt="Logo" /></Link>,
            key: 'dashboard',
            icon: null,
        },
        {
            label: <Link to={"/reports"} style={{ textDecoration: 'none' }}>Báo cáo</Link>,
            key: 'reports',
            icon: <BarChartOutlined />,
        },
        {
            label: <Link to={"/budgets"} style={{ textDecoration: 'none' }}>Ngân sách</Link>,
            key: 'budgets',
            icon: <WalletOutlined />,
        },
        {
            label: <Link to={"/categories"} style={{ textDecoration: 'none' }}>Danh mục</Link>,
            key: 'categories',
            icon: <TagsOutlined />,
        },
        {
            label: <Link to={"/accounts"} style={{ textDecoration: 'none' }}>Tài khoản</Link>,
            key: 'accounts',
            icon: <BankOutlined />,
        },
        {
            label: <Link to={"/transactions"} style={{ textDecoration: 'none' }}>Giao dịch</Link>,
            key: 'transactions',
            icon: <TransactionOutlined />,
        },
        {
            label: (
                <Dropdown overlay={notificationMenu} trigger={['click']}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Badge size='small' count={notifications.filter(n => !n.isRead).length}>
                            <BellOutlined
                                style={{
                                    fontSize: '18px',
                                    color: current === 'notifications' ? '#1890ff' : 'inherit'
                                }}
                            />
                        </Badge>
                        <span>Thông báo</span>
                    </div>
                </Dropdown>
            ),
            key: 'notifications',
            icon: null,
        },
        {
            label: `Xin chào, ${auth?.user?.name ?? ''}`,
            key: 'SubMenu',
            icon: <UserOutlined />,
            children: [
                {
                    label: <span onClick={handleLogout}>Đăng xuất</span>,
                    key: 'logout',
                }
            ],
        },
    ];

    const homeMenuItems = [
        {
            label: <Link to={"/"}><img src={logo} alt="Logo" /></Link>,
            key: 'logo',
            icon: null,
        },
        {
            label: 'Trang chủ',
            key: 'home',
            icon: <HomeOutlined />,
            onClick: () => scrollToSection('home'),
        },
        {
            label: 'Giới thiệu',
            key: 'about',
            icon: <InfoCircleOutlined />,
            onClick: () => scrollToSection('about'),
        },
        {
            label: 'Tính năng',
            key: 'features',
            icon: <AppstoreOutlined />,
            onClick: () => scrollToSection('features'),
        },
        {
            label: <Button type="primary" onClick={() => navigate("/login")}>Đăng nhập</Button>,
            key: 'login',
            icon: null,
        },
    ];

    const onClick = (e) => {
        setCurrent(e.key);
        setMobileMenuOpen(false);
    };

    const isHomePage = location.pathname === '/';
    const menuItems = (!auth.isAuthenticated && isHomePage) ? homeMenuItems : fullMenuItems;

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
                items={menuItems}
                className="desktop-menu"
                style={{
                    display: 'flex',
                    justifyContent: (!auth.isAuthenticated && isHomePage) ? 'space-between' : 'flex-start',
                    alignItems: 'center',
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                    background: '#fff',
                    borderBottom: '1px solid #f0f0f0'
                }}
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
                    items={menuItems}
                />
            </Drawer>
        </>
    );
};

export default Header;