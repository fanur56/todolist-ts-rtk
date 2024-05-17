import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { authAPI, LoginParamsType } from "features/Login/authAPI";
import { createAppAsyncThunk } from "common/utils";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.initializeApp.fulfilled),
      (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      },
    );
  },
});

// thunks
const initializeApp = createAppAsyncThunk<{ isLoggedIn: true }, undefined>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const res = await authAPI.me().finally(() => dispatch(appActions.setAppInitialized({ isInitialized: true })));
    if (res.data.resultCode === 0) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue(res.data);
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
  const res = await authAPI.login(arg);
  if (res.data.resultCode === 0) {
    return { isLoggedIn: true };
  } else {
    const isShowAppError = !res.data.fieldsErrors.length;
    handleServerAppError(res.data, dispatch, isShowAppError);
    return rejectWithValue(res.data);
  }
});

const logout = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  undefined
>(`${slice.name}/logout`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await authAPI.logout();
  if (res.data.resultCode === 0) {
    dispatch(clearTasksAndTodolists({ tasks: {}, todolists: [] }));
    return { isLoggedIn: false };
  } else {
    handleServerAppError(res.data, dispatch);
    return rejectWithValue(res.data);
  }
});

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
