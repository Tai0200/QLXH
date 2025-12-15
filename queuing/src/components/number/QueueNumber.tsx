import React, {useState, useEffect, useMemo, useCallback} from "react";
import {Select, Table, Flex, Typography, Space, Badge,
     Input, Button, DatePicker} from 'antd';
import { useAppSelector, useAppDispatch } from "../../libraries/hook";
import type { TableProps } from 'antd';
import { QueueNumberType } from "../../dataTypes/dataTypes";
import {SearchOutlined, PlusOutlined} from '@ant-design/icons';
import { RootState } from "../../stores/store";
import { fetchQueueNumberList } from "../../stores/queueSlice";
import AddQueueNumber from "./AddQueueNumber";
import QueueNumberDetail from "./QueueNumberDetail";
import './QueueNumber.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface QueueNumberProps {
  view: 'list' | 'add' | 'detail';
  selectedQueueNumberId?: number;
  onViewChange: (view: 'list' | 'add' | 'detail', queueNumberId?: number) => void;
}

const QueueNumber: React.FC<QueueNumberProps> = ({ view, selectedQueueNumberId: propQueueNumberId, onViewChange }) => {
  const dispatch = useAppDispatch();
  const queueNumberLst = useAppSelector((state:RootState)=>state.queue);
  const queueArray = Array.isArray(queueNumberLst) ? queueNumberLst : [];
  const [filteredData, setFilteredData] = useState<QueueNumberType[]>(queueArray);
  const [selectedQueueNumberId, setSelectedQueueNumberId] = useState<number | undefined>(propQueueNumberId);

  useEffect(() => {
    if (view === 'list') {
      dispatch(fetchQueueNumberList());
    }
  }, [dispatch, view]);

  useEffect(() => {
    const data = Array.isArray(queueNumberLst) ? queueNumberLst : [];
    setFilteredData(data);
  }, [queueNumberLst]);

  useEffect(() => {
    setSelectedQueueNumberId(propQueueNumberId);
  }, [propQueueNumberId]);

  useEffect(() => {
    if (view === 'list') {
      setSelectedQueueNumberId(undefined);
    }
  }, [view]);

  const handleDetailClick = useCallback((queueNumberId: number) => {
    setSelectedQueueNumberId(queueNumberId);
    onViewChange('detail', queueNumberId);
  }, [onViewChange]);

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

  const columns: TableProps<QueueNumberType>['columns'] = useMemo(() => [
    { 
      title: 'STT', 
      dataIndex: 'stt', 
      key: 'stt',
      width: 80,
    },
    { 
      title: 'Tên khách hàng', 
      dataIndex: 'tenKhachHang', 
      key: 'tenKhachHang' 
    },
    { 
      title: 'Tên dịch vụ', 
      dataIndex: 'tenDichVu', 
      key: 'tenDichVu' 
    },
    { 
      title: 'Thời gian cấp', 
      dataIndex: 'thoiGianCap', 
      key: 'thoiGianCap' 
    },
    { 
      title: 'Hạn sử dụng', 
      dataIndex: 'hanSuDung', 
      key: 'hanSuDung' 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text: string) => getStatusBadge(text),
    },
    { 
      title: 'Nguồn cấp', 
      dataIndex: 'nguonCap', 
      key: 'nguonCap' 
    },
    {
      title: '',
      key: 'actionDetail',
      width: 100,
      render: (_, record: QueueNumberType) => {
        const queueNumberId = record.id || (record as any).key;
        return (
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (queueNumberId) {
                const idToUse = typeof queueNumberId === 'string' ? parseInt(queueNumberId, 10) : queueNumberId;
                handleDetailClick(idToUse);
              }
            }}
            style={{ color: '#4277FF', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Chi tiết
          </a>
        );
      },
    },
  ], [handleDetailClick]);

  const [searchText, setSearchText] = useState('');
  const [tenDichVu, setTenDichVu] = useState('Tất cả');
  const [tinhTrang, setTinhTrang] = useState('Tất cả');
  const [nguonCap, setNguonCap] = useState('Tất cả');
  const [dateRange, setDateRange] = useState<any>(null);

  const handleFilter = (filterType: string, value: string) => {
    if (filterType === 'tenDichVu') {
      setTenDichVu(value);
      applyFilters(value, tinhTrang, nguonCap, searchText, dateRange);
    } else if (filterType === 'tinhTrang') {
      setTinhTrang(value);
      applyFilters(tenDichVu, value, nguonCap, searchText, dateRange);
    } else if (filterType === 'nguonCap') {
      setNguonCap(value);
      applyFilters(tenDichVu, tinhTrang, value, searchText, dateRange);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    applyFilters(tenDichVu, tinhTrang, nguonCap, value, dateRange);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    applyFilters(tenDichVu, tinhTrang, nguonCap, searchText, dates);
  };

  const applyFilters = (service: string, status: string, source: string, keyword: string, dates: any) => {
    const data = Array.isArray(queueNumberLst) ? queueNumberLst : [];
    let filtered = [...data];

    if (service !== 'Tất cả') {
      filtered = filtered.filter(q => q.tenDichVu === service);
    }

    if (status !== 'Tất cả') {
      filtered = filtered.filter(q => q.trangThai === status);
    }

    if (source !== 'Tất cả') {
      filtered = filtered.filter(q => q.nguonCap === source);
    }

    if (keyword) {
      filtered = filtered.filter(q => 
        q.soThuTu.toLowerCase().includes(keyword.toLowerCase()) ||
        q.tenKhachHang.toLowerCase().includes(keyword.toLowerCase()) ||
        q.tenDichVu.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  if (view === 'add') {
    return <AddQueueNumber onBack={() => onViewChange('list')} />;
  }

  if (view === 'detail') {
    const currentQueueNumberId = selectedQueueNumberId || propQueueNumberId;
    if (currentQueueNumberId) {
      const data = Array.isArray(queueNumberLst) ? queueNumberLst : [];
      const queueNumber = data.find(q => {
        const qId = q.id || (q as any).key;
        const qIdNum = typeof qId === 'string' ? parseInt(qId, 10) : qId;
        const currentIdNum = typeof currentQueueNumberId === 'string' ? parseInt(currentQueueNumberId, 10) : currentQueueNumberId;
        return qIdNum === currentIdNum || String(qId) === String(currentQueueNumberId);
      });
      if (queueNumber) {
        return (
          <QueueNumberDetail 
            queueNumber={queueNumber} 
            onBack={() => onViewChange('list')}
          />
        );
      }
    }
  }

  return (
    <div className="queue-number-list-container">
      <Title level={2} className="page-title">Quản lý cấp số</Title>
      <Flex gap="large" align="flex-start">
        <div style={{ flex: 1 }}>
          <div className="queue-filter-section">
            <Flex justify="space-between" align="flex-start" wrap="wrap" gap="large">
              <Space size="large" wrap>
                <div style={{ minWidth: 150 }}>
                  <Text strong>Tên dịch vụ</Text>
                  <Select 
                    value={tenDichVu}
                    style={{ width: '100%', minWidth: 150 }}
                    onChange={(value) => handleFilter('tenDichVu', value)}
                    size="large"
                  >
                    <Option value="Tất cả">Tất cả</Option>
                    <Option value="Khám sản - Phụ khoa">Khám sản - Phụ khoa</Option>
                    <Option value="Khám răng hàm mặt">Khám răng hàm mặt</Option>
                    <Option value="Khám tai mũi họng">Khám tai mũi họng</Option>
                    <Option value="Khám tim mạch">Khám tim mạch</Option>
                  </Select>
                </div>
                <div style={{ minWidth: 150 }}>
                  <Text strong>Tình trạng</Text>
                  <Select 
                    value={tinhTrang}
                    style={{ width: '100%', minWidth: 150 }}
                    onChange={(value) => handleFilter('tinhTrang', value)}
                    size="large"
                  >
                    <Option value="Tất cả">Tất cả</Option>
                    <Option value="Đang chờ">Đang chờ</Option>
                    <Option value="Đã sử dụng">Đã sử dụng</Option>
                    <Option value="Bỏ qua">Bỏ qua</Option>
                  </Select>
                </div>
                <div style={{ minWidth: 150 }}>
                  <Text strong>Nguồn cấp</Text>
                  <Select 
                    value={nguonCap}
                    style={{ width: '100%', minWidth: 150 }}
                    onChange={(value) => handleFilter('nguonCap', value)}
                    size="large"
                  >
                    <Option value="Tất cả">Tất cả</Option>
                    <Option value="Kiosk">Kiosk</Option>
                    <Option value="Hệ thống">Hệ thống</Option>
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
                      applyFilters(tenDichVu, tinhTrang, nguonCap, '', dateRange);
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
            dataSource={Array.isArray(filteredData) ? filteredData : []}
            className="queue-number-table"
            rowKey={(record) => String(record.id || (record as any).key || Math.random())}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
          />
        </div>

        <Button className="add-queue-button" onClick={() => onViewChange('add')}>
          <div className="add-icon-wrapper">
            <PlusOutlined />
          </div>
          Cấp số mới
        </Button>
      </Flex>
    </div>
  );
};

export default QueueNumber;

