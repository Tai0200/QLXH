import React from 'react';
import { Modal, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { QueueNumberType } from '../../dataTypes/dataTypes';
import './PrintQueueNumberModal.css';

const { Title, Text } = Typography;

interface PrintQueueNumberModalProps {
  visible: boolean;
  queueNumber: QueueNumberType;
  onClose: () => void;
}

const PrintQueueNumberModal: React.FC<PrintQueueNumberModalProps> = ({ visible, queueNumber, onClose }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      className="print-queue-modal"
      width={480}
      centered
    >
      <div className="print-modal-content">
        <CloseOutlined 
          className="close-icon" 
          onClick={onClose}
        />
        <Title level={4} className="modal-title">Số thứ tự được cấp</Title>
        <div className="queue-number-display">
          {queueNumber.soThuTu}
        </div>
        <Text className="service-info">
          DV: {queueNumber.tenDichVu} (tại quầy số 1)
        </Text>
        <div className="modal-footer">
          <div className="footer-item">
            <Text className="footer-label">Thời gian cấp:</Text>
            <Text className="footer-value">{queueNumber.thoiGianCap}</Text>
          </div>
          <div className="footer-item">
            <Text className="footer-label">Hạn sử dụng:</Text>
            <Text className="footer-value">{queueNumber.hanSuDung}</Text>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PrintQueueNumberModal;

