import React, { useState, useEffect } from "react";
import ReportCharts from "./ReportCharts";
import { getDashboardBarChartApi } from "../../util/api";

function BarChart({ year }) {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchChartData = async (selectedYear) => {
        setIsLoading(true);
        try {
            const response = await getDashboardBarChartApi(selectedYear);
            const data = response.DT;

            if (!data || !data.series || !data.categories) {
                throw new Error("Dữ liệu từ API không đầy đủ");
            }

            setChartData(data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
            setChartData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData(year);
    }, [year]);

    return (
        <div
            style={{
                flex: 1, // Chiếm toàn bộ không gian của container cha
                width: '100%',
                height: '100%', // Đảm bảo chiều cao full
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                className="card"
                style={{
                    flex: 1, // Chiếm toàn bộ không gian của container cha
                    width: '100%',
                    height: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    className="card-body"
                    style={{
                        flex: 1, // Chiếm toàn bộ không gian của container cha
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 0, // Loại bỏ padding mặc định để biểu đồ full không gian
                    }}
                >
                    {isLoading ? (
                        <p style={{ textAlign: 'center', flex: 1 }}>Đang tải dữ liệu...</p>
                    ) : chartData ? (
                        <ReportCharts chartData={chartData} />
                    ) : (
                        <p style={{ textAlign: 'center', flex: 1 }}>Không có dữ liệu để hiển thị</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BarChart;