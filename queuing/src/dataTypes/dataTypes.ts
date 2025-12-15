export interface DeviceType {
    id: number;
    maThietBi: string;
    tenThietBi: string,
    diaChiIP: string;
    trangThaiHoatDong: string;
    trangThaiKetNoi: string;
    dichVuSuDung: string;
}

export interface ServiceType {
    id?: number;
    key?: string;
    maDichVu: string;
    tenDichVu: string;
    moTa: string;
    trangThaiHoatDong: string;
    tangTuDong?: boolean;
    tuSo?: string;
    denSo?: string;
    prefix?: string;
    surfix?: string;
    resetMoiNgay?: boolean;
}

export interface QueueNumberType {
    id?: number;
    key?: string;
    stt: number;
    soThuTu: string;
    tenKhachHang: string;
    tenDichVu: string;
    thoiGianCap: string;
    hanSuDung: string;
    trangThai: string;
    nguonCap: string;
    soDienThoai?: string;
    email?: string;
    maDichVu?: string;
}

export interface RoleType {
    id?: number;
    key?: string;
    tenVaiTro: string;
    soNguoiDung: number;
    moTa: string;
    phanQuyen?: {
        nhomChucNangA?: string[];
        nhomChucNangB?: string[];
    };
}

export interface AccountType {
    id?: number;
    key?: string;
    tenDangNhap: string;
    hoTen: string;
    soDienThoai: string;
    email: string;
    vaiTro: string;
    trangThaiHoatDong: string;
    matKhau?: string;
}

export interface UserLogType {
    id?: number;
    key?: string;
    tenDangNhap: string;
    thoiGianTacDong: string;
    ipThucHien: string;
    thaoTacThucHien: string;
}