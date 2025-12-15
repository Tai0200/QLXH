import React, { useState, useEffect, useMemo } from 'react';
import { Table, Flex, Typography, Space, Badge, Button, DatePicker } from 'antd';
import { DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../libraries/hook';
import type { TableProps } from 'antd';
import { QueueNumberType } from '../../dataTypes/dataTypes';
import { RootState } from '../../stores/store';
import { fetchQueueNumberList } from '../../stores/queueSlice';
import './Report.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Report: React.FC = () => {
  const dispatch = useAppDispatch();
  const queueNumberLst = useAppSelector((state: RootState) => state.queue);
  const queueArray = Array.isArray(queueNumberLst) ? queueNumberLst : [];
  const [filteredData, setFilteredData] = useState<QueueNumberType[]>(queueArray);
  const [dateRange, setDateRange] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchQueueNumberList());
  }, [dispatch]);

  useEffect(() => {
    const data = Array.isArray(queueNumberLst) ? queueNumberLst : [];
    applyDateFilter(data, dateRange);
  }, [queueNumberLst, dateRange]);

  const applyDateFilter = (data: QueueNumberType[], dates: any) => {
    if (!dates || !dates[0] || !dates[1]) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => {
      // Parse date from thoiGianCap format: "14:35 - 07/11/2021"
      const dateStr = item.thoiGianCap.split(' - ')[1];
      if (!dateStr) return false;
      
      const [day, month, year] = dateStr.split('/');
      const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      // Ant Design DatePicker returns dayjs objects
      const startDate = dates[0]?.startOf?.('day') || dates[0];
      const endDate = dates[1]?.endOf?.('day') || dates[1];
      
      const start = startDate?.toDate ? startDate.toDate() : new Date(startDate);
      const end = endDate?.toDate ? endDate.toDate() : new Date(endDate);
      
      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filtered);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

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

  const handleDownload = () => {
    // Tạo CSV content
    const headers = ['Số thứ tự', 'Tên dịch vụ', 'Thời gian cấp', 'Tình trạng', 'Nguồn cấp'];
    const rows = filteredData.map(item => [
      item.soThuTu,
      item.tenDichVu,
      item.thoiGianCap,
      item.trangThai,
      item.nguonCap
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Tạo blob và download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao_cao_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: TableProps<QueueNumberType>['columns'] = useMemo(() => [
    {
      title: (
        <span>
          Số thứ tự
          <Space style={{ marginLeft: 8 }}>
            <ArrowUpOutlined style={{ fontSize: 10, color: '#535261' }} />
            <ArrowDownOutlined style={{ fontSize: 10, color: '#535261' }} />
          </Space>
        </span>
      ),
      dataIndex: 'soThuTu',
      key: 'soThuTu',
      sorter: (a, b) => {
        const numA = parseInt(a.soThuTu.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.soThuTu.replace(/\D/g, '')) || 0;
        return numA - numB;
      },
    },
    {
      title: (
        <span>
          Tên dịch vụ
          <Space style={{ marginLeft: 8 }}>
            <ArrowUpOutlined style={{ fontSize: 10, color: '#535261' }} />
            <ArrowDownOutlined style={{ fontSize: 10, color: '#535261' }} />
          </Space>
        </span>
      ),
      dataIndex: 'tenDichVu',
      key: 'tenDichVu',
      sorter: (a, b) => a.tenDichVu.localeCompare(b.tenDichVu),
    },
    {
      title: (
        <span>
          Thời gian cấp
          <Space style={{ marginLeft: 8 }}>
            <ArrowUpOutlined style={{ fontSize: 10, color: '#535261' }} />
            <ArrowDownOutlined style={{ fontSize: 10, color: '#535261' }} />
          </Space>
        </span>
      ),
      dataIndex: 'thoiGianCap',
      key: 'thoiGianCap',
      sorter: (a, b) => {
        const dateA = new Date(a.thoiGianCap.split(' - ')[1]?.split('/').reverse().join('-') || '');
        const dateB = new Date(b.thoiGianCap.split(' - ')[1]?.split('/').reverse().join('-') || '');
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      title: (
        <span>
          Tình trạng
          <Space style={{ marginLeft: 8 }}>
            <ArrowUpOutlined style={{ fontSize: 10, color: '#535261' }} />
            <ArrowDownOutlined style={{ fontSize: 10, color: '#535261' }} />
          </Space>
        </span>
      ),
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text: string) => getStatusBadge(text),
      sorter: (a, b) => a.trangThai.localeCompare(b.trangThai),
    },
    {
      title: (
        <span>
          Nguồn cấp
          <Space style={{ marginLeft: 8 }}>
            <ArrowUpOutlined style={{ fontSize: 10, color: '#535261' }} />
            <ArrowDownOutlined style={{ fontSize: 10, color: '#535261' }} />
          </Space>
        </span>
      ),
      dataIndex: 'nguonCap',
      key: 'nguonCap',
      sorter: (a, b) => a.nguonCap.localeCompare(b.nguonCap),
    },
  ], []);

  return (
    <div className="report-container">
      <div className="report-header">
        <div>
          <Text strong className="date-label">Chọn thời gian</Text>
          <RangePicker
            format="DD/MM/YYYY"
            style={{ width: 300, display: 'block', marginTop: 8 }}
            onChange={handleDateRangeChange}
            size="large"
          />
        </div>
      </div>

      <Flex gap="large" align="flex-start" style={{ marginTop: 24 }}>
        <div style={{ flex: 1 }}>
          <Table
            columns={columns}
            dataSource={Array.isArray(filteredData) ? filteredData : []}
            className="report-table"
            rowKey={(record) => String(record.id || (record as any).key || Math.random())}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
          />
        </div>

        <Button className="download-button" onClick={handleDownload}>
          <div className="download-icon-wrapper">
            <DownloadOutlined />
          </div>
          Tải về
        </Button>
      </Flex>
    </div>
  );
};

export default Report;

