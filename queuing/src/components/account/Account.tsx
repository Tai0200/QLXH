import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Flex, Typography, Space, Button, Input, Select, Badge } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../libraries/hook';
import type { TableProps } from 'antd';
import { AccountType } from '../../dataTypes/dataTypes';
import { RootState } from '../../stores/store';
import { fetchAccountList } from '../../stores/accountSlice';
import AddAccount from './AddAccount';
import UpdateAccount from './UpdateAccount';
import './Account.css';

const { Title } = Typography;
const { Option } = Select;

interface AccountProps {
  view?: 'list' | 'add' | 'update';
  selectedAccountId?: number;
  onViewChange?: (view: 'list' | 'add' | 'update', accountId?: number) => void;
}

const Account: React.FC<AccountProps> = ({ view = 'list', selectedAccountId, onViewChange }) => {
  const dispatch = useAppDispatch();
  const accountLst = useAppSelector((state: RootState) => state.account);
  const accountArray = Array.isArray(accountLst) ? accountLst : [];
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('Tất cả');
  const [filteredData, setFilteredData] = useState<AccountType[]>(accountArray);

  useEffect(() => {
    if (view === 'list') {
      dispatch(fetchAccountList());
    }
  }, [view, dispatch]);

  useEffect(() => {
    const data = Array.isArray(accountLst) ? accountLst : [];
    let filtered = data;

    if (searchKeyword.trim() !== '') {
      filtered = filtered.filter(account =>
        account.tenDangNhap.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        account.hoTen.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        account.email.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (selectedRole !== 'Tất cả') {
      filtered = filtered.filter(account => account.vaiTro === selectedRole);
    }

    setFilteredData(filtered);
  }, [accountLst, searchKeyword, selectedRole]);

  const handleAddClick = () => {
    if (onViewChange) {
      onViewChange('add');
    }
  };

  const handleUpdateClick = useCallback((accountId: number) => {
    if (onViewChange) {
      onViewChange('update', accountId);
    }
  }, [onViewChange]);

  const getStatusBadge = (status: string) => {
    if (status === 'Hoạt động') {
      return <Badge status="success" text={status} />;
    } else if (status === 'Ngưng hoạt động') {
      return <Badge status="error" text={status} />;
    }
    return <Badge status="default" text={status} />;
  };

  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>();
    accountArray.forEach(account => {
      if (account.vaiTro) {
        roles.add(account.vaiTro);
      }
    });
    return Array.from(roles);
  }, [accountArray]);

  const columns: TableProps<AccountType>['columns'] = useMemo(() => [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'tenDangNhap',
      key: 'tenDangNhap',
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
    },
    {
      title: 'Trạng thái hoạt động',
      dataIndex: 'trangThaiHoatDong',
      key: 'trangThaiHoatDong',
      render: (text: string) => getStatusBadge(text),
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: AccountType) => (
        <a onClick={() => {
          const accountId = record.id || (record as any).key;
          if (accountId) {
            const idNum = typeof accountId === 'string' ? parseInt(accountId, 10) : accountId;
            handleUpdateClick(idNum);
          }
        }}>
          Cập nhật
        </a>
      ),
    },
  ], [handleUpdateClick]);

  if (view === 'add') {
    return <AddAccount onBack={() => onViewChange?.('list')} />;
  }

  if (view === 'update') {
    const currentAccountId = selectedAccountId;
    if (currentAccountId) {
      const account = accountArray.find(a => {
        const aId = a.id || (a as any).key;
        const aIdNum = typeof aId === 'string' ? parseInt(aId, 10) : aId;
        const currentIdNum = typeof currentAccountId === 'string' ? parseInt(currentAccountId, 10) : currentAccountId;
        return aIdNum === currentIdNum || String(aId) === String(currentAccountId);
      });
      if (account) {
        return (
          <UpdateAccount
            account={account}
            onBack={() => onViewChange?.('list')}
          />
        );
      }
    }
  }

  return (
    <div className="account-container">
      <Title level={2} className="page-title">Danh sách tài khoản</Title>

      <Flex gap="large" align="flex-start" style={{ marginTop: 24 }}>
        <div style={{ flex: 1 }}>
          <div className="account-filters">
            <div className="filter-item">
              <label className="filter-label">Tên vai trò</label>
              <Select
                value={selectedRole}
                onChange={setSelectedRole}
                className="role-select"
                size="large"
              >
                <Option value="Tất cả">Tất cả</Option>
                {uniqueRoles.map(role => (
                  <Option key={role} value={role}>{role}</Option>
                ))}
              </Select>
            </div>
            <div className="filter-item">
              <label className="filter-label">Từ khoá</label>
              <Input
                placeholder="Nhập từ khóa"
                prefix={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={Array.isArray(filteredData) ? filteredData : []}
            className="account-table"
            rowKey={(record) => String(record.id || (record as any).key || Math.random())}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
          />
        </div>

        <Button className="add-account-button" icon={<PlusOutlined />} onClick={handleAddClick}>
          Thêm tài khoản
        </Button>
      </Flex>
    </div>
  );
};

export default Account;

