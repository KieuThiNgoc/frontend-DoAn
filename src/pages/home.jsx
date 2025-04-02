import React from 'react';
import { Typography } from 'antd';
import {
    FileTextOutlined,
    BarChartOutlined,
    FileExcelOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
    CalculatorOutlined,
} from '@ant-design/icons';
import '../styles/home.css';
import imageHome from '../assets/imge_home.svg';

const { Title, Paragraph } = Typography;

const HomePage = () => {
    const features = [
        {
            icon: <FileTextOutlined style={{ fontSize: '32px', color: '#0cc0df' }} />,
            title: 'Ghi chép thu chi thông minh',
            description: 'Dễ dàng tìm kiếm mọi khoản thu/chi của bạn theo từng hạng mục cụ thể.',
        },
        {
            icon: <BarChartOutlined style={{ fontSize: '32px', color: '#0cc0df' }} />,
            title: 'Báo cáo trực quan, sinh động',
            description: 'Thống kê rõ ràng, thông minh mọi khoản thu/chi của bạn.',
        },
        {
            icon: <FileExcelOutlined style={{ fontSize: '32px', color: '#0cc0df' }} />,
            title: 'Xuất khẩu dữ liệu Excel, PDF',
            description: 'Giúp bạn trích xuất thông tin nhanh chóng, dễ dàng phân tích và chia sẻ dữ liệu.',
        },
        {
            icon: <DollarOutlined style={{ fontSize: '32px', color: '#0cc0df' }} />,
            title: 'Theo dõi vay nợ',
            description: 'Ghi chép và theo dõi chặt chẽ các khoản vay nợ.',
        },
        {
            icon: <ShoppingCartOutlined style={{ fontSize: '32px', color: '#0cc0df' }} />,
            title: 'Lập danh sách mua sắm',
            description: 'Giúp bạn lên và quản lý các kế hoạch tiết kiệm chi tiêu.',
        },
        {
            icon: <CalculatorOutlined style={{ fontSize: '32px', color: '#0cc0df' }} />,
            title: 'Lập hạn mức chi tiêu',
            description: 'Giúp bạn kiểm soát chi tiêu hiệu quả mà không vượt quá ngân sách.',
        },
    ];

    return (
        <div style={{ padding: 0 }}>
            {/* Section 1: Trang chủ */}
            <section
                id="home"
                style={{
                    minHeight: '100vh',
                    padding: '20px 40px',
                    background: '#2a90fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        maxWidth: '1200px',
                        width: '100%',
                        gap: '40px',
                    }}
                >
                    {/* Phần văn bản bên trái */}
                    <div style={{ flex: 1, textAlign: 'center', color: '#fff' }}>
                        <Title
                            level={1}
                            style={{
                                color: '#fff',
                                fontSize: '56px',
                                fontWeight: 'bold',
                                marginBottom: '16px',
                            }}
                        >
                            Sổ Thu Chi VÍVUI
                        </Title>
                        <Paragraph
                            style={{
                                color: '#fff',
                                fontSize: '18px',
                                lineHeight: '1.6',
                            }}
                        >
                            Chọn VÍVUI để quản lý tài chính một cách hiệu quả và tối ưu, quản lý tiền bạc nhẹ nhàng, vui vẻ
                        </Paragraph>
                    </div>

                    {/* Phần hình ảnh bên phải */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={imageHome}
                            alt="Home"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Tính năng */}
            <section
                id="features"
                style={{
                    minHeight: '100vh',
                    padding: '40px 20px',
                    background: '#fff1f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Title level={2} style={{ marginBottom: '16px' }}>
                    Tính năng nổi bật
                </Title>
                <Paragraph
                    style={{
                        maxWidth: '800px',
                        fontSize: '16px',
                        color: '#666',
                        marginBottom: '40px',
                    }}
                >
                    Việc quản lý thu chi cá nhân trở nên tiện lợi với những tính năng đa dạng của VÍVUI
                </Paragraph>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                        maxWidth: '1200px',
                        width: '100%',
                    }}
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                background: '#fff',
                                padding: '24px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                textAlign: 'left',
                            }}
                        >
                            <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
                            <Title level={4} style={{ fontSize: '18px', marginBottom: '8px' }}>
                                {feature.title}
                            </Title>
                            <Paragraph style={{ fontSize: '14px', color: '#666' }}>
                                {feature.description}
                            </Paragraph>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;