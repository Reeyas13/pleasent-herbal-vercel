import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axios";
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
twoStep: false
};

export const registerUser = createAsyncThunk(
  "/api/user/register",
  async (formData) => {
    const response = await api.post("/api/user/register", formData, {
      withCredentials: true,
    });
    return response.data;
  }
);
export const checkAuth = createAsyncThunk(
  "/api/user/check-auth",
  async (formData) => {
    const response = await api.get("/api/user/check-auth",  {
      withCredentials: true,
      headers:{
        "Cache-Control": "no-store, no-cache,  must-revalidate, proxy-revalidate",
      }
    });
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/api/user/login",
  async (formData) => {
    const response = await api.post("/api/user/login", formData, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const verifyLogin = createAsyncThunk(
  "/api/user/verify-login",
  async (formData) => {
    console.log(formData)
    const response = await api.post("/api/user//two-step", {verificationCode: formData}, {
      withCredentials: true,
    });
    return response.data;
  }
)
  // export const logout = createAsyncThunk(
  //   '/api/user/logout',
  //   async () => {
  //     const response = await api.post('/api/user/logout', {
  //       withCredentials: true
  //     })
  //     return response.data
  //   }
  // )
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
     logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.error = null;
      state.token = "";
    },

    
    setUser: (state, action) => {

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user =  null;
        console.log(action.payload)
        state.twoStep = action.payload.success?true:false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      }) .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload?.sucess ? true : false;
        state.user = action.payload?.sucess ? action.payload?.user : null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      }).addCase(verifyLogin.pending, (state) => {
        state.isLoading = true;
      }).addCase(verifyLogin.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false;
        state.isAuthenticated = action.payload?.success ? true : false;
        state.user = action.payload?.success ? action.payload?.user : null;
      }).addCase(verifyLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      ;
  },
});

export const { setUser,logout } = authSlice.actions;
export default authSlice.reducer;
