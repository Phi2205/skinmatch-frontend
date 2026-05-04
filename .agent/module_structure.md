# Chuẩn Module Structure (Frontend)

Mọi module trong dự án frontend đều phải tuân theo cấu trúc thư mục sau để đảm bảo tính nhất quán và dễ bảo trì.

## Cấu trúc thư mục

```
src/modules/[module-name]/
├── types/
│   └── [module-name].type.ts       # Interface/Type definitions
├── services/
│   └── [module-name].service.ts    # API service functions (axios calls)
└── components/
    ├── create-[module-name]-modal.tsx   # Modal tạo mới (hỗ trợ bulk + JSON)
    └── update-[module-name]-modal.tsx   # Modal chỉnh sửa
```

## Quy tắc chung

1. **Types**: Đặt trong `types/`. Export interface cho entity chính và các params nếu cần.
2. **Services**: Đặt trong `services/`. Mỗi function gọi 1 API endpoint. Sử dụng `axiosInstance` từ `@/services/axiosInstance`.
3. **Components**: Đặt trong `components/`. Modal tạo mới nên hỗ trợ:
   - **Form View**: Tạo nhiều item cùng lúc (useFieldArray)
   - **JSON View**: Paste JSON để tạo hàng loạt
4. **Pages**: Đặt trong `src/app/admin/[module-name]/page.tsx`.

## Ví dụ Service

```typescript
import axiosInstance from "@/services/axiosInstance";
import { Entity } from "../types/entity.type";
import { ApiResponse } from "@/types/response.type";

export const getAllEntities = async (): Promise<ApiResponse<Entity[]>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Entity[]>>('/entities');
        return response.data;
    } catch (error) {
        console.error('Error fetching entities:', error);
        throw error;
    }
}
```

## Ví dụ Admin Page

- Sử dụng `AdminSidebar` từ `@/shared/components/admin/sidebar`
- Sử dụng TanStack Query (`useQuery`, `useMutation`, `useQueryClient`)
- Toast notifications: `import { toast } from 'sonner'`
- Animations: `framer-motion` cho modals
- Form: `react-hook-form` + `zod` validation
- Tất cả button/interactive elements phải có `cursor-pointer`
