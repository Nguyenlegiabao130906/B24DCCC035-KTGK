import { Button, Card, Col, Input, Popconfirm, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import OrderDetailDrawer from './components/OrderDetailDrawer';
import OrderFormDrawer from './components/OrderFormDrawer';
import { orderStatusColor, orderStatusLabel, type OrderRecord, OrderStatus } from './types';
import './index.less';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

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

	const columns: ColumnsType<OrderRecord> = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'code',
			key: 'code',
			width: 140,
		},
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
			key: 'customerName',
			width: 180,
			render: (value, record) => (
				<div>
					<div style={{ fontWeight: 600 }}>{value}</div>
					<Typography.Text type='secondary'>{record.customerPhone}</Typography.Text>
				</div>
			),
		},
		{
			title: 'Ngày đặt hàng',
			dataIndex: 'orderDate',
			key: 'orderDate',
			width: 170,
			render: (value) => new Date(value).toLocaleString('vi-VN'),
			sorter: (left, right) => new Date(left.orderDate).getTime() - new Date(right.orderDate).getTime(),
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'total',
			key: 'total',
			width: 160,
			align: 'right',
			render: (value) => currencyFormatter.format(value),
			sorter: (left, right) => left.total - right.total,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 150,
			render: (value: OrderStatus) => <Tag color={orderStatusColor[value]}>{orderStatusLabel[value]}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 180,
			fixed: 'right',
			render: (_, record) => (
				<Space size={4} wrap>
					<Button
						type='link'
						onClick={() => {
							setSelectedOrder(record);
							setVisibleDetail(true);
						}}
					>
						Xem
					</Button>
					<Button
						type='link'
						onClick={() => {
							setEditingOrder(record);
							setVisibleForm(true);
						}}
					>
						Sửa
					</Button>
					{record.status === OrderStatus.PENDING ? (
						<Popconfirm
							title='Hủy đơn hàng này?'
							description='Chỉ đơn hàng ở trạng thái Chờ xác nhận mới được hủy. Thao tác này sẽ cập nhật trạng thái sang Hủy.'
							okText='Hủy đơn'
							cancelText='Không'
							onConfirm={() => cancelOrder(record)}
						>
							<Button danger type='link'>
								Hủy
							</Button>
						</Popconfirm>
					) : (
						<Button disabled type='link'>
							Hủy
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<div className='don-hang-page'>
			<Card className='don-hang-hero' bordered={false}>
				<Row gutter={[16, 16]} align='middle'>
					<Col span={24} lg={16}>
						<Typography.Title level={2} className='don-hang-title'>
							Quản lý đơn hàng
						</Typography.Title>
						<Typography.Paragraph className='don-hang-subtitle'>
							Danh sách đơn hàng, lọc theo trạng thái, tìm kiếm nhanh, chỉnh sửa và hủy có điều kiện.
						</Typography.Paragraph>
					</Col>
					<Col span={24} lg={8}>
						<div className='don-hang-actions'>
							<Button
								type='primary'
								onClick={() => {
									setEditingOrder(undefined);
									setVisibleForm(true);
								}}
							>
								Thêm đơn hàng
							</Button>
							<Button onClick={loadOrders}>Tải lại</Button>
						</div>
					</Col>
				</Row>
			</Card>

			<Row gutter={[16, 16]} className='don-hang-summary'>
				<Col span={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Tổng đơn hàng' value={summary.total} />
					</Card>
				</Col>
				<Col span={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Chờ xác nhận' value={summary.pending} valueStyle={{ color: '#d48806' }} />
					</Card>
				</Col>
				<Col span={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Đang giao' value={summary.shipping} valueStyle={{ color: '#1677ff' }} />
					</Card>
				</Col>
				<Col span={24} sm={12} xl={6}>
					<Card>
						<Statistic title='Doanh thu tạm tính' value={currencyFormatter.format(summary.revenue)} />
					</Card>
				</Col>
			</Row>

			<Card className='don-hang-toolbar' bordered={false}>
				<Row gutter={[12, 12]}>
					<Col span={24} lg={10}>
						<Input.Search
							allowClear
							placeholder='Tìm theo mã đơn hàng hoặc khách hàng'
							value={searchText}
							onChange={(event) => setSearchText(event.target.value)}
							onSearch={(value) => setSearchText(value)}
						/>
					</Col>
					<Col span={24} sm={12} lg={7}>
						<Select
							style={{ width: '100%' }}
							options={statusOptions}
							value={statusFilter}
							onChange={setStatusFilter}
						/>
					</Col>
					<Col span={24} sm={12} lg={7}>
						<Select style={{ width: '100%' }} options={sortOptions} value={sortValue} onChange={setSortValue} />
					</Col>
				</Row>
			</Card>

			<Card className='don-hang-table-card'>
				<Table
					rowKey='id'
					columns={columns}
					dataSource={filteredOrders}
					pagination={{ pageSize: 8, showSizeChanger: false }}
					scroll={{ x: 980 }}
				/>
			</Card>

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
