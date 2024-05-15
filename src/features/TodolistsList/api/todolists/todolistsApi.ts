import { instance } from "common/api/baseApi";
import { BaseResponseType } from "common/types/types";
import { TodolistType } from "features/TodolistsList/api/todolists/todolistsApi.types";

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistType }>>("todo-lists", {
      title: title,
    });
  },
  deleteTodolist(id: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    return instance.put<BaseResponseType>(`todo-lists/${id}`, { title: title });
  },
};
