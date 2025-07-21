import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../../api";
import { ApiError, AuthState, LoginData, SignUpData, User } from "./types";
import { AxiosError } from "axios";

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchMe",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      return res.data.user;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const status = error.response?.status;
      if (status === 401) {
        console.info("User not authenticated");
        return thunkAPI.rejectWithValue("Not authenticated");
      }
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const signup = createAsyncThunk<
  User,
  SignUpData,
  { rejectValue: string }
>(
  "auth/signup",
  async (
    formData: { username: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await api.post("auth/register", formData);
      return response.data.user;
    } catch (err) {
      const error = err as ApiError;
      let errorMessage = "Signup failed";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const login = createAsyncThunk<User, LoginData, { rejectValue: string }>(
  "auth/login",
  async (formData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", formData, {
        withCredentials: true,
      });
      return response.data.user;
    } catch (err) {
      const error = err as ApiError;
      let errorMessage = "Login failed";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      const error = err as ApiError;
      let errorMessage = "Logout failed";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const googleLogin = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("auth/googleLogin", async (token: string, thunkApi) => {
  try {
    const response = await api.post(
      "/auth/google",
      { token },
      { withCredentials: true }
    );
    if (!response || !response.data) {
      console.error("Response is undefined or empty", response);
      return thunkApi.rejectWithValue("No data received from server");
    }
    console.log("Google login response data", response.data);
    return response.data.user;
  } catch (err) {
    const error = err as ApiError;
    let errorMessage = "Google Login failed";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return thunkApi.rejectWithValue(errorMessage);
  }
});

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMe.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.loading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      )
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
        state.isAuthenticated = false;
      })
      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error =
          (action.payload as string) || "Signup failed due to an unknown error";
        state.isAuthenticated = false;
      })
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
        state.isAuthenticated = false;
      })
      // logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload || "Logout failed";
      })
      // google login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google login failed";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
