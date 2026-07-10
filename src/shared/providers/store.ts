import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/modules/cart/store/cart.slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      // Thêm các reducers khác tại đây (ví dụ: wishlist, compare)
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
