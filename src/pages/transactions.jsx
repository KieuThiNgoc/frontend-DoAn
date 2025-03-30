import { notification, Table, Button, Modal, Space, Form, Input, Select, InputNumber, DatePicker, Radio, Spin } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { getTransactionsApi, createTransactionsApi, updateTransactionsApi, deleteTransactionsApi, getAccountApi, getCategoriesApi } from '../util/api';
import dayjs from 'dayjs';
import { AuthContext } from '../components/context/auth.context';
import { NotificationContext } from '../components/context/notification.context';

const { RangePicker } = DatePicker;

const TransactionsPage = () => {
    const { auth } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const { addNotification } = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [dateRange, setDateRange] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    const typeOptions = [
        { value: 'expense', label: 'Chi tiêu' },
        { value: 'income', label: 'Thu nhập' }
    ];

    const fetchTransactions = async (startDate, endDate) => {
        if (!auth.isAuthenticated) {
            setDataSource([]);
            setIsLoading(false);
            return;
        }
        try {
            const res = await getTransactionsApi(startDate, endDate);
            if (!res?.message) {
                setDataSource(res);
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                });
                setDataSource([]);
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to fetch transactions"
            });
            setDataSource([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAccounts = async () => {
        if (!auth.isAuthenticated) {
            setAccounts([]);
            return;
        }
        try {
            const res = await getAccountApi();
            if (!res?.message) {
                const accountOptions = res.map(account => ({
                    value: account._id,
                    label: account.name,
                    balance: account.balance
                }));
                setAccounts(accountOptions);
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to fetch accounts"
            });
            setAccounts([]);
        }
    };

    const fetchCategories = async () => {
        if (!auth.isAuthenticated) {
            setCategories([]);
            return;
        }
        try {
            const res = await getCategoriesApi();
            if (!res?.message) {
                const categoryOptions = res.map(category => ({
                    value: category._id,
                    label: category.name,
                    type: category.type
                }));
                setCategories(categoryOptions);
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to fetch categories"
            });
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchAccounts();
        fetchCategories();
    }, [auth]);

    const showModal = () => {
        form.resetFields();
        fetchCategories();
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    const res = await createTransactionsApi(
                        values.amount,
                        values.type,
                        values.accountId,
                        values.categoryId,
                        values.date.format('YYYY-MM-DD'),
                        values.description
                    );
                    if (res && res.EC === 0) {
                        notification.success({
                            message: "Thành công",
                            description: res.EM
                        });
                        if (res.notification) {
                            addNotification(res.notification);
                        }
                        setIsModalOpen(false);
                        form.resetFields();
                        await fetchTransactions(
                            dateRange[0]?.format('YYYY-MM-DD'),
                            dateRange[1]?.format('YYYY-MM-DD')
                        );
                        await fetchAccounts();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res?.EM || "Không thể tạo giao dịch"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi tạo giao dịch"
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
        fetchCategories();
        editForm.setFieldsValue({
            amount: record.amount,
            type: record.type,
            accountId: record.accountId,
            categoryId: record.categoryId,
            date: dayjs(record.date),
            description: record.description
        });
        setIsEditModalOpen(true);
    };

    const handleEditOk = () => {
        editForm.validateFields()
            .then(async (values) => {
                try {
                    const res = await updateTransactionsApi(
                        editingRecord._id,
                        values.amount,
                        values.type,
                        values.accountId,
                        values.categoryId,
                        values.date.format('YYYY-MM-DD'),
                        values.description
                    );
                    if (res && res.EC === 0) {
                        notification.success({
                            message: "Thành công",
                            description: res.EM
                        });
                        if (res.notification) {
                            addNotification(res.notification);
                        }
                        setIsEditModalOpen(false);
                        setEditingRecord(null);
                        editForm.resetFields();
                        await fetchTransactions(
                            dateRange[0]?.format('YYYY-MM-DD'),
                            dateRange[1]?.format('YYYY-MM-DD')
                        );
                        await fetchAccounts();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res?.EM || "Không thể cập nhật giao dịch"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi cập nhật giao dịch"
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
            content: `Bạn có chắc chắn muốn xóa giao dịch này không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    const res = await deleteTransactionsApi(record._id);
                    if (res && res.EC === 0) {
                        notification.success({
                            message: "Thành công",
                            description: res.EM
                        });
                        if (res.notification) {
                            addNotification(res.notification);
                        }
                        await fetchTransactions(
                            dateRange[0]?.format('YYYY-MM-DD'),
                            dateRange[1]?.format('YYYY-MM-DD')
                        );
                        await fetchAccounts();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res?.EM || "Không thể xóa giao dịch"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi xóa giao dịch"
                    });
                }
            },
        });
    };

    const columns = [
        {
            title: 'STT',
            render: (text, record, index) => index + 1,
            width: '60px',
            align: 'center',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            render: (type) => type === 'expense' ? 'Chi tiêu' : 'Thu nhập'
        },
        {
            title: 'Phương thức',
            dataIndex: 'accountName',
            render: (name) => name || '',
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryName',
            render: (name) => name || '',
        },
        {
            title: 'Ngày và giờ',
            dataIndex: 'date',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
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

    const filteredData = useMemo(() => {
        return dataSource.filter(item => {
            const matchesType = filterType === 'all' || item.type === filterType;
            const keyword = searchKeyword.toLowerCase().trim();
            const matchesSearch = !keyword || (
                (item.accountName?.toLowerCase() || '').includes(keyword) ||
                (item.categoryName?.toLowerCase() || '').includes(keyword) ||
                (item.description?.toLowerCase() || '').includes(keyword)
            );
            return matchesType && matchesSearch;
        });
    }, [dataSource, filterType, searchKeyword]);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates || []);
        const start = dates ? dates[0]?.format('YYYY-MM-DD') : undefined;
        const end = dates ? dates[1]?.format('YYYY-MM-DD') : undefined;
        fetchTransactions(start, end);
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const getFilteredCategories = (selectedType) => {
        if (!selectedType) return categories;
        return categories.filter(category => category.type === selectedType);
    };

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
                            <Radio.Group value={filterType} onChange={e => setFilterType(e.target.value)}>
                                <Radio.Button value="all">Tất cả</Radio.Button>
                                <Radio.Button value="income">Thu nhập</Radio.Button>
                                <Radio.Button value="expense">Chi tiêu</Radio.Button>
                            </Radio.Group>

                            <RangePicker
                                format="DD/MM/YYYY"
                                onChange={handleDateRangeChange}
                                placeholder={['Từ ngày', 'Đến ngày']}
                            />

                            <Input
                                placeholder="Tìm kiếm theo phương thức, danh mục, mô tả"
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                style={{ width: 300 }}
                                allowClear
                            />
                        </Space>

                        <Button type="primary" onClick={showModal} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                            <PlusCircleOutlined /> Thêm giao dịch
                        </Button>
                    </div>

                    <Modal
                        title="Thêm giao dịch"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form form={form} layout="vertical">
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
                                name="type"
                                label="Loại"
                                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
                            >
                                <Select
                                    placeholder="Chọn loại"
                                    options={typeOptions}
                                />
                            </Form.Item>
                            <Form.Item
                                name="accountId"
                                label="Phương thức"
                                rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
                            >
                                <Select
                                    placeholder="Chọn phương thức"
                                    options={accounts}
                                />
                            </Form.Item>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                            >
                                {({ getFieldValue }) => (
                                    <Form.Item
                                        name="categoryId"
                                        label="Danh mục"
                                        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                                    >
                                        <Select
                                            placeholder="Chọn danh mục"
                                            options={getFilteredCategories(getFieldValue('type'))}
                                            onFocus={() => {
                                                if (!getFieldValue('type')) {
                                                    notification.warning({
                                                        message: "Chưa chọn loại",
                                                        description: "Vui lòng chọn loại giao dịch trước khi chọn danh mục."
                                                    });
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                )}
                            </Form.Item>
                            <Form.Item
                                name="date"
                                label="Ngày và giờ"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày và giờ!' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                    defaultValue={dayjs()}
                                />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Mô tả"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Sửa giao dịch"
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
                            <Form.Item
                                name="type"
                                label="Loại"
                                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
                            >
                                <Select
                                    placeholder="Chọn loại"
                                    options={typeOptions}
                                />
                            </Form.Item>
                            <Form.Item
                                name="accountId"
                                label="Phương thức"
                                rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
                            >
                                <Select
                                    placeholder="Chọn phương thức"
                                    options={accounts}
                                />
                            </Form.Item>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                            >
                                {({ getFieldValue }) => (
                                    <Form.Item
                                        name="categoryId"
                                        label="Danh mục"
                                        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                                    >
                                        <Select
                                            placeholder="Chọn danh mục"
                                            options={getFilteredCategories(getFieldValue('type'))}
                                            onFocus={() => {
                                                if (!getFieldValue('type')) {
                                                    notification.warning({
                                                        message: "Chưa chọn loại",
                                                        description: "Vui lòng chọn loại giao dịch trước khi chọn danh mục."
                                                    });
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                )}
                            </Form.Item>
                            <Form.Item
                                name="date"
                                label="Ngày và giờ"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày và giờ!' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Mô tả"
                            >
                                <Input.TextArea />
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

export default TransactionsPage;