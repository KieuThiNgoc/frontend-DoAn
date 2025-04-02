import React from "react";
import Chart from 'react-apexcharts';

function ReportCharts({ chartData }) {
    if (!chartData || !chartData.series || !chartData.categories) {
        return null;
    }

    const options = {
        chart: {
            height: '100%', // Full chiều cao
            type: 'bar', // Sử dụng biểu đồ cột
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        colors: ['#2eca6a', '#ff771d'],
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: chartData.categories,
            title: { text: 'Tháng' },
        },
        yaxis: {
            title: { text: 'Số tiền (VND)' },
        },
        fill: { opacity: 1 },
        tooltip: {
            y: {
                formatter: (val) => `${val.toLocaleString('vi-VN')} VND`,
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', flex: 1 }}>
            <Chart
                options={options}
                series={chartData.series}
                type={options.chart.type}
                height="100%" // Full chiều cao
                width="100%" // Full chiều rộng
            />
        </div>
    );
}

export default ReportCharts;