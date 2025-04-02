import React, { useState } from 'react';
import { Radio, Select } from 'antd';
import BarChart from '../components/layout/barchart';
import ReportTable from '../components/layout/ReportTable';

const { Option } = Select;

const DashboardPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [viewMode, setViewMode] = useState('chart'); // 'chart' hoặc 'table'

  // Tạo danh sách năm từ 5 năm trước đến năm hiện tại
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  return (
    <div
      style={{
        padding: '24px',
        minHeight: '85vh', // Trừ đi 20px trên và 20px dưới
        backgroundColor: '#f0f2f5', // Màu nền nhẹ
        display: 'flex',
        flexDirection: 'column',
        gap: '20px', // Khoảng cách giữa các phần tử
        boxSizing: 'border-box',
      }}
    >
      {/* Header: Chọn năm và chế độ xem */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px', // Khoảng cách giữa Select và Radio
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Năm</span>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 200 }}
            placeholder="Chọn năm"
          >
            {years.map((year) => (
              <Option key={year} value={year.toString()}>
                {year}
              </Option>
            ))}
          </Select>
        </div>
        <Radio.Group
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="chart">Xem dạng biểu đồ</Radio.Button>
          <Radio.Button value="table">Xem dạng danh sách</Radio.Button>
        </Radio.Group>
      </div>

      {/* Nội dung: Biểu đồ hoặc bảng */}
      <div
        style={{
          flex: 1, // Chiếm toàn bộ không gian còn lại
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ
          width: '100%', // Full chiều rộng
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {viewMode === 'chart' ? (
          <BarChart year={selectedYear} />
        ) : (
          <ReportTable year={selectedYear} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;