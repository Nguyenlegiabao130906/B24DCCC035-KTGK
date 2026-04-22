import DonutChart from '@/components/Chart/DonutChart';
import { Card, Col, Row, Typography } from 'antd';

const OrderStatusChart = (props: { labels: string[]; series: number[][] }) => {
	const { labels, series } = props;

	return (
		<Card className='don-hang-chart-card'>
			<Row gutter={[16, 16]} align='middle'>
				<Col span={24} lg={8}>
					<Typography.Title level={4} style={{ marginTop: 0 }}>
						Thống kê trạng thái đơn hàng
					</Typography.Title>
					<Typography.Paragraph type='secondary' style={{ marginBottom: 0 }}>
						Biểu đồ nhanh để nhìn tỷ lệ đơn chờ xác nhận, đang giao, hoàn thành và hủy.
					</Typography.Paragraph>
				</Col>
				<Col span={24} lg={16}>
					<DonutChart
						xAxis={labels}
						yAxis={series}
						yLabel={['Số đơn']}
						height={320}
						showTotal
						colors={['#d48806', '#1677ff', '#52c41a', '#ff4d4f']}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default OrderStatusChart;
