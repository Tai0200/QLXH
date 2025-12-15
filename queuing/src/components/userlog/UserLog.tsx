import React, { useState, useEffect, useMemo } from 'react';
import { Table, Typography, Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../libraries/hook';
import type { TableProps } from 'antd';
import { UserLogType } from '../../dataTypes/dataTypes';
import { RootState } from '../../stores/store';
import { fetchUserLogList } from '../../stores/userLogSlice';
import './UserLog.css';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const UserLog: React.FC = () => {
  const dispatch = useAppDispatch();
  const userLogLst = useAppSelector((state: RootState) => state.userLog);
  const logArray = Array.isArray(userLogLst) ? userLogLst : [];
  const [filteredData, setFilteredData] = useState<UserLogType[]>(logArray);
  const [dateRange, setDateRange] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  useEffect(() => {
    dispatch(fetchUserLogList());
  }, [dispatch]);

  useEffect(() => {
    const data = Array.isArray(userLogLst) ? userLogLst : [];
    let filtered = data;

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(item => {
        const dateStr = item.thoiGianTacDong.split(' ')[0];
        if (!dateStr) return false;
        
        const [day, month, year] = dateStr.split('/');
        const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        const startDate = dateRange[0]?.startOf?.('day') || dateRange[0];
        const endDate = dateRange[1]?.endOf?.('day') || dateRange[1];
        
        const start = startDate?.toDate ? startDate.toDate() : new Date(startDate);
        const end = endDate?.toDate ? endDate.toDate() : new Date(endDate);
        
        return itemDate >= start && itemDate <= end;
      });
    }

    // Filter by keyword
    if (searchKeyword.trim() !== '') {
      filtered = filtered.filter(item =>
        item.tenDangNhap.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.thaoTacThucHien.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.ipThucHien.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [userLogLst, dateRange, searchKeyword]);

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const columns: TableProps<UserLogType>['columns'] = useMemo(() => [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'tenDangNhap',
      key: 'tenDangNhap',
    },
    {
      title: 'Thời gian tác động',
      dataIndex: 'thoiGianTacDong',
      key: 'thoiGianTacDong',
    },
    {
      title: 'IP thực hiện',
      dataIndex: 'ipThucHien',
      key: 'ipThucHien',
    },
    {
      title: 'Thao tác thực hiện',
      dataIndex: 'thaoTacThucHien',
      key: 'thaoTacThucHien',
    },
  ], []);

  return (
    <div className="user-log-container">
      <div className="user-log-filters">
        <div className="filter-item">
          <Text strong className="filter-label">Chọn thời gian</Text>
          <RangePicker
            format="DD/MM/YYYY"
            style={{ width: 300, display: 'block', marginTop: 8 }}
            onChange={handleDateRangeChange}
            size="large"
          />
        </div>
        <div className="filter-item">
          <Text strong className="filter-label">Từ khoá</Text>
          <Input
            placeholder="Nhập từ khóa"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
            size="large"
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(filteredData) ? filteredData : []}
        className="user-log-table"
        rowKey={(record) => String(record.id || (record as any).key || Math.random())}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          position: ['bottomCenter'],
        }}
      />
    </div>
  );
};

export default UserLog;

