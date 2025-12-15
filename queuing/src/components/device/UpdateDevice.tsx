import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Typography, Space, Row, Col, Tag } from 'antd';
import { useAppDispatch } from '../../libraries/hook';
import { updateDevice } from '../../stores/deviceSlice';
import { DeviceType } from '../../dataTypes/dataTypes';
import './UpdateDevice.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface UpdateDeviceProps {
  device: DeviceType;
  onBack: () => void;
}

const UpdateDevice: React.FC<UpdateDeviceProps> = ({ device, onBack }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [services, setServices] = useState<string[]>([]);

  // Parse services from device.dichVuSuDung
  useEffect(() => {
    if (device.dichVuSuDung) {
      const servicesList = device.dichVuSuDung.split(',').map(s => s.trim()).filter(s => s);
      setServices(servicesList);
      form.setFieldsValue({
        maThietBi: device.maThietBi,
        tenThietBi: device.tenThietBi,
        diaChiIP: device.diaChiIP,
        loaiThietBi: device.tenThietBi || 'Kiosk',
        tenDangNhap: device.maThietBi ? `${device.maThietBi.toLowerCase().replace('_', '')}user` : 'Linhkyo011',
        matKhau: 'CMS',
      });
    }
  }, [device, form]);

  const handleRemoveService = (serviceToRemove: string) => {
    setServices(services.filter(service => service !== serviceToRemove));
  };

  const handleAddService = (value: string | undefined) => {
    if (value && !services.includes(value)) {
      setServices([...services, value]);
    }
  };

  const handleUpdateDevice = async (values: any) => {
    try {
      const updatedDevice: DeviceType & { key?: string } = {
        ...device,
        maThietBi: values.maThietBi,
        tenThietBi: values.tenThietBi,
        diaChiIP: values.diaChiIP,
        dichVuSuDung: services.join(', '),
        // Preserve key if it exists
        ...((device as any).key && { key: (device as any).key }),
      };
      await dispatch(updateDevice(updatedDevice));
      onBack();
    } catch (error) {
      console.error('Error updating device:', error);
      alert('Có lỗi xảy ra khi cập nhật thiết bị. Vui lòng thử lại.');
    }
  };

  const availableServices = [
    'Khám tim mạch',
    'Khám sản - Phụ khoa',
    'Khám răng hàm mặt',
    'Khám tai mũi họng',
    'Khám hô hấp',
    'Khám tổng quát',
    'Khám mắt',
    'Khám thận',
    'Khám chân tay',
    'Khám phụ khoa',
    'Khám hiếm muộn',
    'Khám gan',
  ];

  return (
    <div className="update-device-container">
      <Title level={2} className="page-title">Quản lý thiết bị</Title>

      <div className="update-device-card">
        <Title level={4} className="section-title">Thông tin thiết bị</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateDevice}
          className="update-device-form"
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
                <Input className="form-input" />
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
                <Input className="form-input" />
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
                <Input className="form-input" />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Dịch vụ sử dụng: <span className="required-asterisk">*</span>
                  </span>
                }
                rules={[{ required: services.length > 0, message: 'Vui lòng chọn ít nhất một dịch vụ!' }]}
              >
                <div className="services-wrapper">
                  <div className="services-tags">
                    {services.map(service => (
                      <Tag
                        key={service}
                        closable
                        onClose={() => handleRemoveService(service)}
                        className="service-tag"
                      >
                        {service}
                      </Tag>
                    ))}
                  </div>
                  <Select
                    placeholder="Thêm dịch vụ"
                    className="form-select services-select"
                    onSelect={handleAddService}
                    value={undefined}
                    dropdownClassName="services-dropdown"
                  >
                    <Option value="Tất cả">Tất cả</Option>
                    {availableServices.filter(s => !services.includes(s)).map(service => (
                      <Option key={service} value={service}>
                        {service}
                      </Option>
                    ))}
                  </Select>
                </div>
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
                <Select className="form-select">
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
                <Input className="form-input" />
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
                <Input.Password className="form-input" />
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
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateDevice;

