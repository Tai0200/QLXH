import React, { useState } from 'react';
import { Card, Typography, Row, Col, Button, Descriptions, Flex, Table, Badge, Select, Input, DatePicker, Space } from 'antd';
import { EditOutlined, ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { ServiceType } from '../../dataTypes/dataTypes';
import './ServiceDetail.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ServiceDetailProps {
  service: ServiceType;
  onBack: () => void;
  onUpdate: (service: ServiceType) => void;
}

interface QueueNumber {
  id: number;
  soThuTu: string;
  trangThai: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack, onUpdate }) => {
  const [trangThai, setTrangThai] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<any>(null);

  // Mock data for queue numbers - in real app, this would come from API
  const mockQueueNumbers: QueueNumber[] = [
    { id: 1, soThuTu: '2010001', trangThai: 'Đã hoàn thành' },
    { id: 2, soThuTu: '2010002', trangThai: 'Đã hoàn thành' },
    { id: 3, soThuTu: '2010003', trangThai: 'Đang thực hiện' },
    { id: 4, soThuTu: '2010004', trangThai: 'Vắng' },
    { id: 5, soThuTu: '2010005', trangThai: 'Đã hoàn thành' },
    { id: 6, soThuTu: '2010006', trangThai: 'Đang thực hiện' },
    { id: 7, soThuTu: '2010007', trangThai: 'Vắng' },
    { id: 8, soThuTu: '2010008', trangThai: 'Đã hoàn thành' },
  ];

  const [filteredQueueNumbers, setFilteredQueueNumbers] = useState(mockQueueNumbers);

  const handleFilterChange = (value: string) => {
    setTrangThai(value);
    applyFilters(value, searchText, dateRange);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    applyFilters(trangThai, value, dateRange);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    applyFilters(trangThai, searchText, dates);
  };

  const applyFilters = (status: string, keyword: string, dates: any) => {
    let filtered = [...mockQueueNumbers];

    if (status !== 'Tất cả') {
      filtered = filtered.filter(q => q.trangThai === status);
    }

    if (keyword) {
      filtered = filtered.filter(q => 
        q.soThuTu.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setFilteredQueueNumbers(filtered);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Đã hoàn thành') {
      return <Badge status="success" text={status} />;
    } else if (status === 'Đang thực hiện') {
      return <Badge status="processing" text={status} />;
    } else {
      return <Badge status="default" text={status} />;
    }
  };

  const columns = [
    {
      title: 'Số thứ tự',
      dataIndex: 'soThuTu',
      key: 'soThuTu',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text: string) => getStatusBadge(text),
    },
  ];

  return (
    <div className="service-detail-container">
      <Title level={2} className="page-title">Quản lý dịch vụ</Title>

      <Row gutter={24}>
        <Col span={12}>
          <Card className="service-detail-card" style={{ marginBottom: 24 }}>
            <Title level={4} className="section-title">Thông tin dịch vụ</Title>
            <Descriptions column={1} className="service-descriptions" bordered={false}>
              <Descriptions.Item label="Mã dịch vụ:">
                <span className="detail-value">{service.maDichVu}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Tên dịch vụ:">
                <span className="detail-value">{service.tenDichVu}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả:">
                <span className="detail-value">{service.moTa || 'Chuyên các bệnh lý về tim'}</span>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card className="service-detail-card">
            <Title level={4} className="section-title">Quy tắc cấp số</Title>
            <Descriptions column={1} className="service-descriptions" bordered={false}>
              <Descriptions.Item label="Tăng tự động:">
                <span className="detail-value">
                  {service.tuSo || '0001'} đến {service.denSo || '9999'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Prefix:">
                <span className="detail-value">{service.prefix || '0001'}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Reset mỗi ngày:">
                <span className="detail-value">
                  {service.resetMoiNgay ? 'Có' : 'Không'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ví dụ:">
                <span className="detail-value">201-2001</span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Flex justify="space-between" align="flex-start" wrap="wrap" gap="large" style={{ marginBottom: 24 }}>
            <Space size="large" wrap>
              <div style={{ minWidth: 200 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Trạng thái</Text>
                <Select 
                  value={trangThai}
                  style={{ width: '100%', minWidth: 200 }}
                  onChange={handleFilterChange}
                  size="large"
                >
                  <Option value="Tất cả">Tất cả</Option>
                  <Option value="Đã hoàn thành">Đã hoàn thành</Option>
                  <Option value="Đang thực hiện">Đang thực hiện</Option>
                  <Option value="Vắng">Vắng</Option>
                </Select>
              </div>
              <div style={{ minWidth: 200 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Chọn thời gian</Text>
                <RangePicker
                  format="DD/MM/YYYY"
                  style={{ width: '100%', minWidth: 200 }}
                  onChange={handleDateRangeChange}
                  size="large"
                />
              </div>
            </Space>
            <div style={{ minWidth: 200, flex: 1, maxWidth: 400 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Từ khoá</Text>
              <Input
                placeholder="Nhập từ khóa"
                suffix={<SearchOutlined style={{ color: '#FF9138' }} />}
                style={{ width: '100%' }}
                size="large"
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>
          </Flex>

          <Table
            columns={columns}
            dataSource={filteredQueueNumbers}
            className="queue-table"
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
          />

          <Flex gap="middle" style={{ marginTop: 24 }}>
            <Button 
              className="update-list-button" 
              icon={<EditOutlined />}
              onClick={() => onUpdate(service)}
              size="large"
            >
              Cập nhật danh sách
            </Button>
            <Button 
              className="back-button" 
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              size="large"
            >
              Quay lại
            </Button>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default ServiceDetail;

