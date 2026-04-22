import type { OrderRecord } from '@/pages/DonHang/types';

export const ORDER_STORAGE_KEY = 'don-hang-data';

export const getOrdersFromStorage = (fallback: OrderRecord[]) => {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = localStorage.getItem(ORDER_STORAGE_KEY);
		if (!raw) return fallback;
		const parsed = JSON.parse(raw) as OrderRecord[];
		return Array.isArray(parsed) && parsed.length ? parsed : fallback;
	} catch (error) {
		return fallback;
	}
};

export const saveOrdersToStorage = (orders: OrderRecord[]) => {
	if (typeof window === 'undefined') return;
	localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
};
