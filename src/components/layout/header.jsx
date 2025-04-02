import React, { useContext, useState, useEffect } from 'react';
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

    // Xử lý cuộn và cập nhật tab đang chọn
    useEffect(() => {
        const isHomePage = location.pathname === '/' && !auth.isAuthenticated;
        if (!isHomePage) return;

        const sections = ['home', 'features']; // Xóa 'features'
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100; // Offset để tab thay đổi sớm hơn một chút
            let activeSection = 'home';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        activeSection = section;
                        break;
                    }
                }
            }

            setCurrent(activeSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname, auth.isAuthenticated]);

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
            const header = document.querySelector('.ant-menu-horizontal');
            const headerHeight = header ? header.offsetHeight : 64; // Chiều cao header
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let startTime = null;

            const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutQuad(progress);

                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
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
            label: 'Tính năng',
            key: 'features',
            icon: <InfoCircleOutlined />,
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