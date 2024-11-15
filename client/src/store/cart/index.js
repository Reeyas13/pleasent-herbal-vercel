import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ProductAdd from "../../dashboard/product/ProductAdd";
import api from "../../axios";

const initialState={
    item:[],
    quantity:0,
    total:0,
    isLoading:false,
    
    fetchError:null
}

export const fetchCart = createAsyncThunk(
    "/api/cart",
    async (data) => {
        const response = await api.post('/api/cart/user',{
            withCredentials: true
        });
        return response.data;
    }

)
export const subCart = createAsyncThunk(
    '/api/cart/sub',
    async (data) => {
       const response = await api.post('/api/cart/sub', { itemId:data }, { withCredentials: true })
       return response.data
    }
)

export const addCart = createAsyncThunk(
    '/api/cart/add',
    async (data) => {
       const response = await api.post('/api/cart/add', { itemId:data }, { withCredentials: true })
       return response.data
    }
)
export const addToCart = createAsyncThunk(
    '/api/cart/create',
    async (data) => {
        console.log(data)
       const response = await api.post('/api/cart/', { productId:data.data.productId, quantity:data.data.quantity }, { withCredentials: true })
       return response.data
    }
)
export const checkoutAll = createAsyncThunk(
    '/api/cart/checkout',
    async (data) => {
        console.log({dataFromCheckout:data.city_id})
       const response = await api.post('/api/cart/checkout', { address:data.address, city_id:data.city_id, state:data.state, paymentType:data.paymentType}, { withCredentials: true })
       return   response.data
    }
)

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        addItemToCart:(state,action)=>{}
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchCart.pending,(state)=>{
            state.isLoading=true;
        }).addCase(fetchCart.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.item= action.payload.success? action.payload.cart:null;
            state.quantity=action.payload.success? action.payload.quantity:0;
            state.total=action.payload.success? action.payload.total:0;
        }).addCase(fetchCart.rejected,(state,action)=>{
            state.isLoading=false;
        }).addCase(subCart.pending,(state)=>{
            state.isLoading=true;
        }).addCase(subCart.fulfilled,(state,action)=>{
            console.log({res:action.payload});
            state.isLoading=false;
        }).addCase(subCart.rejected,(state,action)=>{
            state.isLoading=false;
        }).addCase(addCart.pending,(state)=>{
            state.isLoading=true;
        }).addCase(addCart.fulfilled,(state,action)=>{
            state.isLoading=false;
        }).addCase(addCart.rejected,(state,action)=>{
            state.isLoading=false;
        }).addCase(addToCart.pending,(state)=>{
            state.isLoading=true;
        }).addCase(addToCart.fulfilled,(state,action)=>{
            state.isLoading=false;
        }).addCase(addToCart.rejected,(state,action)=>{
            state.isLoading=false;
        })
    }

})

export const { addItemToCart } = cartSlice.actions;
export default cartSlice.reducer;
