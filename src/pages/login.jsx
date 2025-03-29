import React, { useContext } from 'react';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import { loginApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { MailOutlined, LockOutlined } from '@ant-design/icons'; // Thêm biểu tượng
import '../styles/login.css';
import bg from '../assets/bg_login.svg';
import logo from '../assets/logo.svg';


const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;

        const res = await loginApi(email, password);

        if (res && res.EC === 0) {
            localStorage.setItem("access_token", res.access_token);
            notification.success({
                message: "ĐĂNG NHẬP",
                description: "Success"
            });
            setAuth({
                isAuthenticated: true,
                user: {
                    email: res?.user?.email ?? "",
                    name: res?.user?.name ?? ""
                }
            });
            navigate("/");
        } else {
            notification.error({
                message: "ĐĂNG NHẬP",
                description: res?.EM ?? "Lỗi"
            });
        }
    };

    return (
        <div style={{ backgroundColor: '#E6F0FA', minHeight: '100vh' }}>
            <Row style={{ minHeight: '100vh', alignItems: 'center' }}>
                {/* Bên trái: Hình minh họa */}
                <Col xs={0} md={12} style={{ padding: '40px' }}>
                    <div style={{ textAlign: 'center' }}>
                        {/* Thay bằng hình minh họa thực tế của SAPO */}
                        <img
                            src={bg}
                            alt="Hình minh họa"
                            style={{ maxWidth: '100%', marginBottom: '20px' }}
                        />
                        <p style={{ fontSize: '16px', color: '#333' }}>
                            Phần mềm quản lý dịch vụ, ứng dụng để sử dụng nhất<br />
                            Tính tiền nhanh chóng & vận hành ổn định với phần mềm<br />
                            quản lý quán ăn được 230.000+ khách hàng tin dùng
                        </p>
                        <p style={{ fontSize: '14px', color: '#666' }}>
                            Tổng đài hỗ trợ: 1900 6750<br />
                            8h00 - 22h00 từ thứ 2 đến chủ nhật
                        </p>
                    </div>
                </Col>

                {/* Bên phải: Form đăng nhập */}
                <Col xs={24} md={12} style={{ padding: '40px' }}>
                    <div style={{
                        maxWidth: '400px',
                        margin: '0 auto',
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                        {/* Logo SAPO */}
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <img
                                src={logo}
                                alt="Logo web"
                                style={{ maxWidth: '100px' }}
                            />
                        </div>

                        {/* Form đăng nhập */}
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Email"
                                    style={{
                                        height: '40px',
                                        borderRadius: '5px',
                                        padding: '10px'
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu!',
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Mật khẩu"
                                    style={{
                                        height: '40px',
                                        borderRadius: '5px',
                                        padding: '10px'
                                    }}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        backgroundColor: '#0052CC',
                                        borderColor: '#0052CC',
                                        borderRadius: '5px',
                                        fontSize: '16px'
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>

                        {/* Liên kết Quên mật khẩu và Đăng ký */}
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            Bạn chưa có tài khoản? <Link to="/register" style={{ color: '#1890FF' }}>Đăng ký</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default LoginPage;