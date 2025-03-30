import { notification, Table, Button, Modal, Space, Form, InputNumber, Select, DatePicker, Spin, Input } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { getBudgetsApi, createBudgetsApi, updateBudgetsApi, deleteBudgetsApi, getCategoriesApi } from '../util/api';
import { AuthContext } from '../components/context/auth.context';
import { NotificationContext } from '../components/context/notification.context';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const BudgetPage = () => {
    const { auth } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const { addNotification } = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    const fetchBudgets = async () => {
        if (!auth.isAuthenticated) {
            setDataSource([]);
            setIsLoading(false);
            return;
        }
        try {
            const res = await getBudgetsApi();
            if (Array.isArray(res)) {
                setDataSource(res);
            } else {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể lấy danh sách ngân sách"
                });
                setDataSource([]);
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi lấy danh sách ngân sách"
            });
            setDataSource([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        if (!auth.isAuthenticated) {
            setCategories([]);
            return;
        }
        try {
            const res = await getCategoriesApi();
            if (Array.isArray(res)) {
                const categoryOptions = res
                    .filter(category => category.type === 'expense')
                    .map(category => ({
                        value: category._id,
                        label: category.name
                    }));
                setCategories(categoryOptions);
            } else {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể lấy danh sách danh mục"
                });
                setCategories([]);
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Đã xảy ra lỗi khi lấy danh sách danh mục"
            });
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchBudgets();
        fetchCategories();
    }, [auth]);

    const showModal = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    const res = await createBudgetsApi(
                        values.categoryId,
                        values.amount,
                        values.dateRange[0].format('YYYY-MM-DD'),
                        values.dateRange[1].format('YYYY-MM-DD')
                    );
                    if (res.success) {
                        notification.success({
                            message: "Thành công",
                            description: res.message
                        });
                        setIsModalOpen(false);
                        form.resetFields();
                        fetchBudgets();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res.EM || res.message || "Không thể tạo ngân sách" // Thêm res.EM vào đây
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi tạo ngân sách"
                    });
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        editForm.setFieldsValue({
            amount: record.amount,
        });
        setIsEditModalOpen(true);
    };

    const handleEditOk = () => {
        editForm.validateFields()
            .then(async (values) => {
                try {
                    const res = await updateBudgetsApi(
                        editingRecord._id,
                        values.amount
                    );
                    if (res.success) {
                        notification.success({
                            message: "Thành công",
                            description: res.message
                        });
                        if (res.notificationMessage) { // Sửa res.notification thành res.notificationMessage
                            addNotification(res.notificationMessage);
                        }
                        setIsEditModalOpen(false);
                        setEditingRecord(null);
                        editForm.resetFields();
                        fetchBudgets();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res.EM || res.message || "Không thể cập nhật ngân sách" // Thêm res.EM vào đây
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi cập nhật ngân sách"
                    });
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditingRecord(null);
        editForm.resetFields();
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa ngân sách "${record.categoryName}" không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    const res = await deleteBudgetsApi(record._id);
                    if (res.success) {
                        notification.success({
                            message: "Thành công",
                            description: res.message
                        });
                        fetchBudgets();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res.message || "Không thể xóa ngân sách"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi xóa ngân sách"
                    });
                }
            },
        });
    };

    const filteredData = useMemo(() => {
        return dataSource.filter(item => {
            const keyword = searchKeyword.toLowerCase().trim();
            return !keyword || 
                (item.categoryName?.toLowerCase() || '').includes(keyword);
        });
    }, [dataSource, searchKeyword]);

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const columns = [
        {
            title: 'STT',
            render: (text, record, index) => index + 1,
            width: '60px',
            align: 'center',
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryName',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Đã chi',
            dataIndex: 'spent',
            render: (value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        },
        {
            title: 'Còn lại',
            dataIndex: 'remaining',
            render: (value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        },
        {
            title: 'Phần trăm',
            dataIndex: 'spentPercentage',
            render: (value) => `${value}%`,
        },
        {
            title: 'Chức năng',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            {isLoading ? (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <Spin size="large" />
                    <div>Vui lòng đợi nội dung đang tải!</div>
                </div>
            ) : (
                <>
                    <div style={{ 
                        marginBottom: 16,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Space>
                            <Input
                                placeholder="Tìm kiếm theo tên danh mục"
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                style={{ width: 300 }}
                                allowClear
                            />
                        </Space>

                        <Button type="primary" onClick={showModal} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                            <PlusCircleOutlined /> Thêm ngân sách
                        </Button>
                    </div>

                    <Modal
                        title="Thêm ngân sách"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="categoryId"
                                label="Danh mục"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select
                                    placeholder="Chọn danh mục"
                                    options={categories}
                                />
                            </Form.Item>
                            <Form.Item
                                name="amount"
                                label="Số tiền"
                                rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    min={0}
                                    step={1000}
                                    controls={false}
                                />
                            </Form.Item>
                            <Form.Item
                                name="dateRange"
                                label="Thời gian"
                                rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Sửa ngân sách"
                        open={isEditModalOpen}
                        onOk={handleEditOk}
                        onCancel={handleEditCancel}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form form={editForm} layout="vertical">
                            <Form.Item
                                name="amount"
                                label="Số tiền"
                                rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    min={0}
                                    step={1000}
                                    controls={false}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        rowKey="_id"
                    />
                </>
            )}
        </>
    );
};

export default BudgetPage;