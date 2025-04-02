import React from 'react';
import { CrownOutlined } from '@ant-design/icons';
import { Result, Typography } from 'antd';
import '../styles/home.css';

const { Title, Paragraph } = Typography;

const HomePage = () => {
    return (
        <div style={{ padding: 0 }}>
            {/* Section 1: Trang chủ */}
            <section id="home" style={{ minHeight: '100vh', padding: 20, background: '#f0f5ff' }}>
                <Result
                    icon={<CrownOutlined />}
                    title="Giao diện quản lý thu chi"
                    subTitle="Chào mừng bạn đến với ứng dụng quản lý tài chính cá nhân!"
                />
            </section>

            {/* Section 2: Giới thiệu */}
            <section id="about" style={{ minHeight: '100vh', padding: 20, background: '#fff1f0' }}>
                <Title level={2}>Giới thiệu</Title>
                <Paragraph>
                    Đây là ứng dụng giúp bạn quản lý thu chi một cách hiệu quả. Với giao diện thân thiện và các tính năng mạnh mẽ, bạn có thể dễ dàng theo dõi ngân sách, giao dịch và tài khoản của mình.
                </Paragraph>
            </section>

            {/* Section 3: Tính năng */}
            <section id="features" style={{ minHeight: '100vh', padding: 20, background: '#f6ffed' }}>
                <Title level={2}>Tính năng</Title>
                <Paragraph>
                    - Quản lý ngân sách hàng tháng<br />
                    - Theo dõi giao dịch chi tiết<br />
                    - Phân loại danh mục thu chi<br />
                    - Báo cáo tài chính trực quan
                </Paragraph>
            </section>
        </div>
    );
};

export default HomePage;