import { Card, Col, Row, Statistic } from 'antd';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const OrderSummaryCards = (props: { total: number; pending: number; shipping: number; revenue: number }) => {
	const { total, pending, shipping, revenue } = props;

	return (
		<Row gutter={[16, 16]} className='don-hang-summary'>
			<Col span={24} sm={12} xl={6}>
				<Card>
					<Statistic title='Tổng đơn hàng' value={total} />
				</Card>
			</Col>
			<Col span={24} sm={12} xl={6}>
				<Card>
					<Statistic title='Chờ xác nhận' value={pending} valueStyle={{ color: '#d48806' }} />
				</Card>
			</Col>
			<Col span={24} sm={12} xl={6}>
				<Card>
					<Statistic title='Đang giao' value={shipping} valueStyle={{ color: '#1677ff' }} />
				</Card>
			</Col>
			<Col span={24} sm={12} xl={6}>
				<Card>
					<Statistic title='Doanh thu tạm tính' value={currencyFormatter.format(revenue)} />
				</Card>
			</Col>
		</Row>
	);
};

export default OrderSummaryCards;
