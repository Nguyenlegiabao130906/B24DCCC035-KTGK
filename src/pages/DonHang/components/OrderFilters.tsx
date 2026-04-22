import { Button, Card, Col, Input, Row, Select } from 'antd';

const OrderFilters = (props: {
	statusOptions: Array<{ value: string; label: string }>;
	sortOptions: Array<{ value: string; label: string }>;
	searchText: string;
	statusFilter: string;
	sortValue: string;
	onSearchTextChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	onSortChange: (value: string) => void;
	onAdd: () => void;
	onReload: () => void;
}) => {
	const {
		statusOptions,
		sortOptions,
		searchText,
		statusFilter,
		sortValue,
		onSearchTextChange,
		onStatusChange,
		onSortChange,
		onAdd,
		onReload,
	} = props;

	return (
		<Card className='don-hang-toolbar' bordered={false}>
			<Row gutter={[12, 12]}>
				<Col span={24} lg={10}>
					<Input.Search
						allowClear
						placeholder='Tìm theo mã đơn hàng hoặc khách hàng'
						value={searchText}
						onChange={(event) => onSearchTextChange(event.target.value)}
						onSearch={(value) => onSearchTextChange(value)}
					/>
				</Col>
				<Col span={24} sm={12} lg={7}>
					<Select style={{ width: '100%' }} options={statusOptions} value={statusFilter} onChange={onStatusChange} />
				</Col>
				<Col span={24} sm={12} lg={7}>
					<Select style={{ width: '100%' }} options={sortOptions} value={sortValue} onChange={onSortChange} />
				</Col>
				<Col span={24}>
					<div className='don-hang-actions don-hang-toolbar-actions'>
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

export default OrderFilters;
