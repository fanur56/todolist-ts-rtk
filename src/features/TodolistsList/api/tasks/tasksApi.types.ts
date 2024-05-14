import { TaskPriorities, TaskStatuses } from "common/enum/enum";
import { UpdateDomainTaskModelType } from "features/TodolistsList/model/tasks/tasks-reducer";

export type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};

export type ArgUpdateTaskType = {
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
  todolistId: string;
};
