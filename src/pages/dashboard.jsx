import React, { useState } from 'react';
import { Radio, Select } from 'antd';
import BarChart from '../components/layout/barchart';
import ReportTable from '../components/layout/ReportTable';
import '../styles/dashboard.css';

const { Option } = Select;

const DashboardPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [viewMode, setViewMode] = useState('chart');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  return (
    <div className="dashboard-container">
      {/* Header: Chọn năm và chế độ xem */}
      <div className="header-container">
        <div className="year-selector">
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Năm</span>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            className="year-select"
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
      <div className="content-container">
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