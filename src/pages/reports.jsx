import React, { useState, useCallback } from 'react';
import { notification, Button, Form, DatePicker, Card, Space, Statistic } from 'antd';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { getReportsBarChartApi, getReportsPieChartApi } from '../util/api';
import '../styles/reports.css';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

const ReportPage = () => {
    const [form] = Form.useForm();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState(null);

    const rootStyles = getComputedStyle(document.documentElement);
    const incomeColor = rootStyles.getPropertyValue('--income-color').trim();
    const expenseColor = rootStyles.getPropertyValue('--expense-color').trim();

    const fetchReportData = useCallback(async (startDate, endDate) => {
        setLoading(true);
        try {
            const barRes = await getReportsBarChartApi(startDate, endDate);
            const pieRes = await getReportsPieChartApi(startDate, endDate);

            if (barRes?.EC === 0 && pieRes?.EC === 0) {
                const columnChartData = barRes.DT.map(item => [
                    { date: item.date, value: item.income || 0, type: 'Thu nhập' },
                    { date: item.date, value: item.expense || 0, type: 'Chi tiêu' }
                ]).flat();

                const columnChartDataForRecharts = barRes.DT.map(item => ({
                    date: item.date,
                    "Thu nhập": Number(item.income) || 0,
                    "Chi tiêu": Number(item.expense) || 0,
                }));

                const pieChartData = pieRes.DT.byCategory?.map(item => ({
                    category: item.name,
                    value: item.amount
                })) || [];

                const totalIncome = barRes.DT.reduce((sum, item) => sum + item.income, 0);
                const totalExpense = pieRes.DT.totalExpense || 0;
                const balance = totalIncome - totalExpense;

                setReportData({
                    columnChartData,
                    columnChartDataForRecharts,
                    pieChartData,
                    summary: { totalIncome, totalExpense, balance }
                });
                setDateRange([startDate, endDate]);
            } else {
                notification.error({
                    message: "Lỗi",
                    description: barRes?.EM || pieRes?.EM || "Không thể lấy dữ liệu báo cáo"
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi lấy dữ liệu báo cáo"
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const onFinish = (values) => {
        const [startDate, endDate] = values.dateRange;
        fetchReportData(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    };

    const exportToExcel = useCallback(() => {
        if (!reportData || !dateRange) return;

        const [startDate, endDate] = dateRange;
        const title = `Báo cáo tài chính từ ${dayjs(startDate).format('DD/MM/YYYY')} đến ${dayjs(endDate).format('DD/MM/YYYY')}`;

        const excelData = [
            { "Tiêu đề": title },
            { "Tổng thu": reportData.summary.totalIncome, "Tổng chi": reportData.summary.totalExpense, "Số dư": reportData.summary.balance },
            {},
            { "Tiêu đề": "Chi tiết thu/chi theo ngày" },
            ...reportData.columnChartData.map(item => ({
                "Ngày": dayjs(item.date).format('DD/MM/YYYY'),
                "Loại": item.type,
                "Số tiền": item.value
            })),
            {},
            { "Tiêu đề": "Phân bổ chi tiêu theo danh mục" },
            ...reportData.pieChartData.map(item => ({
                "Danh mục": item.category,
                "Số tiền": item.value
            }))
        ];

        const ws = XLSX.utils.json_to_sheet(excelData);
        const colWidths = [
            { wch: 50 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 30 },
        ];
        ws['!cols'] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, `Bao_Cao_${startDate}_${endDate}.xlsx`);
    }, [reportData, dateRange]);

    const pieColors = ['#1890ff', '#13c2c2', '#ff4d4f', '#faad14', '#52c41a', '#eb2f96', '#722ed1', '#fadb14', '#f5222d', '#a0d911'];

    return (
        <div className="report-page-container">
            <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
            }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="inline"
                >
                    <Form.Item
                        name="dateRange"
                        label="Khoảng thời gian"
                        rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
                    >
                        <RangePicker
                            format="DD/MM/YYYY"
                            disabled={loading}
                            style={{ width: 240 }}
                        />
                    </Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Xem báo cáo
                        </Button>
                        {reportData && (
                            <Button
                                style={{ backgroundColor: '#28a745', borderColor: '#28a745', color: '#fff' }}
                                onClick={exportToExcel}
                                disabled={loading}
                            >
                                Xuất Excel
                            </Button>
                        )}
                    </Space>
                </Form>
            </div>

            {reportData && (
                <div className="report-content">
                    <Card style={{ marginBottom: 24 }}>
                        <Space size="large">
                            <Statistic
                                title="Tổng thu"
                                value={reportData.summary.totalIncome}
                                precision={0}
                                prefix="₫"
                                valueStyle={{ color: '#52c41a' }}
                                formatter={(value) => value.toLocaleString()}
                            />
                            <Statistic
                                title="Tổng chi"
                                value={reportData.summary.totalExpense}
                                precision={0}
                                prefix="₫"
                                valueStyle={{ color: '#ff4d4f' }}
                                formatter={(value) => value.toLocaleString()}
                            />
                            <Statistic
                                title="Số dư"
                                value={reportData.summary.balance}
                                precision={0}
                                prefix="₫"
                                valueStyle={{ color: '#1890ff' }}
                                formatter={(value) => value.toLocaleString()}
                            />
                        </Space>
                    </Card>

                    <div className="chart-container">
                        <Card title="Biểu đồ thu/chi" className="chart-card column-chart" style={{ marginBottom: 24 }}>
                            {reportData.columnChartDataForRecharts.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={reportData.columnChartDataForRecharts}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(text) => dayjs(text).format('YYYY-MM-DD')}
                                        />
                                        <YAxis />
                                        <RechartsTooltip
                                            formatter={(value) => (value ? value.toLocaleString() + ' VNĐ' : '0 VNĐ')}
                                        />
                                        <Legend />
                                        <Bar dataKey="Thu nhập" fill={incomeColor} />
                                        <Bar dataKey="Chi tiêu" fill={expenseColor} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#999' }}>
                                    Không có dữ liệu trong khoảng thời gian này
                                </p>
                            )}
                        </Card>
                        <Card title="Phân bổ chi tiêu" className="chart-card pie-chart">
                            {reportData.pieChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Legend
                                            layout="horizontal"
                                            verticalAlign="top"
                                            align="center"
                                        />
                                        <Pie
                                            data={reportData.pieChartData}
                                            dataKey="value"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                            labelLine={false}
                                        >
                                            {reportData.pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value) => (value ? value.toLocaleString() + ' VNĐ' : '0 VNĐ')}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#999' }}>
                                    Không có dữ liệu chi tiêu trong khoảng thời gian này
                                </p>
                            )}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportPage;