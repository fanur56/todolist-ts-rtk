import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import React, { useCallback } from "react";
import { TodolistDomainType, todolistsThunks } from "features/TodolistsList/model/todolists/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";

type Props = {
  todolist: TodolistDomainType;
};

export const TodolistTitle = ({ todolist }: Props) => {
  const dispatch = useAppDispatch();
  const { removeTodolist, changeTodolistTitle } = todolistsThunks;

  const removeTodolistHandler = () => dispatch(removeTodolist(todolist.id));

  const changeTodolistTitleCallback = useCallback(
    (title: string) => {
      dispatch(changeTodolistTitle({ id: todolist.id, title }));
    },
    [todolist.id],
  );

  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleCallback} />
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  );
};
