import React, { useCallback, useEffect } from "react";
import { TodolistsList } from "features/TodolistsList/ui/TodolistsList";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { useSelector } from "react-redux";
import { AppRootStateType } from "./store";
import { RequestStatusType } from "./app-reducer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "features/Login/Login";
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { authThunks } from "features/Login/auth-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status);
  const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized);
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authThunks.initializeApp());
  }, []);

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logout());
  }, []);

  if (!isInitialized) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">News</Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<TodolistsList demo={demo} />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
