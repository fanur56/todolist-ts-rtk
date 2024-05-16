import React, { useCallback, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { taskThunks } from "features/TodolistsList/model/tasks/tasks-reducer";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";
import { FilterTasksButton } from "features/TodolistsList/ui/Todolist/FilterTasksButton/FilterTasksButton";
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks";
import { TodolistTitle } from "features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle";
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
      return dispatch(taskThunks.addTaskTC({ todolistId: props.todolist.id, title })).unwrap();
    },
    [props.todolist.id],
  );

  return (
    <div>
      <TodolistTitle todolist={props.todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === "loading"} />
      <Tasks tasks={props.tasks} todolist={props.todolist} />
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButton todolist={props.todolist} />
      </div>
    </div>
  );
});
