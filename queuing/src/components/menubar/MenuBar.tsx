import React, {useEffect, useState, useCallback} from 'react';
import { useAppDispatch } from '../../libraries/hook';
import { fetchDeviceList } from '../../stores/deviceSlice';
import { fetchServiceList } from '../../stores/serviceSlice';
import { fetchQueueNumberList } from '../../stores/queueSlice';
import {
  Layout,
  Menu,
  Breadcrumb,
  Typography,
  Select,
  Input,
  Table,
  Badge,
  Button,
  Avatar,
  Space,
  Flex,
} from 'antd';
import type { MenuProps, TableProps } from 'antd';
import {
  DashboardOutlined,
  DesktopOutlined,
  MessageOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  PlusOutlined,
  SearchOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import Device from '../device/Device';
import Service from '../service/Service';
import QueueNumber from '../number/QueueNumber';
import Report from '../report/Report';
import Role from '../role/Role';
import Account from '../account/Account';
import UserLog from '../userlog/UserLog';
import './MenuBar.css';
import Dashboard from '../dashboard/Dashboard';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const menuItems: MenuItem[] = [
  getItem('Dashboard', '1', <DashboardOutlined />),
  getItem('Thiết bị', '2', <DesktopOutlined />),
  getItem('Dịch vụ', '3', <MessageOutlined />),
  getItem('Cấp số', '4', <FileTextOutlined />),
  getItem('Báo cáo', '5', <FileTextOutlined />),
  getItem('Cài đặt hệ thống', '6', <SettingOutlined />, [
    getItem('Quản lý vai trò', '6.1'),
    getItem('Quản lý tài khoản', '6.2'),
    getItem('Nhật ký người dùng', '6.3'),
  ]),
];

const MenuBar: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedSubIndex, setSelectedSubIndex] = useState<string>('');
  const [deviceView, setDeviceView] = useState<'list' | 'add' | 'detail' | 'update'>('list');
  const [serviceView, setServiceView] = useState<'list' | 'add' | 'detail' | 'update'>('list');
  const [queueView, setQueueView] = useState<'list' | 'add' | 'detail'>('list');
  const [roleView, setRoleView] = useState<'list' | 'add' | 'update'>('list');
  const [accountView, setAccountView] = useState<'list' | 'add' | 'update'>('list');
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(undefined);
  const [selectedQueueNumberId, setSelectedQueueNumberId] = useState<number | undefined>(undefined);
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(undefined);
  const [selectedAccountId, setSelectedAccountId] = useState<number | undefined>(undefined);
  
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
      const keyStr = String(key);
      console.log('Menu clicked, key:', keyStr);
      
      if (keyStr.startsWith('6.')) {
        // Sub-menu item
        setSelectedIndex(6);
        setSelectedSubIndex(keyStr);
        if (keyStr === '6.1') {
          setRoleView('list');
          setSelectedRoleId(undefined);
        } else if (keyStr === '6.2') {
          setAccountView('list');
          setSelectedAccountId(undefined);
        }
      } else {
        const index = Number(keyStr);
        setSelectedIndex(index);
        setSelectedSubIndex('');
        if (index !== 2) {
          setDeviceView('list');
          setSelectedDeviceId(undefined);
        }
        if (index !== 3) {
          setServiceView('list');
          setSelectedServiceId(undefined);
        }
        if (index !== 4) {
          setQueueView('list');
          setSelectedQueueNumberId(undefined);
        }
        if (index !== 6) {
          setRoleView('list');
          setAccountView('list');
          setSelectedRoleId(undefined);
          setSelectedAccountId(undefined);
        }
      }
  };
  const dispatch = useAppDispatch();
  console.log("Menu bar re rendered!!!!");
  useEffect(()=>{
      dispatch(fetchDeviceList());
      dispatch(fetchServiceList());
      dispatch(fetchQueueNumberList());
  },[dispatch])

  const handleDeviceViewChange = useCallback((view: 'list' | 'add' | 'detail' | 'update', deviceId?: number) => {
    setDeviceView(view);
    if (deviceId !== undefined) {
      setSelectedDeviceId(deviceId);
    } else if (view === 'list') {
      setSelectedDeviceId(undefined);
    }
  }, []);

  const handleServiceViewChange = useCallback((view: 'list' | 'add' | 'detail' | 'update', serviceId?: number) => {
    setServiceView(view);
    if (serviceId !== undefined) {
      setSelectedServiceId(serviceId);
    } else if (view === 'list') {
      setSelectedServiceId(undefined);
    }
  }, []);

  const handleQueueViewChange = useCallback((view: 'list' | 'add' | 'detail', queueNumberId?: number) => {
    setQueueView(view);
    if (queueNumberId !== undefined) {
      setSelectedQueueNumberId(queueNumberId);
    } else if (view === 'list') {
      setSelectedQueueNumberId(undefined);
    }
  }, []);

  const handleRoleViewChange = useCallback((view: 'list' | 'add' | 'update', roleId?: number) => {
    setRoleView(view);
    if (roleId !== undefined) {
      setSelectedRoleId(roleId);
    } else if (view === 'list') {
      setSelectedRoleId(undefined);
    }
  }, []);

  const handleAccountViewChange = useCallback((view: 'list' | 'add' | 'update', accountId?: number) => {
    setAccountView(view);
    if (accountId !== undefined) {
      setSelectedAccountId(accountId);
    } else if (view === 'list') {
      setSelectedAccountId(undefined);
    }
  }, []);

  // Dynamic breadcrumb
  const getBreadcrumbItems = () => {
    const items = [];
    switch (selectedIndex) {
      case 1:
        items.push(<Breadcrumb.Item key="dashboard">Dashboard</Breadcrumb.Item>);
        break;
      case 2:
        items.push(<Breadcrumb.Item key="thietbi">Thiết bị</Breadcrumb.Item>);
        items.push(<Breadcrumb.Item key="danhsach" className={deviceView === 'list' ? 'breadcrumb-active' : ''}>Danh sách thiết bị</Breadcrumb.Item>);
        if (deviceView === 'add') {
          items.push(<Breadcrumb.Item key="them" className="breadcrumb-active">Thêm thiết bị</Breadcrumb.Item>);
        }
        if (deviceView === 'detail') {
          items.push(<Breadcrumb.Item key="chitiet" className="breadcrumb-active">Chi tiết thiết bị</Breadcrumb.Item>);
        }
        if (deviceView === 'update') {
          items.push(<Breadcrumb.Item key="capnhat" className="breadcrumb-active">Cập nhật thiết bị</Breadcrumb.Item>);
        }
        break;
      case 3:
        items.push(<Breadcrumb.Item key="dichvu">Dịch vụ</Breadcrumb.Item>);
        items.push(<Breadcrumb.Item key="danhsachdv" className={serviceView === 'list' ? 'breadcrumb-active' : ''}>Danh sách dịch vụ</Breadcrumb.Item>);
        if (serviceView === 'add') {
          items.push(<Breadcrumb.Item key="themdv" className="breadcrumb-active">Thêm dịch vụ</Breadcrumb.Item>);
        }
        if (serviceView === 'detail') {
          items.push(<Breadcrumb.Item key="chitietdv" className="breadcrumb-active">Chi tiết dịch vụ</Breadcrumb.Item>);
        }
        if (serviceView === 'update') {
          items.push(<Breadcrumb.Item key="capnhatdv" className="breadcrumb-active">Cập nhật dịch vụ</Breadcrumb.Item>);
        }
        break;
      case 4:
        items.push(<Breadcrumb.Item key="capsố">Cấp số</Breadcrumb.Item>);
        items.push(<Breadcrumb.Item key="danhsachcs" className={queueView === 'list' ? 'breadcrumb-active' : ''}>Danh sách cấp số</Breadcrumb.Item>);
        if (queueView === 'add') {
          items.push(<Breadcrumb.Item key="capsomoi" className="breadcrumb-active">Cấp số mới</Breadcrumb.Item>);
        }
        if (queueView === 'detail') {
          items.push(<Breadcrumb.Item key="chitietcs" className="breadcrumb-active">Chi tiết</Breadcrumb.Item>);
        }
        break;
      case 5:
        items.push(<Breadcrumb.Item key="baocao">Báo cáo</Breadcrumb.Item>);
        items.push(<Breadcrumb.Item key="lapbaocao" className="breadcrumb-active">Lập báo cáo</Breadcrumb.Item>);
        break;
      case 6:
        items.push(<Breadcrumb.Item key="caidat">Cài đặt hệ thống</Breadcrumb.Item>);
        if (selectedSubIndex === '6.1') {
          items.push(<Breadcrumb.Item key="quanlyvaitro" className={roleView === 'list' ? 'breadcrumb-active' : ''}>Quản lý vai trò</Breadcrumb.Item>);
          if (roleView === 'add') {
            items.push(<Breadcrumb.Item key="themvaitro" className="breadcrumb-active">Thêm vai trò</Breadcrumb.Item>);
          }
          if (roleView === 'update') {
            items.push(<Breadcrumb.Item key="capnhatvaitro" className="breadcrumb-active">Cập nhật vai trò</Breadcrumb.Item>);
          }
        } else if (selectedSubIndex === '6.2') {
          items.push(<Breadcrumb.Item key="quanlytaikhoan" className={accountView === 'list' ? 'breadcrumb-active' : ''}>Quản lý tài khoản</Breadcrumb.Item>);
          if (accountView === 'add') {
            items.push(<Breadcrumb.Item key="themtaikhoan" className="breadcrumb-active">Thêm tài khoản</Breadcrumb.Item>);
          }
          if (accountView === 'update') {
            items.push(<Breadcrumb.Item key="capnhattaikhoan" className="breadcrumb-active">Cập nhật tài khoản</Breadcrumb.Item>);
          }
        } else if (selectedSubIndex === '6.3') {
          items.push(<Breadcrumb.Item key="nhatkynguoidung" className="breadcrumb-active">Nhật ký người dùng</Breadcrumb.Item>);
        }
        break;
      default:
        items.push(<Breadcrumb.Item key="other">Khác</Breadcrumb.Item>);
    }
    return items;
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F6F6F6' }}>
      <Sider width={200} className="sider-custom">
        <div className="logo">
          <img src={`${process.env.PUBLIC_URL}/images/alta-logo.png`} alt="Alta Media" />
        </div>
        <Menu
          mode="vertical"
          defaultSelectedKeys={['2']}
          defaultOpenKeys={['6']}
          items={menuItems}
          className="sider-menu"
          onClick={handleMenuClick}
          selectedKeys={selectedSubIndex ? [selectedSubIndex] : [String(selectedIndex)]}
        />
        <Button className="logout-button" icon={<LogoutOutlined />}
        onClick={()=>{
            localStorage.clear();
            window.location.reload();
        }}
        >
          Đăng xuất
        </Button>
      </Sider>
      <Layout>
        <Header className="header-custom">
          <Flex justify="space-between" align="center">
            <Breadcrumb separator={<RightOutlined style={{ fontSize: '12px', color: '#7E7D88' }} />}>
              {getBreadcrumbItems()}
            </Breadcrumb>
            <Space size="large" align="center">
              <BellOutlined style={{ fontSize: '20px', color: '#FF9138' }} />
              <Space>
                <Avatar src="https://i.pravatar.cc/32" />
                <div>
                  <Text style={{ fontSize: '12px', color: '#7E7D88' }}>Xin chào</Text>
                  <br />
                  <Text strong>Lê Quỳnh Ái Vân</Text>
                </div>
              </Space>
            </Space>
          </Flex>
        </Header>
        <Content className="content-custom">
            {(() => {
              console.log('Rendering content, selectedIndex:', selectedIndex, 'selectedSubIndex:', selectedSubIndex);
              if (selectedIndex === 1) return <Dashboard />;
              if (selectedIndex === 2) return <Device view={deviceView} selectedDeviceId={selectedDeviceId} onViewChange={handleDeviceViewChange} />;
              if (selectedIndex === 3) return <Service view={serviceView} selectedServiceId={selectedServiceId} onViewChange={handleServiceViewChange} />;
              if (selectedIndex === 4) return <QueueNumber view={queueView} selectedQueueNumberId={selectedQueueNumberId} onViewChange={handleQueueViewChange} />;
              if (selectedIndex === 5) return <Report />;
              if (selectedIndex === 6) {
                if (selectedSubIndex === '6.1') {
                  return <Role view={roleView} selectedRoleId={selectedRoleId} onViewChange={handleRoleViewChange} />;
                } else if (selectedSubIndex === '6.2') {
                  return <Account view={accountView} selectedAccountId={selectedAccountId} onViewChange={handleAccountViewChange} />;
                } else if (selectedSubIndex === '6.3') {
                  return <UserLog />;
                }
              }
              return <h1>Others</h1>;
            })()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MenuBar;