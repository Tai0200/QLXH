import React, { useState } from 'react';
import { Form, Select, Button, Typography, Space } from 'antd';
import { useAppDispatch, useAppSelector } from '../../libraries/hook';
import { addQueueNumber } from '../../stores/queueSlice';
import { QueueNumberType } from '../../dataTypes/dataTypes';
import { RootState } from '../../stores/store';
import PrintQueueNumberModal from './PrintQueueNumberModal';
import './AddQueueNumber.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface AddQueueNumberProps {
  onBack: () => void;
}

const AddQueueNumber: React.FC<AddQueueNumberProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const serviceLst = useAppSelector((state: RootState) => state.service);
  const queueNumberLst = useAppSelector((state: RootState) => state.queue);
  const [form] = Form.useForm();
  const [selectedService, setSelectedService] = useState<string>('');
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [newQueueNumber, setNewQueueNumber] = useState<QueueNumberType | null>(null);

  // Sử dụng cùng danh sách dịch vụ như trong QueueNumber.tsx
  const availableServices = [
    'Khám tim mạch',
    'Khám sản - Phụ khoa',
    'Khám răng hàm mặt',
    'Khám tai mũi họng'
  ];

  const generateQueueNumber = (serviceName: string): QueueNumberType => {
    const service = serviceLst.find(s => s.tenDichVu === serviceName);
    const prefix = service?.prefix || '201';
    const lastNumber = queueNumberLst.length > 0 
      ? Math.max(...queueNumberLst.map(q => {
          const num = parseInt(q.soThuTu.replace(prefix, '')) || 0;
          return num;
        }))
      : 0;
    const nextNumber = lastNumber + 1;
    const soThuTu = `${prefix}${String(nextNumber).padStart(4, '0')}`;

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setHours(now.getHours() + 3); // Hạn sử dụng 3 giờ sau

    const formatDateTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${hours}:${minutes} - ${day}/${month}/${year}`;
    };

    return {
      id: Date.now(),
      stt: queueNumberLst.length + 1,
      soThuTu,
      tenKhachHang: 'Lê Quỳnh Ái Vân',
      tenDichVu: serviceName,
      thoiGianCap: formatDateTime(now),
      hanSuDung: formatDateTime(expiryDate),
      trangThai: 'Đang chờ',
      nguonCap: 'Kiosk',
      maDichVu: service?.maDichVu || prefix,
    };
  };

  const handlePrint = async () => {
    if (!selectedService) {
      return;
    }

    const queueNumber = generateQueueNumber(selectedService);
    await dispatch(addQueueNumber(queueNumber));
    setNewQueueNumber(queueNumber);
    setIsPrintModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedService('');
    onBack();
  };

  return (
    <div className="add-queue-container">
      <Title level={2} className="page-title">Quản lý cấp số</Title>

      <div className="add-queue-card">
        <Title level={3} className="form-title">CẤP SỐ MỚI</Title>
        <Text className="form-instruction">Dịch vụ khách hàng lựa chọn</Text>

        <Form
          form={form}
          layout="vertical"
          className="add-queue-form"
        >
          <Form.Item
            label="Chọn dịch vụ"
            name="tenDichVu"
            rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
          >
            <Select
              placeholder="Chọn dịch vụ"
              size="large"
              className="service-select"
              value={selectedService}
              onChange={(value) => setSelectedService(value)}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {availableServices.map((service: string) => (
                <Option key={service} value={service}>
                  {service}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="form-buttons">
            <Space size="large">
              <Button 
                className="cancel-button" 
                onClick={handleCancel}
                size="large"
              >
                Hủy bỏ
              </Button>
              <Button 
                type="primary" 
                className="print-button"
                onClick={handlePrint}
                size="large"
                disabled={!selectedService}
              >
                In số
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      {newQueueNumber && (
        <PrintQueueNumberModal
          visible={isPrintModalVisible}
          queueNumber={newQueueNumber}
          onClose={() => {
            setIsPrintModalVisible(false);
            handleCancel();
          }}
        />
      )}
    </div>
  );
};

export default AddQueueNumber;

