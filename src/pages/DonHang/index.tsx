import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import OrderDetailDrawer from './components/OrderDetailDrawer';
import OrderFormDrawer from './components/OrderFormDrawer';
import OrderFilters from './components/OrderFilters';
import OrderHero from './components/OrderHero';
import OrderList from './components/OrderList';
import OrderStatusChart from './components/OrderStatusChart';
import OrderSummaryCards from './components/OrderSummaryCards';
import { orderStatusLabel, OrderStatus } from './types';
import './index.less';

const statusOptions = [
	{ value: '', label: 'Tất cả trạng thái' },
	...Object.values(OrderStatus).map((status) => ({ value: status, label: orderStatusLabel[status] })),
];

const sortOptions = [
	{ value: 'orderDate-desc', label: 'Ngày đặt mới nhất' },
	{ value: 'orderDate-asc', label: 'Ngày đặt cũ nhất' },
	{ value: 'total-desc', label: 'Tổng tiền cao nhất' },
	{ value: 'total-asc', label: 'Tổng tiền thấp nhất' },
];

const DonHangPage = () => {
	const {
		orders,
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
		deleteOrder,
	} = useModel('donhang');
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [sortValue, setSortValue] = useState('orderDate-desc');

	const filteredOrders = useMemo(() => {
		const normalizedSearch = searchText.trim().toLowerCase();
		const [sortField, sortDirection] = sortValue.split('-');
		return [...orders]
			.filter((order) => {
				const matchSearch =
					!normalizedSearch ||
					order.code.toLowerCase().includes(normalizedSearch) ||
					order.customerName.toLowerCase().includes(normalizedSearch);
				const matchStatus = !statusFilter || order.status === statusFilter;
				return matchSearch && matchStatus;
			})
			.sort((left, right) => {
				if (sortField === 'total') {
					return sortDirection === 'asc' ? left.total - right.total : right.total - left.total;
				}
				return sortDirection === 'asc'
					? new Date(left.orderDate).getTime() - new Date(right.orderDate).getTime()
					: new Date(right.orderDate).getTime() - new Date(left.orderDate).getTime();
			});
	}, [orders, searchText, statusFilter, sortValue]);

	const chartLabels = [
		orderStatusLabel[OrderStatus.PENDING],
		orderStatusLabel[OrderStatus.SHIPPING],
		orderStatusLabel[OrderStatus.COMPLETED],
		orderStatusLabel[OrderStatus.CANCELLED],
	];

	const chartSeries = [
		[
			orders.filter((item) => item.status === OrderStatus.PENDING).length,
			orders.filter((item) => item.status === OrderStatus.SHIPPING).length,
			orders.filter((item) => item.status === OrderStatus.COMPLETED).length,
			orders.filter((item) => item.status === OrderStatus.CANCELLED).length,
		],
	];

	return (
		<div className='don-hang-page'>
			<OrderHero
				onAdd={() => {
					setEditingOrder(undefined);
					setVisibleForm(true);
				}}
				onReload={loadOrders}
			/>

			<OrderSummaryCards
				total={summary.total}
				pending={summary.pending}
				shipping={summary.shipping}
				revenue={summary.revenue}
			/>

			<OrderStatusChart labels={chartLabels} series={chartSeries} />

			<OrderFilters
				statusOptions={statusOptions}
				sortOptions={sortOptions}
				searchText={searchText}
				statusFilter={statusFilter}
				sortValue={sortValue}
				onSearchTextChange={setSearchText}
				onStatusChange={setStatusFilter}
				onSortChange={setSortValue}
				onAdd={() => {
					setEditingOrder(undefined);
					setVisibleForm(true);
				}}
				onReload={loadOrders}
			/>

			<OrderList
				data={filteredOrders}
				onView={(record) => {
					setSelectedOrder(record);
					setVisibleDetail(true);
				}}
				onEdit={(record) => {
					setEditingOrder(record);
					setVisibleForm(true);
				}}
				onCancel={(record) => cancelOrder(record)}
				onDelete={(record) => deleteOrder(record)}
			/>

			<OrderFormDrawer
				visible={visibleForm}
				record={editingOrder}
				onCancel={() => {
					setVisibleForm(false);
					setEditingOrder(undefined);
				}}
				onSubmit={submitOrder}
			/>

			<OrderDetailDrawer
				visible={visibleDetail}
				record={selectedOrder}
				onClose={() => {
					setVisibleDetail(false);
					setSelectedOrder(undefined);
				}}
			/>
		</div>
	);
};

export default DonHangPage;
