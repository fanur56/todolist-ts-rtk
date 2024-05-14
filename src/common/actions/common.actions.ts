import { createAction } from "@reduxjs/toolkit";
import { TasksStateType } from "features/TodolistsList/model/tasks/tasks-reducer";
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists-reducer";

export type ClearTaskAndTodolistType = {
  tasks: TasksStateType;
  todolists: TodolistDomainType[];
};

export const clearTasksAndTodolists = createAction<ClearTaskAndTodolistType>("common/clear-tasks-todolists");
