import React, {useState, useEffect, useMemo, useCallback} from "react";
import {Select, Table, Flex, Typography, Space, Badge,
     Input, Button} from 'antd';
import { useAppSelector } from "../../libraries/hook";
import type { TableProps } from 'antd';
import { DeviceType } from "../../dataTypes/dataTypes";
import {SearchOutlined, PlusOutlined} from '@ant-design/icons';
import { RootState } from "../../stores/store";
import AddDevice from "./AddDevice";
import DeviceDetail from "./DeviceDetail";
import UpdateDevice from "./UpdateDevice";
const { Title, Text } = Typography;
const { Option } = Select;

interface DeviceProps {
  view: 'list' | 'add' | 'detail' | 'update';
  selectedDeviceId?: number;
  onViewChange: (view: 'list' | 'add' | 'detail' | 'update', deviceId?: number) => void;
}

const Device: React.FC<DeviceProps> = ({ view, selectedDeviceId: propDeviceId, onViewChange }) => {
  const deviceLst = useAppSelector((state:RootState)=>state.device);
const [filteredData, setFilteredData] = useState(deviceLst);
const [selectedDeviceId, setSelectedDeviceId] = useState<number | undefined>(propDeviceId);

useEffect(() => {
  setFilteredData(deviceLst);
}, [deviceLst]);

// Sync selectedDeviceId with prop
useEffect(() => {
  setSelectedDeviceId(propDeviceId);
}, [propDeviceId]);

// Reset selectedDeviceId when view changes back to list
useEffect(() => {
  if (view === 'list') {
    setSelectedDeviceId(undefined);
  }
}, [view]);

const handleDetailClick = useCallback((deviceId: number) => {
  setSelectedDeviceId(deviceId);
  onViewChange('detail', deviceId);
}, [onViewChange]);

const handleUpdateClick = useCallback((deviceId: number) => {
  setSelectedDeviceId(deviceId);
  onViewChange('update', deviceId);
}, [onViewChange]);

const columns: TableProps<DeviceType>['columns'] = useMemo(() => [
  { title: 'Mã thiết bị', dataIndex: 'maThietBi', key: 'maThietBi' },
  { title: 'Tên thiết bị', dataIndex: 'tenThietBi', key: 'tenThietBi' },
  { title: 'Địa chỉ IP', dataIndex: 'diaChiIP', key: 'diaChiIP' },
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
    title: 'Trạng thái kết nối',
    dataIndex: 'trangThaiKetNoi',
    key: 'trangThaiKetNoi',
    render: (text:string) => (
      <Badge
        status={text === 'Kết nối' ? 'success' : 'error'}
        text={text}
      />
    ),
  },
  {
    title: 'Dịch vụ sử dụng',
    dataIndex: 'dichVuSuDung',
    key: 'dichVuSuDung',
    render: (text) => (
      <div>
        {text}
        <br />
        <a href="services.tsx">Xem thêm</a>
      </div>
    ),
    width: 250,
  },
  {
    title: '',
    key: 'actionDetail',
    render: (_, record: DeviceType) => {
      const deviceId = record.id || (record as any).key;
      return (
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (deviceId) {
              const idToUse = typeof deviceId === 'string' ? parseInt(deviceId, 10) : deviceId;
              console.log('Clicking detail, deviceId:', idToUse, 'record:', record);
              handleDetailClick(idToUse);
            } else {
              console.error('Device ID is missing:', record);
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
    render: (_, record: DeviceType) => {
      const deviceId = record.id || (record as any).key;
      return (
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (deviceId) {
              const idToUse = typeof deviceId === 'string' ? parseInt(deviceId, 10) : deviceId;
              handleUpdateClick(idToUse);
            } else {
              console.error('Device ID is missing:', record);
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
const [trangThaiHoatDong, setTrangthaiHoatDong] = useState('Tất cả');
const [trangthaiKetNoi, setTrangthaiKetNoi] = useState('Tất cả');
const handleFilter = (value:string, option:number)=>{
  switch(option){
    case 1:
        setTrangthaiHoatDong(value);
        if(trangthaiKetNoi=='Tất cả')
        setFilteredData(value=='Tất cả'?deviceLst.filter(x=>x.dichVuSuDung.includes(searchText)):deviceLst.filter(x=>x.trangThaiHoatDong == value &&
        x.dichVuSuDung.includes(searchText)
        ));
        else
          setFilteredData(value=='Tất cả'?deviceLst.filter(x=>x.dichVuSuDung.includes(searchText)):deviceLst.filter(x=>x.trangThaiHoatDong == value &&
        x.dichVuSuDung.includes(searchText)&&x.trangThaiKetNoi == trangthaiKetNoi
        ));
        break;
    default:
        setTrangthaiKetNoi(value);
        if(trangThaiHoatDong=='Tất cả')
        setFilteredData(value=='Tất cả'?deviceLst.filter(x=>x.dichVuSuDung.includes(searchText)):deviceLst.filter(x=>x.trangThaiKetNoi == value &&
        x.dichVuSuDung.includes(searchText)
        ));
        else
          setFilteredData(value=='Tất cả'?deviceLst.filter(x=>x.dichVuSuDung.includes(searchText)):deviceLst.filter(x=>x.trangThaiKetNoi == value &&
        x.dichVuSuDung.includes(searchText)&&x.trangThaiHoatDong == trangThaiHoatDong
        ));
  }
    
}
useEffect(()=>{
  const item:{id:number, name: string} = {id:1, name:'Kiwi'};
  async function LogData(){
    console.log(item);
    return new Promise((resolve:any)=>{
        resolve('Cherry');
    })
  }
  let myitem:Promise<any> = LogData();
  myitem.then((data:any)=>{
      item.name = data;
  })
  console.log(item);
},[])

if (view === 'add') {
  return <AddDevice onBack={() => onViewChange('list')} />;
}

if (view === 'update') {
  const currentDeviceId = selectedDeviceId || propDeviceId;
  if (currentDeviceId) {
    const device = deviceLst.find(d => {
      const dId = d.id || (d as any).key;
      const dIdNum = typeof dId === 'string' ? parseInt(dId, 10) : dId;
      const currentIdNum = typeof currentDeviceId === 'string' ? parseInt(currentDeviceId, 10) : currentDeviceId;
      return dIdNum === currentIdNum || String(dId) === String(currentDeviceId);
    });
    if (device) {
      return (
        <UpdateDevice 
          device={device} 
          onBack={() => onViewChange('list')}
        />
      );
    } else {
      console.error('Device not found with id:', currentDeviceId);
      return <div>Không tìm thấy thiết bị</div>;
    }
  } else {
    console.error('No device ID provided for update view');
    return <div>Không có ID thiết bị</div>;
  }
}

if (view === 'detail') {
  const currentDeviceId = selectedDeviceId || propDeviceId;
  console.log('Detail view, currentDeviceId:', currentDeviceId, 'selectedDeviceId:', selectedDeviceId, 'propDeviceId:', propDeviceId);
  if (currentDeviceId) {
    const device = deviceLst.find(d => {
      const dId = d.id || (d as any).key;
      const dIdNum = typeof dId === 'string' ? parseInt(dId, 10) : dId;
      const currentIdNum = typeof currentDeviceId === 'string' ? parseInt(currentDeviceId, 10) : currentDeviceId;
      return dIdNum === currentIdNum || String(dId) === String(currentDeviceId);
    });
    console.log('Found device:', device);
    if (device) {
      return (
      <DeviceDetail 
        device={device} 
        onBack={() => onViewChange('list')}
        onUpdate={(device) => {
          const deviceId = device.id || (device as any).key;
          const idToUse = typeof deviceId === 'string' ? parseInt(deviceId, 10) : deviceId;
          handleUpdateClick(idToUse);
        }}
      />
      );
    } else {
      console.error('Device not found with id:', currentDeviceId, 'deviceLst:', deviceLst);
      return <div>Không tìm thấy thiết bị</div>;
    }
  } else {
    console.error('No device ID provided for detail view, view:', view);
    return <div>Không có ID thiết bị</div>;
  }
}

    return(
        <div>
            <Title level={2} className="page-title">Danh sách thiết bị</Title>
          <Flex gap="large" align="flex-start">
            {/* Cột 1: Chứa bộ lọc và bảng, sẽ co giãn */}
            <div style={{ flex: 1 }}>
              <Flex justify="space-between" align="flex-start" style={{ marginBottom: 16 }}>
                <Space size="large">
                  <div>
                    <Text>Trạng thái hoạt động</Text>
                    <Select defaultValue="Tất cả" style={{ width: 300, display: 'block' }}
                    onChange={(value:string)=>handleFilter(value, 1)}
                    >
                      <Option value="Tất cả">Tất cả</Option>
                      <Option value="Hoạt động">Hoạt động</Option>
                      <Option value="Ngưng hoạt động">Ngưng hoạt động</Option>
                    </Select>
                  </div>
                  <div>
                    <Text>Trạng thái kết nối</Text>
                    <Select defaultValue="Tất cả" style={{ width: 300, display: 'block' }}
                    onChange={(value:string)=>handleFilter(value, 2)}
                    >
                      <Option value="Tất cả">Tất cả</Option>
                      <Option value="Kết nối">Kết nối</Option>
                      <Option value="Mất kết nối">Mất kết nối</Option>
                    </Select>
                  </div>
                </Space>
                <div>
                  <Text>Từ khoá</Text>
                  <Input
                    placeholder="Nhập từ khóa"
                    suffix={<SearchOutlined style={{ color: '#FF9138' }} />}
                    style={{ width: 400, display: 'block' }}
                    onKeyUp={(e)=>{
                        if(e.key === 'Enter'){
                            setSearchText(e.currentTarget.value);
                            if(trangThaiHoatDong!='Tất cả')
                              if(trangthaiKetNoi!='Tất cả')
                                setFilteredData(deviceLst.filter((x:DeviceType)=>x.dichVuSuDung.includes(e.currentTarget.value)&&
                                x.trangThaiHoatDong==trangThaiHoatDong&&x.trangThaiKetNoi == trangthaiKetNoi));
                              else
                                setFilteredData(deviceLst.filter((x:DeviceType)=>x.dichVuSuDung.includes(e.currentTarget.value)&&
                                x.trangThaiHoatDong==trangThaiHoatDong));
                            else
                              if(trangthaiKetNoi!='Tất cả')
                                  setFilteredData(deviceLst.filter((x:DeviceType)=>x.dichVuSuDung.includes(e.currentTarget.value)&&x.trangThaiKetNoi == trangthaiKetNoi));
                              else
                              {
                                //alert('áglkadfzjlk');
                                setFilteredData(deviceLst.filter((x:DeviceType)=>x.dichVuSuDung.includes(e.currentTarget.value)));
                              }

                        }
                    }}
                  />
                </div>
              </Flex>

              <Table
                columns={columns}
                dataSource={filteredData}
                className="device-table"
              />
            </div>

            {/* Cột 2: Nút "Thêm thiết bị" */}
            <Button className="add-device-button" onClick={() => onViewChange('add')}>
              <div className="add-icon-wrapper">
                <PlusOutlined />
              </div>
              Thêm thiết bị
            </Button>
          </Flex>
        </div>
    )
}
export default Device;