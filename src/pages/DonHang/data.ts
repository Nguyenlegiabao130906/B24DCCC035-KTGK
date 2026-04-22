import { OrderStatus, type OrderCustomer, type OrderProduct, type OrderRecord } from './types';

export const orderCustomers: OrderCustomer[] = [
	{
		id: 'cus-001',
		name: 'Nguyễn Văn An',
		phone: '0901234567',
		email: 'an.nguyen@example.com',
		address: 'Quận 1, TP. Hồ Chí Minh',
	},
	{
		id: 'cus-002',
		name: 'Trần Thị Bích',
		phone: '0912345678',
		email: 'bich.tran@example.com',
		address: 'Quận Cầu Giấy, Hà Nội',
	},
	{
		id: 'cus-003',
		name: 'Lê Hoàng Minh',
		phone: '0923456789',
		email: 'minh.le@example.com',
		address: 'Quận Hải Châu, Đà Nẵng',
	},
	{
		id: 'cus-004',
		name: 'Phạm Ngọc Lan',
		phone: '0934567890',
		email: 'lan.pham@example.com',
		address: 'Thủ Đức, TP. Hồ Chí Minh',
	},
];

export const orderProducts: OrderProduct[] = [
	{ id: 'prd-001', name: 'Bàn làm việc gỗ sồi', price: 3500000, unit: 'cái', category: 'Nội thất' },
	{ id: 'prd-002', name: 'Ghế công thái học', price: 4200000, unit: 'cái', category: 'Nội thất' },
	{ id: 'prd-003', name: 'Đèn bàn LED', price: 650000, unit: 'cái', category: 'Phụ kiện' },
	{ id: 'prd-004', name: 'Bộ văn phòng phẩm', price: 280000, unit: 'bộ', category: 'Văn phòng' },
	{ id: 'prd-005', name: 'Kệ sách mini', price: 1150000, unit: 'cái', category: 'Nội thất' },
	{ id: 'prd-006', name: 'Tai nghe Bluetooth', price: 990000, unit: 'cái', category: 'Thiết bị' },
];

const formatDate = (value: string) => new Date(value).toISOString();

export const seedOrders: OrderRecord[] = [
	{
		id: 'ord-001',
		code: 'DH0001',
		customerId: 'cus-001',
		customerName: 'Nguyễn Văn An',
		customerPhone: '0901234567',
		orderDate: formatDate('2026-04-10T08:00:00.000Z'),
		status: OrderStatus.PENDING,
		items: [
			{
				productId: 'prd-001',
				productName: 'Bàn làm việc gỗ sồi',
				price: 3500000,
				quantity: 1,
				total: 3500000,
			},
			{
				productId: 'prd-003',
				productName: 'Đèn bàn LED',
				price: 650000,
				quantity: 2,
				total: 1300000,
			},
		],
		total: 4800000,
		note: 'Giao giờ hành chính',
		createdAt: formatDate('2026-04-10T08:00:00.000Z'),
		updatedAt: formatDate('2026-04-10T08:00:00.000Z'),
	},
	{
		id: 'ord-002',
		code: 'DH0002',
		customerId: 'cus-002',
		customerName: 'Trần Thị Bích',
		customerPhone: '0912345678',
		orderDate: formatDate('2026-04-12T10:15:00.000Z'),
		status: OrderStatus.SHIPPING,
		items: [
			{
				productId: 'prd-002',
				productName: 'Ghế công thái học',
				price: 4200000,
				quantity: 1,
				total: 4200000,
			},
		],
		total: 4200000,
		note: 'Khách cần gọi trước khi giao',
		createdAt: formatDate('2026-04-12T10:15:00.000Z'),
		updatedAt: formatDate('2026-04-12T10:15:00.000Z'),
	},
	{
		id: 'ord-003',
		code: 'DH0003',
		customerId: 'cus-003',
		customerName: 'Lê Hoàng Minh',
		customerPhone: '0923456789',
		orderDate: formatDate('2026-04-15T06:30:00.000Z'),
		status: OrderStatus.COMPLETED,
		items: [
			{
				productId: 'prd-004',
				productName: 'Bộ văn phòng phẩm',
				price: 280000,
				quantity: 3,
				total: 840000,
			},
			{
				productId: 'prd-006',
				productName: 'Tai nghe Bluetooth',
				price: 990000,
				quantity: 1,
				total: 990000,
			},
		],
		total: 1830000,
		note: 'Đã thanh toán',
		createdAt: formatDate('2026-04-15T06:30:00.000Z'),
		updatedAt: formatDate('2026-04-16T09:00:00.000Z'),
	},
	{
		id: 'ord-004',
		code: 'DH0004',
		customerId: 'cus-004',
		customerName: 'Phạm Ngọc Lan',
		customerPhone: '0934567890',
		orderDate: formatDate('2026-04-18T09:20:00.000Z'),
		status: OrderStatus.CANCELLED,
		items: [
			{
				productId: 'prd-005',
				productName: 'Kệ sách mini',
				price: 1150000,
				quantity: 2,
				total: 2300000,
			},
		],
		total: 2300000,
		note: 'Hủy theo yêu cầu khách hàng',
		createdAt: formatDate('2026-04-18T09:20:00.000Z'),
		updatedAt: formatDate('2026-04-18T10:00:00.000Z'),
	},
];
