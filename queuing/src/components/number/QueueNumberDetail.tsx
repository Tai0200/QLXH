import React from 'react';
import { Card, Typography, Row, Col, Button, Descriptions, Flex, Badge } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { QueueNumberType } from '../../dataTypes/dataTypes';
import './QueueNumberDetail.css';

const { Title, Text } = Typography;

interface QueueNumberDetailProps {
  queueNumber: QueueNumberType;
  onBack: () => void;
}

const QueueNumberDetail: React.FC<QueueNumberDetailProps> = ({ queueNumber, onBack }) => {
  const getStatusBadge = (status: string) => {
    if (status === 'Đang chờ') {
      return <Badge status="processing" text={status} />;
    } else if (status === 'Đã sử dụng') {
      return <Badge status="default" text={status} />;
    } else if (status === 'Bỏ qua') {
      return <Badge status="error" text={status} />;
    }
    return <Badge status="default" text={status} />;
  };

  return (
    <div className="queue-number-detail-container">
      <Title level={2} className="page-title">Quản lý cấp số</Title>

      <Flex gap="large" align="flex-start">
        <div style={{ flex: 1 }}>
          <Card className="queue-detail-card">
            <Title level={4} className="section-title">Thông tin cấp số</Title>
            <Row gutter={48}>
              <Col span={12}>
                <Descriptions column={1} className="queue-descriptions" bordered={false}>
                  <Descriptions.Item label="Họ tên:">
                    <span className="detail-value">{queueNumber.tenKhachHang}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên dịch vụ:">
                    <span className="detail-value">{queueNumber.tenDichVu}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số thứ tự:">
                    <span className="detail-value">{queueNumber.soThuTu}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian cấp:">
                    <span className="detail-value">{queueNumber.thoiGianCap}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Hạn sử dụng:">
                    <span className="detail-value">{queueNumber.hanSuDung}</span>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1} className="queue-descriptions" bordered={false}>
                  <Descriptions.Item label="Nguồn cấp:">
                    <span className="detail-value">{queueNumber.nguonCap}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái:">
                    {getStatusBadge(queueNumber.trangThai)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại:">
                    <span className="detail-value">{queueNumber.soDienThoai || '0948523623'}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ Email:">
                    <span className="detail-value">{queueNumber.email || 'nguyendung@gmail.com'}</span>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </div>

        <Button className="back-button" icon={<ArrowLeftOutlined />} onClick={onBack}>
          Quay lại
        </Button>
      </Flex>
    </div>
  );
};

export default QueueNumberDetail;

