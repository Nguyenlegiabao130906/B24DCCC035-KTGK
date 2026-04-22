import { orderStatusColor, orderStatusLabel, type OrderRecord } from '@/pages/DonHang/types';
import { Descriptions, Drawer, Empty, Table, Tag } from 'antd';
import moment from 'moment';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const columns = [
	{
		title: 'Sản phẩm',
		dataIndex: 'productName',
		key: 'productName',
	},
	{
		title: 'Đơn giá',
		dataIndex: 'price',
		key: 'price',
		render: (value: number) => currencyFormatter.format(value),
		width: 150,
	},
	{
		title: 'Số lượng',
		dataIndex: 'quantity',
		key: 'quantity',
		width: 120,
	},
	{
		title: 'Thành tiền',
		dataIndex: 'total',
		key: 'total',
		render: (value: number) => currencyFormatter.format(value),
		width: 160,
	},
];

const OrderDetailDrawer = (props: { visible: boolean; record?: OrderRecord; onClose: () => void }) => {
	const { visible, record, onClose } = props;

	return (
		<Drawer destroyOnClose width='min(900px, 100vw)' visible={visible} onClose={onClose} title='Chi tiết đơn hàng'>
			{record ? (
				<>
					<Descriptions bordered column={2} size='small'>
						<Descriptions.Item label='Mã đơn hàng'>{record.code}</Descriptions.Item>
						<Descriptions.Item label='Trạng thái'>
							<Tag color={orderStatusColor[record.status]}>{orderStatusLabel[record.status]}</Tag>
						</Descriptions.Item>
						<Descriptions.Item label='Khách hàng'>{record.customerName}</Descriptions.Item>
						<Descriptions.Item label='Số điện thoại'>{record.customerPhone}</Descriptions.Item>
						<Descriptions.Item label='Ngày đặt hàng'>{moment(record.orderDate).format('HH:mm DD/MM/YYYY')}</Descriptions.Item>
						<Descriptions.Item label='Tổng tiền'>{currencyFormatter.format(record.total)}</Descriptions.Item>
						<Descriptions.Item label='Ghi chú' span={2}>
							{record.note || '--'}
						</Descriptions.Item>
					</Descriptions>

					<div className='order-detail-table'>
						<Table
							rowKey={(item) => `${item.productId}-${item.quantity}`}
							columns={columns as any}
							dataSource={record.items}
							pagination={false}
							size='middle'
						/>
					</div>
				</>
			) : (
				<Empty description='Không có dữ liệu đơn hàng' />
			)}
		</Drawer>
	);
};

export default OrderDetailDrawer;
