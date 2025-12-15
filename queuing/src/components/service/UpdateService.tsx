import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Typography, Space, Row, Col, Checkbox } from 'antd';
import { useAppDispatch } from '../../libraries/hook';
import { updateService } from '../../stores/serviceSlice';
import { ServiceType } from '../../dataTypes/dataTypes';
import './UpdateService.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface UpdateServiceProps {
  service: ServiceType;
  onBack: () => void;
}

const UpdateService: React.FC<UpdateServiceProps> = ({ service, onBack }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      maDichVu: service.maDichVu,
      tenDichVu: service.tenDichVu,
      moTa: service.moTa,
      trangThaiHoatDong: service.trangThaiHoatDong,
      tangTuDong: service.tangTuDong || false,
      tuSo: service.tuSo || '0001',
      denSo: service.denSo || '9999',
      prefixValue: service.prefix || '0001',
      surfixValue: service.surfix || '0001',
      resetMoiNgay: service.resetMoiNgay || false,
    });
  }, [service, form]);

  const handleUpdateService = async (values: any) => {
    const updatedService: ServiceType = {
      ...service,
      maDichVu: values.maDichVu,
      tenDichVu: values.tenDichVu,
      moTa: values.moTa || '',
      trangThaiHoatDong: values.trangThaiHoatDong || service.trangThaiHoatDong,
      tangTuDong: values.tangTuDong || false,
      tuSo: values.tuSo || '0001',
      denSo: values.denSo || '9999',
      prefix: values.prefixValue || '',
      surfix: values.surfixValue || '',
      resetMoiNgay: values.resetMoiNgay || false,
    };
    await dispatch(updateService(updatedService));
    onBack();
  };

  return (
    <div className="update-service-container">
      <Title level={2} className="page-title">Quản lý dịch vụ</Title>

      <div className="update-service-card">
        <Title level={4} className="section-title">Thông tin dịch vụ</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateService}
          className="update-service-form"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Mã dịch vụ: <span className="required-asterisk">*</span>
                  </span>
                }
                name="maDichVu"
                rules={[{ required: true, message: 'Vui lòng nhập mã dịch vụ!' }]}
              >
                <Input placeholder="Nhập mã dịch vụ" className="form-input" />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Tên dịch vụ: <span className="required-asterisk">*</span>
                  </span>
                }
                name="tenDichVu"
                rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
              >
                <Input placeholder="Nhập tên dịch vụ" className="form-input" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Mô tả:
                  </span>
                }
                name="moTa"
              >
                <TextArea 
                  rows={4} 
                  placeholder="Mô tả dịch vụ" 
                  className="form-textarea"
                />
              </Form.Item>
            </Col>
          </Row>

          <Title level={4} className="section-title" style={{ marginTop: 24 }}>Quy tắc cấp số</Title>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="tangTuDong" valuePropName="checked">
                <Checkbox>Tăng tự động từ:</Checkbox>
                <Space style={{ marginLeft: 24 }}>
                  <Form.Item name="tuSo" noStyle>
                    <Input className="form-input" style={{ width: 120 }} />
                  </Form.Item>
                  <Text>đến</Text>
                  <Form.Item name="denSo" noStyle>
                    <Input className="form-input" style={{ width: 120 }} />
                  </Form.Item>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item>
                <Checkbox name="prefix">Prefix:</Checkbox>
                <Form.Item name="prefixValue" noStyle style={{ marginLeft: 24 }}>
                  <Input className="form-input" style={{ width: 120 }} />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <Checkbox name="surfix">Surfix:</Checkbox>
                <Form.Item name="surfixValue" noStyle style={{ marginLeft: 24 }}>
                  <Input className="form-input" style={{ width: 120 }} />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="resetMoiNgay" valuePropName="checked">
                <Checkbox>Reset mỗi ngày</Checkbox>
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

export default UpdateService;

