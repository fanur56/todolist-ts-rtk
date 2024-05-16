import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action: AnyAction) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        },
      )
      .addMatcher(
        (action: AnyAction) => action.type.endsWith("/rejected"),
        (state) => {
          state.status = "failed";
        },
      )
      .addMatcher(
        (action: AnyAction) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        },
      );
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export type AppInitialState = ReturnType<typeof slice.getInitialState>;
