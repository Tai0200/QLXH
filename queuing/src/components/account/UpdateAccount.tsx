import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, Typography, Select, Space, Flex } from 'antd';
import { ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../libraries/hook';
import { updateAccount } from '../../stores/accountSlice';
import { fetchRoleList } from '../../stores/roleSlice';
import { AccountType } from '../../dataTypes/dataTypes';
import { RootState } from '../../stores/store';
import './AddAccount.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface UpdateAccountProps {
  account: AccountType;
  onBack: () => void;
}

const UpdateAccount: React.FC<UpdateAccountProps> = ({ account, onBack }) => {
  const dispatch = useAppDispatch();
  const roleLst = useAppSelector((state: RootState) => state.role);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchRoleList());
    form.setFieldsValue({
      hoTen: account.hoTen,
      soDienThoai: account.soDienThoai,
      email: account.email,
      vaiTro: account.vaiTro,
      tenDangNhap: account.tenDangNhap,
      matKhau: account.matKhau || '',
      tinhTrang: account.trangThaiHoatDong
    });
  }, [account, form, dispatch]);

  const onFinish = async (values: any) => {
    const updatedAccount: AccountType = {
      ...account,
      hoTen: values.hoTen,
      soDienThoai: values.soDienThoai,
      email: values.email,
      vaiTro: values.vaiTro,
      trangThaiHoatDong: values.tinhTrang || account.trangThaiHoatDong,
      tenDangNhap: values.tenDangNhap,
      matKhau: values.matKhau || account.matKhau
    };

    await dispatch(updateAccount(updatedAccount));
    onBack();
  };

  const availableRoles = Array.isArray(roleLst) && roleLst.length > 0
    ? roleLst.map(r => r.tenVaiTro)
    : ['Kế toán', 'Quản lý', 'Admin', 'Bác sĩ', 'Lễ tân'];

  return (
    <div className="add-account-container">
      <Title level={2} className="page-title">Quản lý tài khoản</Title>

      <Flex gap="large" align="flex-start">
        <div style={{ flex: 1 }}>
          <Card className="add-account-card">
            <Title level={4} className="section-title">Thông tin tài khoản</Title>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="add-account-form"
            >
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item
                    label={<span>Họ tên <span style={{ color: 'red' }}>*</span></span>}
                    name="hoTen"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input placeholder="Nhập họ tên" size="large" />
                  </Form.Item>

                  <Form.Item
                    label={<span>Số điện thoại <span style={{ color: 'red' }}>*</span></span>}
                    name="soDienThoai"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input placeholder="Nhập số điện thoại" size="large" />
                  </Form.Item>

                  <Form.Item
                    label={<span>Email <span style={{ color: 'red' }}>*</span></span>}
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="Nhập email" size="large" />
                  </Form.Item>

                  <Form.Item
                    label={<span>Vai trò <span style={{ color: 'red' }}>*</span></span>}
                    name="vaiTro"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                  >
                    <Select placeholder="Chọn vai trò" size="large">
                      {availableRoles.map(role => (
                        <Option key={role} value={role}>{role}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label={<span>Tên đăng nhập: <span style={{ color: 'red' }}>*</span></span>}
                    name="tenDangNhap"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                  >
                    <Input placeholder="Nhập tên đăng nhập" size="large" />
                  </Form.Item>

                  <Form.Item
                    label={<span>Mật khẩu: <span style={{ color: 'red' }}>*</span></span>}
                    name="matKhau"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                  >
                    <Input.Password
                      placeholder="Nhập mật khẩu"
                      size="large"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span>Nhập lại mật khẩu: <span style={{ color: 'red' }}>*</span></span>}
                    name="confirmPassword"
                    dependencies={['matKhau']}
                    rules={[
                      { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('matKhau') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu không khớp'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Nhập lại mật khẩu"
                      size="large"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span>Tình trạng <span style={{ color: 'red' }}>*</span></span>}
                    name="tinhTrang"
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}
                  >
                    <Select size="large">
                      <Option value="Hoạt động">Hoạt động</Option>
                      <Option value="Ngưng hoạt động">Ngưng hoạt động</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Text type="secondary" style={{ fontSize: 14, marginTop: 16, display: 'block' }}>
                <span style={{ color: 'red' }}>*</span> Là trường thông tin bắt buộc
              </Text>

              <div className="form-actions">
                <Button className="cancel-button" onClick={onBack}>
                  Hủy bỏ
                </Button>
                <Button type="primary" htmlType="submit" className="submit-button">
                  Cập nhật
                </Button>
              </div>
            </Form>
          </Card>
        </div>

        <Button className="back-button" icon={<ArrowLeftOutlined />} onClick={onBack}>
          Quay lại
        </Button>
      </Flex>
    </div>
  );
};

export default UpdateAccount;

