import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { orderCustomers, orderProducts, seedOrders } from '@/pages/DonHang/data';
import { OrderStatus, type OrderFormValues, type OrderRecord } from '@/pages/DonHang/types';

const STORAGE_KEY = 'don-hang-data';

const nowIso = () => new Date().toISOString();

const getStoredOrders = () => {
	if (typeof window === 'undefined') return seedOrders;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return seedOrders;
		const parsed = JSON.parse(raw) as OrderRecord[];
		return Array.isArray(parsed) && parsed.length ? parsed : seedOrders;
	} catch (error) {
		return seedOrders;
	}
};

const calculateTotal = (items: OrderFormValues['items']) =>
	(items ?? []).reduce((sum, item) => {
		const product = orderProducts.find((record) => record.id === item.productId);
		return sum + (product?.price ?? 0) * Number(item.quantity ?? 0);
	}, 0);

export default () => {
	const [orders, setOrders] = useState<OrderRecord[]>([]);
	const [visibleForm, setVisibleForm] = useState(false);
	const [visibleDetail, setVisibleDetail] = useState(false);
	const [editingOrder, setEditingOrder] = useState<OrderRecord | undefined>();
	const [selectedOrder, setSelectedOrder] = useState<OrderRecord | undefined>();

	const loadOrders = () => {
		const nextOrders = getStoredOrders();
		setOrders(nextOrders);
		return nextOrders;
	};

	useEffect(() => {
		loadOrders();
	}, []);

	const persistOrders = (nextOrders: OrderRecord[]) => {
		setOrders(nextOrders);
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
		}
	};

	const submitOrder = (values: OrderFormValues, editingId?: string) => {
		const existed = orders.find((item) => item.code.trim().toLowerCase() === values.code.trim().toLowerCase());
		if (existed && existed.id !== editingId) {
			message.error('Mã đơn hàng đã tồn tại');
			return false;
		}

		const customer = orderCustomers.find((item) => item.id === values.customerId);
		if (!customer) {
			message.error('Khách hàng không hợp lệ');
			return false;
		}

		const duplicatedProduct = values.items.some(
			(item, index, list) => list.findIndex((record) => record.productId === item.productId) !== index,
		);
		if (duplicatedProduct) {
			message.error('Sản phẩm trong đơn không được trùng nhau');
			return false;
		}

		const orderItems = values.items.map((item) => {
			const product = orderProducts.find((record) => record.id === item.productId);
			const quantity = Number(item.quantity ?? 0);
			const price = product?.price ?? 0;
			return {
				productId: item.productId,
				productName: product?.name ?? '',
				price,
				quantity,
				total: price * quantity,
			};
		});

		const total = calculateTotal(values.items);
		const nextOrder: OrderRecord = {
			id: editingId ?? `ord-${Date.now()}`,
			code: values.code.trim(),
			customerId: customer.id,
			customerName: customer.name,
			customerPhone: customer.phone,
			orderDate: new Date(values.orderDate).toISOString(),
			status: values.status,
			items: orderItems,
			total,
			note: values.note?.trim(),
			createdAt: editingId ? orders.find((item) => item.id === editingId)?.createdAt ?? nowIso() : nowIso(),
			updatedAt: nowIso(),
		};

		const nextOrders = editingId
			? orders.map((item) => (item.id === editingId ? nextOrder : item))
			: [nextOrder, ...orders];
		persistOrders(nextOrders);
		message.success(editingId ? 'Cập nhật đơn hàng thành công' : 'Thêm đơn hàng thành công');
		return true;
	};

	const cancelOrder = (targetOrder: OrderRecord) => {
		if (targetOrder.status !== OrderStatus.PENDING) {
			message.warning('Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận');
			return false;
		}

		const nextOrders = orders.map((item) =>
			item.id === targetOrder.id ? { ...item, status: OrderStatus.CANCELLED, updatedAt: nowIso() } : item,
		);
		persistOrders(nextOrders);
		message.success('Đã hủy đơn hàng');
		return true;
	};

	const summary = useMemo(
		() => ({
			total: orders.length,
			pending: orders.filter((item) => item.status === OrderStatus.PENDING).length,
			shipping: orders.filter((item) => item.status === OrderStatus.SHIPPING).length,
			revenue: orders
				.filter((item) => item.status !== OrderStatus.CANCELLED)
				.reduce((sum, item) => sum + item.total, 0),
		}),
		[orders],
	);

	return {
		orders,
		orderCustomers,
		orderProducts,
		summary,
		visibleForm,
		setVisibleForm,
		visibleDetail,
		setVisibleDetail,
		editingOrder,
		setEditingOrder,
		selectedOrder,
		setSelectedOrder,
		loadOrders,
		submitOrder,
		cancelOrder,
	};
};
