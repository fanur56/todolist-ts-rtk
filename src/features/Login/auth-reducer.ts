import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { authAPI, LoginParamsType } from "features/Login/authAPI";
import { createAppAsyncThunk } from "common/utils";
import { BaseResponseType } from "common/types";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

// thunks
const initializeApp = createAppAsyncThunk<{ isLoggedIn: true }, undefined>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppInitialized({ isInitialized: true }));
    }
  },
);

const login = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  LoginParamsType
>(`${slice.name}/login`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.login(arg);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, dispatch, false);
      return rejectWithValue(res.data);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

const logout = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  undefined
>(`${slice.name}/logout`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(clearTasksAndTodolists({ tasks: {}, todolists: [] }));
      return { isLoggedIn: false };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
