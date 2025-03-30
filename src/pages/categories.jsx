import { notification, Table, Button, Modal, Space, Form, Input, Select, Spin } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { getCategoriesApi, createCategoriesApi, updateCategoriesApi, deleteCategoriesApi } from '../util/api';
import { AuthContext } from '../components/context/auth.context';

const CategoriesPage = () => {
    const { auth } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    const fetchCategory = async () => {
        if (!auth.isAuthenticated) {
            setDataSource([]);
            setIsLoading(false);
            return;
        }
        try {
            const res = await getCategoriesApi();
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
                description: "Failed to fetch categories"
            });
            setDataSource([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [auth]);

    const showModal = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const typeOptions = [
        { value: 'expense', label: 'Chi tiêu' },
        { value: 'income', label: 'Thu nhập' }
    ];

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    const res = await createCategoriesApi(values.name, values.type);
                    if (res && res.EC === 0) {
                        notification.success({
                            message: "Thành công",
                            description: res.EM
                        });
                        setIsModalOpen(false);
                        form.resetFields();
                        await fetchCategory();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res?.EM || "Không thể tạo danh mục"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi tạo danh mục"
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
            type: record.type
        });
        setIsEditModalOpen(true);
    };

    const handleEditOk = () => {
        editForm.validateFields()
            .then(async (values) => {
                try {
                    const res = await updateCategoriesApi(editingRecord._id, values.name, values.type);
                    if (res && res.EC === 0) {
                        notification.success({
                            message: "Thành công",
                            description: res.EM
                        });
                        setIsEditModalOpen(false);
                        setEditingRecord(null);
                        editForm.resetFields();
                        await fetchCategory();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res?.EM || "Không thể cập nhật danh mục"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi cập nhật danh mục"
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
            content: `Bạn có chắc chắn muốn xóa danh mục "${record.name}" không?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    const res = await deleteCategoriesApi(record._id);
                    if (res && res.EC === 0) {
                        notification.success({
                            message: "Thành công",
                            description: res.EM
                        });
                        await fetchCategory();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: res?.EM || "Không thể xóa danh mục"
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi khi xóa danh mục"
                    });
                }
            },
        });
    };

    const filteredData = useMemo(() => {
        return dataSource.filter(item => {
            const keyword = searchKeyword.toLowerCase().trim();
            return !keyword || 
                (item.name?.toLowerCase() || '').includes(keyword) ||
                (item.type === 'expense' ? 'chi tiêu' : 'thu nhập').toLowerCase().includes(keyword);
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
            title: 'Tên danh mục',
            dataIndex: 'name',
        },
        {
            title: 'Loại danh mục',
            dataIndex: 'type',
            render: (type) => type === 'expense' ? 'Chi tiêu' : 'Thu nhập'
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
                                placeholder="Tìm kiếm theo tên danh mục, loại danh mục"
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                style={{ width: 300 }}
                                allowClear
                            />
                        </Space>

                        <Button type="primary" onClick={showModal} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                            <PlusCircleOutlined /> Thêm danh mục
                        </Button>
                    </div>

                    <Modal
                        title="Thêm danh mục"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="name"
                                label="Tên danh mục"
                                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="type"
                                label="Loại danh mục"
                                rules={[{ required: true, message: 'Vui lòng chọn loại danh mục!' }]}
                            >
                                <Select
                                    placeholder="Chọn loại danh mục"
                                    options={typeOptions}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Sửa danh mục"
                        open={isEditModalOpen}
                        onOk={handleEditOk}
                        onCancel={handleEditCancel}
                        okText="Lưu"
                        cancelText="Hủy"
                    >
                        <Form form={editForm} layout="vertical">
                            <Form.Item
                                name="name"
                                label="Tên danh mục"
                                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="type"
                                label="Loại danh mục"
                                rules={[{ required: true, message: 'Vui lòng chọn loại danh mục!' }]}
                            >
                                <Select
                                    placeholder="Chọn loại danh mục"
                                    options={typeOptions}
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
        </>
    );
};

export default CategoriesPage;