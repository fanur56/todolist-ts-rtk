import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import React from "react";
import {
  changeTodolistTitleTC,
  removeTodolistTC,
  TodolistDomainType,
} from "features/TodolistsList/model/todolists/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type Props = {
  todolist: TodolistDomainType;
};

export const TodolistTitle = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();

  const removeTodolistHandler = () => dispatch(removeTodolistTC(todolist.id));

  const changeTodolistTitleHandler = (title: string) => {
    dispatch(changeTodolistTitleTC(todolist.id, title));
  };

  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  );
};
