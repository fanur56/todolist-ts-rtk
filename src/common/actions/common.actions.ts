import { createAction } from "@reduxjs/toolkit";
import { TasksStateType } from "features/TodolistsList/tasks-reducer";
import { TodolistDomainType } from "features/TodolistsList/todolists-reducer";

export type ClearTaskAndTodolistType = {
  tasks: TasksStateType;
  todolists: TodolistDomainType[];
};

export const clearTasksAndTodolists = createAction<ClearTaskAndTodolistType>("common/clear-tasks-todolists");
