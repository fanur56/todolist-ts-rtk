import { AppThunk } from "app/store";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { appActions } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { ClearTaskAndTodolistType, clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk } from "common/utils/CreateAppAsyncThunk";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { ArgUpdateTaskType, TaskType, todolistsAPI, UpdateTaskModelType } from "features/TodolistsList/todolistsApi";
import { TaskPriorities, TaskStatuses } from "common/enum/enum";

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
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
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
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
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
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
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

export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then(() => {
      const action = tasksActions.removeTask({ taskId, todolistId });
      dispatch(action);
    });
  };

const updateTaskTC = createAppAsyncThunk<any, ArgUpdateTaskType>(`${slice.name}/updateTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  try {
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
    const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
    if (res.data.resultCode === 0) {
      return {
        taskId: arg.taskId,
        model: arg.domainModel,
        todolistId: arg.todolistId,
      };
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
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
