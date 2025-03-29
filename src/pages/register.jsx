import React from 'react';
import { Button, Form, Input, notification, Avatar } from 'antd';
import { createUserApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import '../styles/register.css'
import logo from '../assets/logo.svg';
const RegisterPage = () => {

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const { name, email, password } = values;
            const res = await createUserApi(name, email, password);
            console.log("API Response:", res);

            // Check if res.data is null (indicates email exists)
            if (res && res.data !== null) {
                notification.success({
                    message: 'Đăng ký thành công!',
                    description: 'Vui lòng đăng nhập để tiếp tục',
                });
                navigate('/login');
            } else {
                notification.error({
                    message: 'Đăng ký thất bại!',
                    description: 'Email đã tồn tại, vui lòng sử dụng email khác',
                });
            }
        } catch (error) {
            console.error("Register error:", error);
            notification.error({
                message: 'Đăng ký thất bại!',
                description: 'Có lỗi xảy ra, vui lòng thử lại sau',
            });
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="register-container" style={{ backgroundColor: '#E6F0FA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="register-box" style={{
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px',
                width: '100%',
            }}>
                {/* Logo SAPO */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src={logo}
                        alt="Logo web"
                        style={{ maxWidth: '100px' }}
                    />
                </div>

                {/* Tiêu đề */}
               

                {/* Form đăng ký */}
                <Form
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ tên của bạn!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Họ tên của bạn"
                            className="register-input"
                            style={{
                                height: '40px',
                                borderRadius: '20px',
                                padding: '10px 20px',
                                fontSize: '14px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!',
                            },
                            {
                                type: 'email',
                                message: 'Email không hợp lệ!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Email"
                            className="register-input"
                            style={{
                                height: '40px',
                                borderRadius: '20px',
                                padding: '10px 20px',
                                fontSize: '14px',
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
                            placeholder="Mật khẩu"
                            className="register-input"
                            style={{
                                height: '40px',
                                borderRadius: '20px',
                                padding: '10px 20px',
                                fontSize: '14px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="register-button"
                            style={{
                                width: '100%',
                                height: '40px',
                                borderRadius: '20px',
                                fontSize: '16px',
                                background: 'linear-gradient(272.65deg, #0cceb0 20.05%, #2ad38b 84.62%)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <div style={{ textAlign: 'center', fontSize: '14px' }}>
                            Bạn đã có tài khoản? <Link style={{ fontWeight: '600', color: '#1890FF' }} to="/login">Đăng nhập</Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default RegisterPage;