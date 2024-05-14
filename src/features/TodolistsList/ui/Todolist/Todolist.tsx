import React, { useCallback, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { Task } from "features/TodolistsList/ui/Todolist/Task/Task";
import {
  changeTodolistTitleTC,
  removeTodolistTC,
  TodolistDomainType,
  todolistsActions,
} from "features/TodolistsList/model/todolists/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { taskThunks } from "features/TodolistsList/model/tasks/tasks-reducer";
import { TaskStatuses } from "common/enum/enum";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist = React.memo(function ({ demo = false, ...props }: PropsType) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo) {
      return;
    }
    dispatch(taskThunks.fetchTasksTC(props.todolist.id));
  }, []);

  const addTaskCallback = useCallback(
    (title: string) => {
      dispatch(taskThunks.addTaskTC({ todolistId: props.todolist.id, title }));
    },
    [props.todolist.id],
  );

  const removeTodolistHandler = () => {
    const thunk = removeTodolistTC(props.todolist.id);
    dispatch(thunk);
  };

  const changeTodolistTitleCallback = useCallback(
    (title: string) => {
      const thunk = changeTodolistTitleTC(props.todolist.id, title);
      dispatch(thunk);
    },
    [props.todolist.id],
  );

  const onAllClickHandler = useCallback(
    () => dispatch(todolistsActions.changeTodolistFilter({ id: props.todolist.id, filter: "all" })),
    [props.todolist.id],
  );

  const onActiveClickHandler = useCallback(
    () => dispatch(todolistsActions.changeTodolistFilter({ id: props.todolist.id, filter: "active" })),
    [props.todolist.id],
  );

  const onCompletedClickHandler = useCallback(
    () => dispatch(todolistsActions.changeTodolistFilter({ id: props.todolist.id, filter: "completed" })),
    [props.todolist.id],
  );

  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallback} />
        <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === "loading"} />
      <div>{tasksForTodolist?.map((t) => <Task key={t.id} task={t} todolistId={props.todolist.id} />)}</div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={props.todolist.filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={props.todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={props.todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
