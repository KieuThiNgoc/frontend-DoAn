import React, { useState, useCallback } from 'react';
import { notification, Button, Form, DatePicker, Card, Row, Col, Table, Result } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { getReportsPieChartApi } from '../util/api';
import '../styles/reports.css';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

const ReportPage = () => {
    const [form] = Form.useForm();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState(null);

    const fetchReportData = useCallback(async (startDate, endDate) => {
        setLoading(true);
        try {
            const pieRes = await getReportsPieChartApi(startDate, endDate);
            console.log("API Response:", pieRes);

            if (pieRes?.EC === 0) {
                const pieChartExpenseData = pieRes.DT.expenseByCategory?.map(item => ({
                    category: item.name,
                    value: item.amount,
                    transactions: item.transactions // Lưu chi tiết giao dịch
                })) || [];
                const pieChartIncomeData = pieRes.DT.incomeByCategory?.map(item => ({
                    category: item.name,
                    value: item.amount,
                    transactions: item.transactions // Lưu chi tiết giao dịch
                })) || [];

                setReportData({
                    pieChartIncomeData,
                    pieChartExpenseData,
                    totalIncome: pieRes.DT.totalIncome || 0,
                    totalExpense: pieRes.DT.totalExpense || 0
                });
                setDateRange([startDate, endDate]);
            } else {
                notification.error({
                    message: "Lỗi",
                    description: pieRes?.EM || "Không thể lấy dữ liệu báo cáo"
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

        // Chuẩn bị dữ liệu tổng quan
        const excelData = [
            { "Tiêu đề": title },
            { "Tổng thu": reportData.totalIncome, "Tổng chi": reportData.totalExpense },
            {},
        ];

        // Thêm phân bổ thu nhập theo danh mục và chi tiết giao dịch
        excelData.push({ "Tiêu đề": "Phân bổ thu nhập theo danh mục" });
        reportData.pieChartIncomeData.forEach(item => {
            excelData.push({
                "Danh mục": item.category,
                "Tổng tiền": item.value,
            });
            // Thêm chi tiết giao dịch
            item.transactions?.forEach(tx => {
                excelData.push({
                    "Ngày": dayjs(tx.date).format('DD/MM/YYYY'),
                    "Số tiền": tx.amount,
                    "Mô tả": tx.description || 'Không có mô tả',
                });
            });
            excelData.push({}); // Dòng trống để phân cách
        });

        // Thêm phân bổ chi tiêu theo danh mục và chi tiết giao dịch
        excelData.push({ "Tiêu đề": "Phân bổ chi tiêu theo danh mục" });
        reportData.pieChartExpenseData.forEach(item => {
            excelData.push({
                "Danh mục": item.category,
                "Tổng tiền": item.value,
            });
            // Thêm chi tiết giao dịch
            item.transactions?.forEach(tx => {
                excelData.push({
                    "Ngày": dayjs(tx.date).format('DD/MM/YYYY'),
                    "Số tiền": tx.amount,
                    "Mô tả": tx.description || 'Không có mô tả',
                });
            });
            excelData.push({}); // Dòng trống để phân cách
        });

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, `Bao_Cao_${startDate}_${endDate}.xlsx`);
    }, [reportData, dateRange]);

    const pieColors = ['#1890ff', '#13c2c2', '#ff4d4f', '#faad14', '#52c41a', '#eb2f96', '#722ed1', '#fadb14', '#f5222d', '#a0d911'];

    const incomeColumns = [
        {
            title: 'Các khoản thu',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Số tiền (VNĐ)',
            dataIndex: 'value',
            key: 'value',
            render: (value) => value.toLocaleString(),
        },
    ];

    const expenseColumns = [
        {
            title: 'Các khoản chi',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Số tiền (VNĐ)',
            dataIndex: 'value',
            key: 'value',
            render: (value) => value.toLocaleString(),
        },
    ];

    return (
        <div className="report-page-container" style={{ padding: 24 }}>
            <Form
                form={form}
                onFinish={onFinish}
                layout="inline"
                style={{ marginBottom: 24 }}
            >
                <Form.Item
                    name="dateRange"
                    label="Thời gian"
                    rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
                >
                    <RangePicker format="DD/MM/YYYY" disabled={loading} style={{ width: 240 }} />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Xem báo cáo
                </Button>
                {reportData && (
                    <Button
                        style={{ backgroundColor: '#28a745', borderColor: '#28a745', color: '#fff', marginLeft: 8 }}
                        onClick={exportToExcel}
                        disabled={loading}
                    >
                        Xuất Excel
                    </Button>
                )}
            </Form>

            {reportData && (
                <>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card
                                title={`Phân bổ thu nhập (Tổng thu: ${(reportData.totalIncome || 0).toLocaleString()} VNĐ)`}
                                className="chart-card"
                            >
                                {reportData.pieChartIncomeData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                                            <Pie
                                                data={reportData.pieChartIncomeData}
                                                dataKey="value"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                                labelLine={false}
                                            >
                                                {reportData.pieChartIncomeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                formatter={(value) => value.toLocaleString() + ' VNĐ'}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Result
                                        status="404"
                                        subTitle="Không có dữ liệu thu nhập trong khoảng thời gian này"
                                    />

                                )}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                title={`Phân bổ chi tiêu (Tổng chi: ${(reportData.totalExpense || 0).toLocaleString()} VNĐ)`}
                                className="chart-card"
                            >
                                {reportData.pieChartExpenseData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Legend layout="horizontal" verticalAlign="top" align="center" />
                                            <Pie
                                                data={reportData.pieChartExpenseData}
                                                dataKey="value"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                                labelLine={false}
                                            >
                                                {reportData.pieChartExpenseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                formatter={(value) => value.toLocaleString() + ' VNĐ'}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Result
                                        status="404"
                                        subTitle="Không có dữ liệu thu nhập trong khoảng thời gian này"
                                    />
                                )}
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 24 }}>
                        <Col span={12}>
                            <Card
                                title="Danh sách các khoản thu"
                                className="chart-card"
                                bodyStyle={{ height: '100%', padding: '24px' }} // Đảm bảo body full Card
                            >
                                <Table
                                    columns={incomeColumns}
                                    dataSource={reportData.pieChartIncomeData}
                                    pagination={false}
                                    rowKey="category"
                                    locale={{ emptyText: 'Không có dữ liệu thu nhập' }}
                                    style={{ height: '100%', width: '100%' }} // Table full Card
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                title="Danh sách các khoản chi"
                                className="chart-card"
                                bodyStyle={{ height: '100%', padding: '24px' }} // Đảm bảo body full Card
                            >
                                <Table
                                    columns={expenseColumns}
                                    dataSource={reportData.pieChartExpenseData}
                                    pagination={false}
                                    rowKey="category"
                                    locale={{ emptyText: 'Không có dữ liệu chi tiêu' }}
                                    style={{ height: '100%', width: '100%' }} // Table full Card
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default ReportPage;