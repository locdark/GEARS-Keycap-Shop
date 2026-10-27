package com.gears.patterns.observer;

/**
 * DESIGN PATTERN: OBSERVER
 * Giao dien Nguoi quan sat (Observer Interface).
 * Cac giao dien UI (Table, Dashboard, POS) se dang ky lang nghe thay doi du lieu.
 */
public interface IDataObserver {
    /**
     * Duoc goi khi co su kien thay doi du lieu xay ra trong he thong
     * @param eventType Loai su kien ("PRODUCT_UPDATED", "ORDER_CREATED", "STOCK_CHANGED", "CUSTOMER_UPDATED", ...)
     * @param data Du lieu kem theo su kien
     */
    void onDataChanged(String eventType, Object data);
}
