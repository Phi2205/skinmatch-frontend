# Chuẩn API Response Format (Frontend)

Mọi API response từ backend đều tuân theo 2 cấu trúc chính dưới đây. Frontend phải luôn sử dụng đúng cách truy cập dữ liệu tương ứng.

## 1. Standard Response (không phân trang)

Dùng cho: single item, danh sách không phân trang, create/update/delete.

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

### Cách sử dụng:
```typescript
const { data: response } = useQuery({ queryKey: ['categories'], queryFn: getAllCategories });
const items = response?.data || [];       // data trực tiếp là giá trị
```

---

## 2. Paginated Response (có phân trang)

Dùng cho: GET danh sách có pagination (VD: `/products?page=1&limit=10`).

```typescript
interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];        // ← Mảng dữ liệu nằm trong data.items
    meta: {
      page: number;
      limit: number;
      totalItems: number;     // ← KHÔNG PHẢI "total"
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
```

### Cách sử dụng:
```typescript
const { data: response } = useQuery({ queryKey: ['products', params], queryFn: () => getProducts(params) });
const products = response?.data?.items || [];       // ← data.items
const meta = response?.data?.meta || defaultMeta;   // ← data.meta
```

### ⚠️ LƯU Ý QUAN TRỌNG:
- Tổng số bản ghi là `meta.totalItems` — **KHÔNG PHẢI** `meta.total`
- Dữ liệu nằm trong `response.data.items` — **KHÔNG PHẢI** `response.data` trực tiếp
- Meta nằm trong `response.data.meta` — **KHÔNG PHẢI** `response.meta`

---

## Bảng so sánh nhanh

| Mục đích            | Standard              | Paginated                    |
|---------------------|-----------------------|------------------------------|
| Truy cập data       | `response.data`       | `response.data.items`        |
| Truy cập meta       | N/A                   | `response.data.meta`         |
| Tổng số bản ghi     | N/A                   | `meta.totalItems`            |
| Type trong frontend | `ApiResponse<T>`      | `PaginatedResponse<T>`       |
| File type           | `src/types/response.type.ts` | `src/modules/product/types/product.type.ts` |
