import React, { ChangeEvent } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { TaskStatuses } from "common/enum/enum";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { removeTaskTC, taskThunks } from "features/TodolistsList/model/tasks/tasks-reducer";
import s from "features/TodolistsList/ui/Todolist/Tasks/Task/Task.module.css";

type Props = {
  task: TaskType;
  todolistId: string;
};

export const Task = React.memo(({ task, todolistId }: Props) => {
  const dispatch = useAppDispatch();
  const removeTaskHandler = () => {
    dispatch(removeTaskTC(task.id, todolistId));
  };

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked;
    dispatch(
      taskThunks.updateTaskTC({
        taskId: task.id,
        domainModel: { status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New },
        todolistId: todolistId,
      }),
    );
  };

  const taskTitleChangeHandler = (newValue: string) => {
    dispatch(
      taskThunks.updateTaskTC({
        taskId: task.id,
        domainModel: { title: newValue },
        todolistId: todolistId,
      }),
    );
  };

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={changeTaskStatusHandler} />

      <EditableSpan value={task.title} onChange={taskTitleChangeHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
