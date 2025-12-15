import React from 'react';
import { Form, Input, Select, Button, Typography, Space, Row, Col } from 'antd';
import { useAppDispatch } from '../../libraries/hook';
import { addDevice } from '../../stores/deviceSlice';
import { DeviceType } from '../../dataTypes/dataTypes';
import './AddDevice.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface AddDeviceProps {
  onBack: () => void;
}

const AddDevice: React.FC<AddDeviceProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const handleAddDevice = async (values: any) => {
    const newDevice: DeviceType = {
      id: Date.now(),
      maThietBi: values.maThietBi,
      tenThietBi: values.tenThietBi,
      diaChiIP: values.diaChiIP,
      dichVuSuDung: values.dichVuSuDung,
      trangThaiHoatDong: 'Hoạt động', // Default value
      trangThaiKetNoi: 'Kết nối', // Default value
    };
    await dispatch(addDevice(newDevice));
    form.resetFields();
    onBack(); // Go back to list after adding
  };

  return (
    <div className="add-device-container">
      <Title level={2} className="page-title">Quản lý thiết bị</Title>

      <div className="add-device-card">
        <Title level={4} className="section-title">Thông tin thiết bị</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDevice}
          className="add-device-form"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Mã thiết bị: <span className="required-asterisk">*</span>
                  </span>
                }
                name="maThietBi"
                rules={[{ required: true, message: 'Vui lòng nhập mã thiết bị!' }]}
              >
                <Input placeholder="Nhập mã thiết bị" className="form-input" />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Tên thiết bị: <span className="required-asterisk">*</span>
                  </span>
                }
                name="tenThietBi"
                rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
              >
                <Input placeholder="Nhập tên thiết bị" className="form-input" />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Địa chỉ IP: <span className="required-asterisk">*</span>
                  </span>
                }
                name="diaChiIP"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ IP!' }]}
              >
                <Input placeholder="Nhập địa chỉ IP" className="form-input" />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Dịch vụ sử dụng: <span className="required-asterisk">*</span>
                  </span>
                }
                name="dichVuSuDung"
                rules={[{ required: true, message: 'Vui lòng nhập dịch vụ sử dụng!' }]}
              >
                <Input placeholder="Nhập dịch vụ sử dụng" className="form-input" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Loại thiết bị: <span className="required-asterisk">*</span>
                  </span>
                }
                name="loaiThietBi"
                rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị!' }]}
              >
                <Select 
                  placeholder="Chọn loại thiết bị" 
                  className="form-select"
                >
                  <Option value="Kiosk">Kiosk</Option>
                  <Option value="Display counter">Display counter</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Tên đăng nhập: <span className="required-asterisk">*</span>
                  </span>
                }
                name="tenDangNhap"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input placeholder="Nhập tài khoản" className="form-input" />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Mật khẩu: <span className="required-asterisk">*</span>
                  </span>
                }
                name="matKhau"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" className="form-input" />
              </Form.Item>
            </Col>
          </Row>

          <div className="required-note">
            <span className="required-asterisk">*</span>
            <Text style={{ fontSize: '14px', color: '#7E7D88', marginLeft: 4 }}>
              Là trường thông tin bắt buộc
            </Text>
          </div>

          <Form.Item className="form-buttons">
            <Space size="large">
              <Button 
                className="cancel-button" 
                onClick={onBack}
                size="large"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="submit-button"
                size="large"
              >
                Thêm thiết bị
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddDevice;