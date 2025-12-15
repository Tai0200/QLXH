import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, Typography, Checkbox, Space, Flex } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../libraries/hook';
import { updateRole } from '../../stores/roleSlice';
import { RoleType } from '../../dataTypes/dataTypes';
import './AddRole.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface UpdateRoleProps {
  role: RoleType;
  onBack: () => void;
}

const UpdateRole: React.FC<UpdateRoleProps> = ({ role, onBack }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: string[] }>(
    role.phanQuyen || {}
  );

  useEffect(() => {
    form.setFieldsValue({
      tenVaiTro: role.tenVaiTro,
      moTa: role.moTa
    });
    if (role.phanQuyen) {
      setSelectedPermissions(role.phanQuyen);
    }
  }, [role, form]);

  const handlePermissionChange = (group: string, permission: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const groupPerms = prev[group] || [];
      if (checked) {
        return { ...prev, [group]: [...groupPerms, permission] };
      } else {
        return { ...prev, [group]: groupPerms.filter(p => p !== permission) };
      }
    });
  };

  const handleSelectAll = (group: string, checked: boolean) => {
    const allPerms = ['Chức năng x', 'Chức năng y', 'Chức năng z'];
    if (checked) {
      setSelectedPermissions(prev => ({ ...prev, [group]: allPerms }));
    } else {
      setSelectedPermissions(prev => ({ ...prev, [group]: [] }));
    }
  };

  const onFinish = async (values: any) => {
    const updatedRole: RoleType = {
      ...role,
      tenVaiTro: values.tenVaiTro,
      moTa: values.moTa || '',
      phanQuyen: selectedPermissions
    };

    await dispatch(updateRole(updatedRole));
    onBack();
  };

  return (
    <div className="add-role-container">
      <Title level={2} className="page-title">Danh sách vai trò</Title>

      <Flex gap="large" align="flex-start">
        <div style={{ flex: 1 }}>
          <Card className="add-role-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="add-role-form"
            >
              <Row gutter={48}>
                <Col span={12}>
                  <Title level={4} className="section-title">Thông tin vai trò</Title>
                  
                  <Form.Item
                    label={<span>Tên vai trò <span style={{ color: 'red' }}>*</span></span>}
                    name="tenVaiTro"
                    rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}
                  >
                    <Input placeholder="Nhập tên vai trò" size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Mô tả:"
                    name="moTa"
                  >
                    <TextArea
                      placeholder="Nhập mô tả"
                      rows={4}
                      size="large"
                    />
                  </Form.Item>

                  <Text type="secondary" style={{ fontSize: 14 }}>
                    <span style={{ color: 'red' }}>*</span> Là trường thông tin bắt buộc
                  </Text>
                </Col>

                <Col span={12}>
                  <Title level={4} className="section-title">
                    Phân quyền chức năng <span style={{ color: 'red' }}>*</span>
                  </Title>
                  
                  <div className="permissions-section">
                    {['A', 'B'].map(group => (
                      <div key={group} className="permission-group">
                        <Title level={5} className="group-title">Nhóm chức năng {group}</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Checkbox
                            checked={selectedPermissions[`nhomChucNang${group}`]?.length === 3}
                            indeterminate={selectedPermissions[`nhomChucNang${group}`]?.length > 0 && selectedPermissions[`nhomChucNang${group}`]?.length < 3}
                            onChange={(e) => handleSelectAll(`nhomChucNang${group}`, e.target.checked)}
                          >
                            Tất cả
                          </Checkbox>
                          {['x', 'y', 'z'].map(perm => (
                            <Checkbox
                              key={perm}
                              checked={selectedPermissions[`nhomChucNang${group}`]?.includes(`Chức năng ${perm}`) || false}
                              onChange={(e) => handlePermissionChange(`nhomChucNang${group}`, `Chức năng ${perm}`, e.target.checked)}
                            >
                              Chức năng {perm}
                            </Checkbox>
                          ))}
                        </Space>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>

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

export default UpdateRole;

