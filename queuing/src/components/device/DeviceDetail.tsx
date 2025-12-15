import React from 'react';
import { Card, Typography, Row, Col, Button, Descriptions, Flex } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { DeviceType } from '../../dataTypes/dataTypes';
import './DeviceDetail.css';

const { Title, Text } = Typography;

interface DeviceDetailProps {
  device: DeviceType;
  onBack: () => void;
  onUpdate: (device: DeviceType) => void;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({ device, onBack, onUpdate }) => {
  // Derive additional fields from device data
  const loaiThietBi = device.tenThietBi || 'Kiosk';
  const tenDangNhap = device.maThietBi ? `${device.maThietBi.toLowerCase().replace('_', '')}user` : 'Linhkyo011';
  const matKhau = 'CMS';

  return (
    <div className="device-detail-container">
      <Title level={2} className="page-title">Quản lý thiết bị</Title>

      <Flex gap="large" align="flex-start">
        <div style={{ flex: 1 }}>
          <Card className="device-detail-card">
            <Title level={4} className="section-title">Thông tin thiết bị</Title>
            
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions column={1} className="device-descriptions">
                  <Descriptions.Item label="Mã thiết bị:">
                    <Text className="detail-value">{device.maThietBi}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên thiết bị:">
                    <Text className="detail-value">{device.tenThietBi}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ IP:">
                    <Text className="detail-value">{device.diaChiIP}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              <Col span={12}>
                <Descriptions column={1} className="device-descriptions">
                  <Descriptions.Item label="Loại thiết bị:">
                    <Text className="detail-value">{loaiThietBi}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên đăng nhập:">
                    <Text className="detail-value">{tenDangNhap}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Mật khẩu:">
                    <Text className="detail-value">{matKhau}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Descriptions column={1} className="device-descriptions full-width">
              <Descriptions.Item label="Dịch vụ sử dụng:">
                <Text className="detail-value">{device.dichVuSuDung}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        <Button className="update-device-button" onClick={() => onUpdate(device)}>
          <div className="update-icon-wrapper">
            <EditOutlined />
          </div>
          Cập nhật thiết bị
        </Button>
      </Flex>
    </div>
  );
};

export default DeviceDetail;

