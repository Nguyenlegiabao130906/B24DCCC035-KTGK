import { Button, Card, Grid, Space, Table, Tag, Typography, type TableColumnsType } from 'antd';
import { useMemo } from 'react';
import { orderStatusColor, orderStatusLabel, type OrderRecord, OrderStatus } from '../types';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const OrderList = (props: {
	data: OrderRecord[];
	onView: (record: OrderRecord) => void;
	onEdit: (record: OrderRecord) => void;
	onCancel: (record: OrderRecord) => void;
}) => {
	const { data, onView, onEdit, onCancel } = props;
	const screens = Grid.useBreakpoint();
	const isMobile = screens.xs && !screens.sm;

	const columns: TableColumnsType<OrderRecord> = useMemo(
		() => [
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
						<Button type='link' onClick={() => onView(record)}>
							Xem
						</Button>
						<Button type='link' onClick={() => onEdit(record)}>
							Sửa
						</Button>
						{record.status === OrderStatus.PENDING ? (
							<Button danger type='link' onClick={() => onCancel(record)}>
								Hủy
							</Button>
						) : (
							<Button disabled type='link'>
								Hủy
							</Button>
						)}
					</Space>
				),
			},
		],
		[onCancel, onEdit, onView],
	);

	return (
		<Card className='don-hang-table-card'>
			{isMobile ? (
				<div className='don-hang-mobile-list'>
					{data.map((record) => (
						<Card key={record.id} size='small' className='don-hang-mobile-item'>
							<div className='don-hang-mobile-topline'>
								<Typography.Text strong>{record.code}</Typography.Text>
								<Tag color={orderStatusColor[record.status]}>{orderStatusLabel[record.status]}</Tag>
							</div>
							<div className='don-hang-mobile-meta'>
								<div>{record.customerName}</div>
								<div>{new Date(record.orderDate).toLocaleString('vi-VN')}</div>
								<div>{currencyFormatter.format(record.total)}</div>
							</div>
							<Space wrap>
								<Button type='link' onClick={() => onView(record)}>
									Xem
								</Button>
								<Button type='link' onClick={() => onEdit(record)}>
									Sửa
								</Button>
								{record.status === OrderStatus.PENDING ? (
									<Button danger type='link' onClick={() => onCancel(record)}>
										Hủy
									</Button>
								) : (
									<Button disabled type='link'>
										Hủy
									</Button>
								)}
							</Space>
						</Card>
					))}
				</div>
			) : (
				<Table
					rowKey='id'
					columns={columns}
					dataSource={data}
					pagination={{ pageSize: 8, showSizeChanger: false }}
					scroll={{ x: 980 }}
				/>
			)}
		</Card>
	);
};

export default OrderList;
