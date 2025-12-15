import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Flex, Typography, Space, Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../libraries/hook';
import type { TableProps } from 'antd';
import { RoleType } from '../../dataTypes/dataTypes';
import { RootState } from '../../stores/store';
import { fetchRoleList } from '../../stores/roleSlice';
import AddRole from './AddRole';
import UpdateRole from './UpdateRole';
import './Role.css';

const { Title } = Typography;

interface RoleProps {
  view?: 'list' | 'add' | 'update';
  selectedRoleId?: number;
  onViewChange?: (view: 'list' | 'add' | 'update', roleId?: number) => void;
}

const Role: React.FC<RoleProps> = ({ view = 'list', selectedRoleId, onViewChange }) => {
  const dispatch = useAppDispatch();
  const roleLst = useAppSelector((state: RootState) => state.role);
  const roleArray = Array.isArray(roleLst) ? roleLst : [];
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filteredData, setFilteredData] = useState<RoleType[]>(roleArray);

  useEffect(() => {
    if (view === 'list') {
      dispatch(fetchRoleList());
    }
  }, [view, dispatch]);

  useEffect(() => {
    const data = Array.isArray(roleLst) ? roleLst : [];
    if (searchKeyword.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(role =>
        role.tenVaiTro.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        role.moTa.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [roleLst, searchKeyword]);

  const handleAddClick = () => {
    if (onViewChange) {
      onViewChange('add');
    }
  };

  const handleUpdateClick = useCallback((roleId: number) => {
    if (onViewChange) {
      onViewChange('update', roleId);
    }
  }, [onViewChange]);

  const columns: TableProps<RoleType>['columns'] = useMemo(() => [
    {
      title: 'Tên vai trò',
      dataIndex: 'tenVaiTro',
      key: 'tenVaiTro',
    },
    {
      title: 'Số người dùng',
      dataIndex: 'soNguoiDung',
      key: 'soNguoiDung',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: RoleType) => (
        <a onClick={() => {
          const roleId = record.id || (record as any).key;
          if (roleId) {
            const idNum = typeof roleId === 'string' ? parseInt(roleId, 10) : roleId;
            handleUpdateClick(idNum);
          }
        }}>
          Cập nhật
        </a>
      ),
    },
  ], [handleUpdateClick]);

  if (view === 'add') {
    return <AddRole onBack={() => onViewChange?.('list')} />;
  }

  if (view === 'update') {
    const currentRoleId = selectedRoleId;
    if (currentRoleId) {
      const role = roleArray.find(r => {
        const rId = r.id || (r as any).key;
        const rIdNum = typeof rId === 'string' ? parseInt(rId, 10) : rId;
        const currentIdNum = typeof currentRoleId === 'string' ? parseInt(currentRoleId, 10) : currentRoleId;
        return rIdNum === currentIdNum || String(rId) === String(currentRoleId);
      });
      if (role) {
        return (
          <UpdateRole
            role={role}
            onBack={() => onViewChange?.('list')}
          />
        );
      }
    }
  }

  return (
    <div className="role-container">
      <Title level={2} className="page-title">Danh sách vai trò</Title>

      <Flex gap="large" align="flex-start" style={{ marginTop: 24 }}>
        <div style={{ flex: 1 }}>
          <div className="role-filters">
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
            className="role-table"
            rowKey={(record) => String(record.id || (record as any).key || Math.random())}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
          />
        </div>

        <Button className="add-role-button" icon={<PlusOutlined />} onClick={handleAddClick}>
          Thêm vai trò
        </Button>
      </Flex>
    </div>
  );
};

export default Role;

