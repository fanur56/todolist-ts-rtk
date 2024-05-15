import { Task } from "features/TodolistsList/ui/Todolist/Task/Task";
import React from "react";
import { TaskStatuses } from "common/enum/enum";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists-reducer";

type Props = {
  tasks: TaskType[];
  todolist: TodolistDomainType;
};

export const Tasks = ({ tasks, todolist }: Props) => {
  let tasksForTodolist = tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  return <>{tasksForTodolist?.map((t) => <Task key={t.id} task={t} todolistId={todolist.id} />)}</>;
};
