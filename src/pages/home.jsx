import { CrownOutlined } from '@ant-design/icons';
import { Result } from 'antd';

const HomePage = () => {
    return (
        <div style={{ padding: 20 }}>
            <Result
                icon={<CrownOutlined />}
                title="Giao diện quản lý thu chi"
            />
        </div>
    )
}

export default HomePage;