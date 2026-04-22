import { orderCustomers, orderProducts } from '@/pages/DonHang/data';
import { OrderStatus, type OrderFormValues, type OrderRecord, orderStatusLabel } from '@/pages/DonHang/types';
import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import rules from '@/utils/rules';
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Select, Space, Typography } from 'antd';
import { useEffect, useMemo } from 'react';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
	style: 'currency',
	currency: 'VND',
});

const buildInitialItems = (record?: OrderRecord) =>
	record?.items?.length
		? record.items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
		: [{ productId: undefined, quantity: 1 }];

const OrderFormDrawer = (props: {
	visible: boolean;
	record?: OrderRecord;
	onCancel: () => void;
	onSubmit: (values: OrderFormValues, editingId?: string) => boolean;
}) => {
	const { visible, record, onCancel, onSubmit } = props;
	const [form] = Form.useForm<OrderFormValues>();
	const watchedItems = Form.useWatch('items', form);

	useEffect(() => {
		if (!visible) return;
		form.setFieldsValue({
			code: record?.code,
			customerId: record?.customerId,
			orderDate: record?.orderDate ?? new Date().toISOString(),
			status: record?.status ?? OrderStatus.PENDING,
			note: record?.note,
			items: buildInitialItems(record) as OrderFormValues['items'],
		});
	}, [form, record, visible]);

	const total = useMemo(
		() =>
			(watchedItems ?? []).reduce((sum, item) => {
				const product = orderProducts.find((recordItem) => recordItem.id === item?.productId);
				const quantity = Number(item?.quantity ?? 0);
				return sum + (product?.price ?? 0) * quantity;
			}, 0),
		[watchedItems],
	);

	return (
		<Drawer
			destroyOnClose
			forceRender
			title={record ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
			placement='right'
			width='min(960px, 100vw)'
			visible={visible}
			onClose={onCancel}
		>
			<Form
				form={form}
				layout='vertical'
				onFinish={(values) => {
					const items = (values.items ?? []).filter((item) => item?.productId && Number(item?.quantity ?? 0) > 0);
					if (!items.length) {
						form.setFields([
							{
								name: 'items',
								errors: ['Vui lòng chọn ít nhất một sản phẩm'],
							},
						]);
						return;
					}

					const duplicateProduct = items.some(
						(item, index, list) => list.findIndex((recordItem) => recordItem.productId === item.productId) !== index,
					);
					if (duplicateProduct) {
						form.setFields([
							{
								name: 'items',
								errors: ['Sản phẩm trong đơn không được trùng nhau'],
							},
						]);
						return;
					}

					onSubmit(
						{
							...values,
							orderDate: values.orderDate,
							items,
						},
						record?.id,
					) && onCancel();
				}}
				initialValues={{
					status: OrderStatus.PENDING,
					items: [{ productId: undefined, quantity: 1 }],
					orderDate: new Date().toISOString(),
				}}
			>
				<Row gutter={[16, 0]}>
					<Col span={24} md={12}>
						<Form.Item label='Mã đơn hàng' name='code' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Nhập mã đơn hàng' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Khách hàng' name='customerId' rules={[...rules.required]}>
							<Select
								showSearch
								placeholder='Chọn khách hàng'
								optionFilterProp='label'
								options={orderCustomers.map((customer) => ({
									value: customer.id,
									label: `${customer.name} - ${customer.phone}`,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item label='Ngày đặt hàng' name='orderDate' rules={[...rules.required]}>
							<MyDatePicker showTime format='DD/MM/YYYY HH:mm' />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item label='Trạng thái' name='status' rules={[...rules.required]}>
							<Select
								options={Object.values(OrderStatus).map((status) => ({
									value: status,
									label: orderStatusLabel[status],
								}))}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item label='Tổng tiền tạm tính'>
							<Typography.Title level={5} style={{ margin: 0, lineHeight: '32px' }}>
								{currencyFormatter.format(total)}
							</Typography.Title>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.List name='items'>
							{(fields, { add, remove }) => (
								<Space direction='vertical' style={{ width: '100%' }} size={12}>
									<div className='order-form-items-header'>
										<Typography.Title level={5} style={{ margin: 0 }}>
											Sản phẩm trong đơn
										</Typography.Title>
										<Button type='dashed' onClick={() => add({ productId: undefined, quantity: 1 })}>
											Thêm sản phẩm
										</Button>
									</div>
									{fields.map((field, index) => {
										const productId = form.getFieldValue(['items', field.name, 'productId']);
										const quantity = Number(form.getFieldValue(['items', field.name, 'quantity']) ?? 1);
										const selectedProduct = orderProducts.find((item) => item.id === productId);
										const itemTotal = (selectedProduct?.price ?? 0) * quantity;

										return (
											<Row key={field.key} gutter={[12, 0]} align='middle'>
												<Col span={24} md={12}>
													<Form.Item
														{...field}
														name={[field.name, 'productId']}
														label={index === 0 ? 'Sản phẩm' : ''}
														rules={[...rules.required]}
													>
														<Select
															showSearch
															placeholder='Chọn sản phẩm'
															optionFilterProp='label'
															options={orderProducts.map((product) => ({
																value: product.id,
																label: `${product.name} - ${currencyFormatter.format(product.price)}`,
															}))}
														/>
													</Form.Item>
												</Col>
												<Col span={12} md={5}>
													<Form.Item
														{...field}
														name={[field.name, 'quantity']}
														label={index === 0 ? 'Số lượng' : ''}
														rules={[...rules.required]}
													>
														<InputNumber min={1} precision={0} style={{ width: '100%' }} />
													</Form.Item>
												</Col>
												<Col span={12} md={5}>
													<Form.Item label={index === 0 ? 'Thành tiền' : ''}>
														<div className='order-form-item-total'>{currencyFormatter.format(itemTotal)}</div>
													</Form.Item>
												</Col>
												<Col span={24} md={2}>
													<Button danger type='link' onClick={() => remove(field.name)} style={{ padding: 0 }}>
														Xóa
													</Button>
												</Col>
											</Row>
										);
									})}
								</Space>
							)}
						</Form.List>
					</Col>
					<Col span={24}>
						<Form.Item label='Ghi chú' name='note'>
							<TinyEditor height={220} hideMenubar miniToolbar />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{record ? 'Lưu thay đổi' : 'Thêm mới'}
					</Button>
					<Button onClick={onCancel}>Hủy</Button>
				</div>
			</Form>
		</Drawer>
	);
};

export default OrderFormDrawer;
