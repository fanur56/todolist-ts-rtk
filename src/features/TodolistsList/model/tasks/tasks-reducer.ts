import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions, todolistsThunks } from "features/TodolistsList/model/todolists/todolists-reducer";
import { ClearTaskAndTodolistType, clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk } from "common/utils/CreateAppAsyncThunk";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enum/enum";
import { ArgUpdateTaskType, TaskType, UpdateTaskModelType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { tasksApi } from "features/TodolistsList/api/tasks/tasksApi";

const slice = createSlice({
  name: "task",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const tasksForTodolist = state[action.payload.todolistId];
      const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasksForTodolist.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task);
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasksForTodolist = state[action.payload.todolistId];
        const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) {
          tasksForTodolist[index] = {
            ...tasksForTodolist[index],
            ...action.payload.model,
          };
        }
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      })

      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => (state[tl.id] = []));
      })
      .addCase(clearTasksAndTodolists.type, (state, action: PayloadAction<ClearTaskAndTodolistType>) => {
        return action.payload.tasks;
      });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;

// thunks
const fetchTasksTC = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await tasksApi.getTasks(todolistId);
      return { tasks: res.data.items, todolistId };
    } catch (error: unknown) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const addTaskTC = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await tasksApi.createTask(arg.todolistId, arg.title);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        return { task };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error: unknown) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const removeTaskTC = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>(`${slice.name}/removeTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await tasksApi.deleteTask(arg.todolistId, arg.taskId);
  if (res.data.resultCode === ResultCode.Success) {
    return arg;
  } else {
    handleServerAppError(res.data, dispatch);
    return rejectWithValue(res.data);
  }
});

const updateTaskTC = createAppAsyncThunk<any, ArgUpdateTaskType>(`${slice.name}/updateTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const state = getState();
  const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
  if (!task) {
    return rejectWithValue(null);
  }
  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...arg.domainModel,
  };
  const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel);
  if (res.data.resultCode === 0) {
    return {
      taskId: arg.taskId,
      model: arg.domainModel,
      todolistId: arg.todolistId,
    };
  } else {
    handleServerAppError(res.data, dispatch);
  }
});

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

export const taskThunks = { fetchTasksTC, addTaskTC, updateTaskTC };
