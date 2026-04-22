import { Button, Card, Col, Row, Typography } from 'antd';

const OrderHero = (props: { onAdd: () => void; onReload: () => void }) => {
	const { onAdd, onReload } = props;

	return (
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
						<Button type='primary' onClick={onAdd}>
							Thêm đơn hàng
						</Button>
						<Button onClick={onReload}>Tải lại</Button>
					</div>
				</Col>
			</Row>
		</Card>
	);
};

export default OrderHero;
