export enum OrderStatus {
	PENDING = 'pending',
	SHIPPING = 'shipping',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
}

export interface OrderCustomer {
	id: string;
	name: string;
	phone: string;
	email?: string;
	address?: string;
}

export interface OrderProduct {
	id: string;
	name: string;
	price: number;
	unit: string;
	category: string;
}

export interface OrderItem {
	productId: string;
	productName: string;
	price: number;
	quantity: number;
	total: number;
}

export interface OrderRecord {
	id: string;
	code: string;
	customerId: string;
	customerName: string;
	customerPhone: string;
	orderDate: string;
	status: OrderStatus;
	items: OrderItem[];
	total: number;
	note?: string;
	createdAt: string;
	updatedAt: string;
}

export interface OrderFormValues {
	code: string;
	customerId: string;
	orderDate: string;
	status: OrderStatus;
	note?: string;
	items: Array<{
		productId: string;
		quantity: number;
	}>;
}

export const orderStatusLabel: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: 'Chờ xác nhận',
	[OrderStatus.SHIPPING]: 'Đang giao',
	[OrderStatus.COMPLETED]: 'Hoàn thành',
	[OrderStatus.CANCELLED]: 'Hủy',
};

export const orderStatusColor: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: 'gold',
	[OrderStatus.SHIPPING]: 'processing',
	[OrderStatus.COMPLETED]: 'green',
	[OrderStatus.CANCELLED]: 'red',
};
