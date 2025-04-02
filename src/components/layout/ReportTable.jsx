import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { getDashboardTableApi } from "../../util/api";

const ReportTable = ({ year }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        { title: 'Tháng', dataIndex: 'month', key: 'month' },
        {
            title: 'Thu',
            dataIndex: 'income',
            key: 'income',
            render: (income) => income.formatted,
        },
        {
            title: 'Chi',
            dataIndex: 'expense',
            key: 'expense',
            render: (expense) => expense.formatted,
        },
        {
            title: 'Số dư',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance) => balance.formatted,
        },
    ];

    const fetchTableData = async (selectedYear) => {
        setIsLoading(true);
        try {
            const response = await getDashboardTableApi(selectedYear);
            const tableData = response.DT.tableData;
            setData(tableData.map((item, index) => ({ ...item, key: index })));
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bảng:", error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTableData(year);
    }, [year]);

    return (
        <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <Table
                columns={columns}
                dataSource={data}
                loading={isLoading}
                pagination={false}
                style={{ width: '100%', height: '100%' }}
                scroll={{ y: 'calc(100vh - 300px)' }} // Đảm bảo bảng có thể cuộn nếu nội dung dài
            />
        </div>
    );
};

export default ReportTable;