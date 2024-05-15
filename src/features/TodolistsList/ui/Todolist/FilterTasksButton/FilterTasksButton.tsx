import { Button } from "@mui/material";
import React from "react";
import { TodolistDomainType, todolistsActions } from "features/TodolistsList/model/todolists/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type Props = {
  todolist: TodolistDomainType;
};

export const FilterTasksButton = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();

  const onAllClickHandler = () => dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: "all" }));

  const onActiveClickHandler = () =>
    dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: "active" }));

  const onCompletedClickHandler = () =>
    dispatch(todolistsActions.changeTodolistFilter({ id: todolist.id, filter: "completed" }));

  return (
    <>
      <Button variant={todolist.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "outlined" : "text"}
        onClick={onActiveClickHandler}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        onClick={onCompletedClickHandler}
        color={"secondary"}
      >
        Completed
      </Button>
    </>
  );
};
