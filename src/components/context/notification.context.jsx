import React, { createContext, useState, useEffect, useContext } from 'react';
import { getNotificationsApi, markNotificationAsReadApi, deleteNotificationApi } from '../../util/api';
import { AuthContext } from './auth.context';
import { notification } from 'antd';

// Tạo NotificationContext
export const NotificationContext = createContext();

// Tạo NotificationProvider
export const NotificationProvider = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    // Hàm lấy thông báo từ backend
    const fetchNotifications = async () => {
        if (!auth.isAuthenticated) {
            setNotifications([]);
            return;
        }
        try {
            const res = await getNotificationsApi();
            if (Array.isArray(res)) {
                setNotifications(res.map(item => ({
                    id: item._id,
                    message: item.message,
                    timestamp: new Date(item.createdAt),
                    isRead: item.isRead
                })));
            } else {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể lấy danh sách thông báo"
                });
                setNotifications([]);
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi lấy danh sách thông báo"
            });
            setNotifications([]);
        }
    };

    // Lấy thông báo khi component mount và khi auth thay đổi
    useEffect(() => {
        fetchNotifications();
    }, [auth]);

    // Hàm thêm thông báo mới (từ các action như tạo/cập nhật giao dịch, ngân sách)
    const addNotification = (message) => {
        fetchNotifications(); // Làm mới danh sách thông báo từ backend
    };

    // Hàm đánh dấu thông báo là đã đọc
    const markAsRead = async (notificationId) => {
        try {
            const res = await markNotificationAsReadApi(notificationId);
            if (res.message === "Đã đánh dấu thông báo là đã đọc") {
                setNotifications(prev =>
                    prev.map(item =>
                        item.id === notificationId ? { ...item, isRead: true } : item
                    )
                );
            } else {
                notification.error({
                    message: "Thất bại",
                    description: res.message || "Không thể đánh dấu thông báo là đã đọc"
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi đánh dấu thông báo là đã đọc"
            });
        }
    };

    // Hàm xóa thông báo
    const deleteNotification = async (notificationId) => {
        try {
            const res = await deleteNotificationApi(notificationId);
            if (res.message === "Đã xóa thông báo thành công") {
                setNotifications(prev => prev.filter(item => item.id !== notificationId));
            } else {
                notification.error({
                    message: "Thất bại",
                    description: res.message || "Không thể xóa thông báo"
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi xóa thông báo"
            });
        }
    };

    // Hàm xóa tất cả thông báo
    const clearNotifications = async () => {
        try {
            for (const noti of notifications) {
                await deleteNotificationApi(noti.id);
            }
            setNotifications([]);
            notification.success({
                message: "Thành công",
                description: "Đã xóa tất cả thông báo"
            });
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi xóa tất cả thông báo"
            });
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, deleteNotification, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};