import { notification, Table, Button, Modal, Space, Form, Input, InputNumber, Select, Spin } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { getAccountApi, createAccountApi, updateAccountApi, deleteAccountApi } from '../util/api';
import { AuthContext } from '../components/context/auth.context';

const AccountsPage = () => {
    const { auth } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    const fetchAccount = async () => {
        if (!auth.isAuthenticated) {
            setDataSource([]);
            setIsLoading(false);
            return;
        }
        try {
            const res = await getAccountApi();
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
                description: "Failed to fetch accounts"
            });
            setDataSource([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, [auth]);

    const showModal = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    const res = await createAccountApi(values.name, values.balance, values.isCash === 'offline');
                    if (res && res.EC === 0) {
                        notification.success({
                            message: "Thành công",
                            description: res.EM
                        });
                        setIsModalOpen(false);
                        form.resetFields();
                        await fetchAccount();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res?.EM || "Không thể tạo tài khoản"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi tạo tài khoản"
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
            name: record.name,
            isCash: record.isCash ? 'offline' : 'online'
        });
        setIsEditModalOpen(true);
    };

    const handleEditOk = () => {
        editForm.validateFields()
            .then(async (values) => {
                try {
                    const res = await updateAccountApi(editingRecord._id, values.name, values.isCash === 'offline');
                    if (res && res.EC === 0) {
                        notification.success({
                            message: "Thành công",
                            description: res.EM
                        });
                        setIsEditModalOpen(false);
                        setEditingRecord(null);
                        editForm.resetFields();
                        await fetchAccount();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res?.EM || "Không thể cập nhật tài khoản"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi cập nhật tài khoản"
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
            content: `Bạn có chắc chắn muốn xóa phương thức "${record.name}" không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    const res = await deleteAccountApi(record._id);
                    if (res && res.EC === 0) {
                        notification.success({
                            message: "Thành công",
                            description: res.EM
                        });
                        await fetchAccount();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res?.EM || "Không thể xóa tài khoản"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi xóa tài khoản"
                    });
                }
            },
        });
    };

    const accountTypeOptions = [
        { value: 'offline', label: 'Offline' },
        { value: 'online', label: 'Online' }
    ];

    const columns = [
        {
            title: 'STT',
            render: (text, record, index) => index + 1,
            width: '60px',
            align: 'center',
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'name',
        },
        {
            title: 'Số dư',
            dataIndex: 'balance',
            render: (value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        },
        {
            title: 'Loại tài khoản',
            dataIndex: 'isCash',
            render: (value) => (value ? 'Offline' : 'Online'),
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
            const keyword = searchKeyword.toLowerCase().trim();
            return !keyword ||
                (item.name?.toLowerCase() || '').includes(keyword) ||
                (item.isCash ? 'offline' : 'online').toLowerCase().includes(keyword);
        });
    }, [dataSource, searchKeyword]);

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    return (
        <div style={{ padding: 20 }}>
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
                                placeholder="Tìm kiếm theo tên phương thức, loại tài khoản"
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                style={{ width: 300 }}
                                allowClear
                            />
                        </Space>

                        <Button type="primary" onClick={showModal} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                            <PlusCircleOutlined /> Thêm phương thức
                        </Button>
                    </div>

                    <Modal
                        title="Thêm phương thức"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="name"
                                label="Tên phương thức"
                                rules={[{ required: true, message: 'Vui lòng nhập tên phương thức!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="balance"
                                label="Số dư"
                                rules={[{ required: true, message: 'Vui lòng nhập số dư!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    min={0}
                                    step={1000}
                                    controls={false}
                                    keyboard={true}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="isCash"
                                label="Loại tài khoản"
                                rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
                                initialValue="online"
                            >
                                <Select
                                    placeholder="Chọn loại tài khoản"
                                    options={accountTypeOptions}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Sửa phương thức"
                        open={isEditModalOpen}
                        onOk={handleEditOk}
                        onCancel={handleEditCancel}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form form={editForm} layout="vertical">
                            <Form.Item
                                name="name"
                                label="Tên phương thức"
                                rules={[{ required: true, message: 'Vui lòng nhập tên phương thức!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="isCash"
                                label="Loại tài khoản"
                                rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
                            >
                                <Select
                                    placeholder="Chọn loại tài khoản"
                                    options={accountTypeOptions}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        rowKey="_id"
                        scroll={{ y: 'calc(100vh - 250px)' }}
                    />
                </>
            )}
        </div>
    );
};

export default AccountsPage;