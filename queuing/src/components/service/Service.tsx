import React, {useState, useEffect, useMemo, useCallback} from "react";
import {Select, Table, Flex, Typography, Space, Badge,
     Input, Button, DatePicker} from 'antd';
import { useAppSelector } from "../../libraries/hook";
import type { TableProps } from 'antd';
import { ServiceType } from "../../dataTypes/dataTypes";
import {SearchOutlined, PlusOutlined} from '@ant-design/icons';
import { RootState } from "../../stores/store";
import AddService from "./AddService";
import ServiceDetail from "./ServiceDetail";
import UpdateService from "./UpdateService";
import './Service.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ServiceProps {
  view: 'list' | 'add' | 'detail' | 'update';
  selectedServiceId?: number;
  onViewChange: (view: 'list' | 'add' | 'detail' | 'update', serviceId?: number) => void;
}

const Service: React.FC<ServiceProps> = ({ view, selectedServiceId: propServiceId, onViewChange }) => {
  const serviceLst = useAppSelector((state:RootState)=>state.service);
  console.log('Service component rendered, view:', view, 'serviceLst:', serviceLst);
  const [filteredData, setFilteredData] = useState(serviceLst);
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(propServiceId);

  useEffect(() => {
    setFilteredData(serviceLst);
  }, [serviceLst]);

  useEffect(() => {
    setSelectedServiceId(propServiceId);
  }, [propServiceId]);

  useEffect(() => {
    if (view === 'list') {
      setSelectedServiceId(undefined);
    }
  }, [view]);

  const handleDetailClick = useCallback((serviceId: number) => {
    setSelectedServiceId(serviceId);
    onViewChange('detail', serviceId);
  }, [onViewChange]);

  const handleUpdateClick = useCallback((serviceId: number) => {
    setSelectedServiceId(serviceId);
    onViewChange('update', serviceId);
  }, [onViewChange]);

  const columns: TableProps<ServiceType>['columns'] = useMemo(() => [
    { title: 'Mã dịch vụ', dataIndex: 'maDichVu', key: 'maDichVu' },
    { title: 'Tên dịch vụ', dataIndex: 'tenDichVu', key: 'tenDichVu' },
    { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa' },
    {
      title: 'Trạng thái hoạt động',
      dataIndex: 'trangThaiHoatDong',
      key: 'trangThaiHoatDong',
      render: (text) => (
        <Badge
          status={text === 'Hoạt động' ? 'success' : 'error'}
          text={text}
        />
      ),
    },
    {
      title: '',
      key: 'actionDetail',
      render: (_, record: ServiceType) => {
        const serviceId = record.id || (record as any).key;
        return (
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (serviceId) {
                const idToUse = typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId;
                handleDetailClick(idToUse);
              }
            }}
            style={{ color: '#4277FF', cursor: 'pointer' }}
          >
            Chi tiết
          </a>
        );
      },
    },
    {
      title: '',
      key: 'actionUpdate',
      render: (_, record: ServiceType) => {
        const serviceId = record.id || (record as any).key;
        return (
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (serviceId) {
                const idToUse = typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId;
                handleUpdateClick(idToUse);
              }
            }}
            style={{ color: '#4277FF', cursor: 'pointer' }}
          >
            Cập nhật
          </a>
        );
      },
    },
  ], [handleDetailClick, handleUpdateClick]);

  const [searchText, setSearchText] = useState('');
  const [trangThaiHoatDong, setTrangThaiHoatDong] = useState('Tất cả');
  const [dateRange, setDateRange] = useState<any>(null);

  const handleFilter = (value: string) => {
    setTrangThaiHoatDong(value);
    applyFilters(value, searchText, dateRange);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    applyFilters(trangThaiHoatDong, value, dateRange);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    applyFilters(trangThaiHoatDong, searchText, dates);
  };

  const applyFilters = (status: string, keyword: string, dates: any) => {
    let filtered = [...serviceLst];

    if (status !== 'Tất cả') {
      filtered = filtered.filter(s => s.trangThaiHoatDong === status);
    }

    if (keyword) {
      filtered = filtered.filter(s => 
        s.maDichVu.toLowerCase().includes(keyword.toLowerCase()) ||
        s.tenDichVu.toLowerCase().includes(keyword.toLowerCase()) ||
        s.moTa.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  if (view === 'add') {
    return <AddService onBack={() => onViewChange('list')} />;
  }

  if (view === 'update') {
    const currentServiceId = selectedServiceId || propServiceId;
    if (currentServiceId) {
      const service = serviceLst.find(s => {
        const sId = s.id || (s as any).key;
        const sIdNum = typeof sId === 'string' ? parseInt(sId, 10) : sId;
        const currentIdNum = typeof currentServiceId === 'string' ? parseInt(currentServiceId, 10) : currentServiceId;
        return sIdNum === currentIdNum || String(sId) === String(currentServiceId);
      });
      if (service) {
        return (
          <UpdateService 
            service={service} 
            onBack={() => onViewChange('list')}
          />
        );
      }
    }
  }

  if (view === 'detail') {
    const currentServiceId = selectedServiceId || propServiceId;
    if (currentServiceId) {
      const service = serviceLst.find(s => {
        const sId = s.id || (s as any).key;
        const sIdNum = typeof sId === 'string' ? parseInt(sId, 10) : sId;
        const currentIdNum = typeof currentServiceId === 'string' ? parseInt(currentServiceId, 10) : currentServiceId;
        return sIdNum === currentIdNum || String(sId) === String(currentServiceId);
      });
      if (service) {
        return (
          <ServiceDetail 
            service={service} 
            onBack={() => onViewChange('list')}
            onUpdate={(service: ServiceType) => {
              const serviceId = service.id || (service as any).key;
              const idToUse = typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId;
              handleUpdateClick(idToUse);
            }}
          />
        );
      }
    }
  }

  return (
    <div className="service-list-container">
      <Title level={2} className="page-title">Quản lý dịch vụ</Title>
      <Flex gap="large" align="flex-start">
        <div style={{ flex: 1 }}>
          <div className="service-filter-section">
            <Flex justify="space-between" align="flex-start" wrap="wrap" gap="large">
              <Space size="large" wrap>
                <div style={{ minWidth: 200 }}>
                  <Text strong>Trạng thái hoạt động</Text>
                  <Select 
                    value={trangThaiHoatDong}
                    style={{ width: '100%', minWidth: 200 }}
                    onChange={handleFilter}
                    size="large"
                  >
                    <Option value="Tất cả">Tất cả</Option>
                    <Option value="Hoạt động">Hoạt động</Option>
                    <Option value="Ngưng hoạt động">Ngưng hoạt động</Option>
                  </Select>
                </div>
                <div style={{ minWidth: 200 }}>
                  <Text strong>Chọn thời gian</Text>
                  <RangePicker
                    format="DD/MM/YYYY"
                    style={{ width: '100%', minWidth: 200 }}
                    onChange={handleDateRangeChange}
                    size="large"
                  />
                </div>
              </Space>
              <div style={{ minWidth: 200, flex: 1, maxWidth: 400 }}>
                <Text strong>Từ khoá</Text>
                <Input
                  placeholder="Nhập từ khóa"
                  suffix={<SearchOutlined style={{ color: '#FF9138' }} />}
                  style={{ width: '100%' }}
                  size="large"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    if (!e.target.value) {
                      applyFilters(trangThaiHoatDong, '', dateRange);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.currentTarget.value);
                    }
                  }}
                />
              </div>
            </Flex>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            className="service-table"
            rowKey={(record) => record.id || (record as any).key || Math.random()}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
          />
        </div>

        <Button className="add-service-button" onClick={() => onViewChange('add')}>
          <div className="add-icon-wrapper">
            <PlusOutlined />
          </div>
          Thêm dịch vụ
        </Button>
      </Flex>
    </div>
  );
};

export default Service;

