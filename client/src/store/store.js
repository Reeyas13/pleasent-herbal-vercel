import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js"
import cartReducer from "./cart/index.js"
import { injectStore } from "../axios.js";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "auth",
  storage,
  version: 1,
};

const presistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer:{
        auth:presistedAuthReducer,
        cart:cartReducer
    },
     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})  

injectStore(store);
export const persistor = persistStore(store);
export default store