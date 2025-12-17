import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product";
import { eventReducer } from "./reducers/event";
import { cartReducer } from "./reducers/cart";
import { wishlistReducer } from "./reducers/wishlist";
import { orderReducer } from "./reducers/order";
import { appSettingsReducer } from "./reducers/appSettings";
import adminBannerReducer from "./reducers/adminBanner";
import bannerReducer from "./reducers/banner";
import { deliverymanReducer } from "./reducers/deliveryman";
import { categoryReducer } from "./reducers/category";

const Store = configureStore({
  reducer: {
    // Reducers
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    appSettings: appSettingsReducer,
    adminBanner: adminBannerReducer,
    banner: bannerReducer,
    deliveryman: deliverymanReducer,
    category: categoryReducer,
  },
});

export default Store;
