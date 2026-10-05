import { useState } from "react";
import { initialTasks } from "../data/initialTasks.ts";
import {
  addTask as addTaskToList,
  countRemainingTasks,
  createTaskId,
  deleteTask as deleteTaskById,
  toggleTaskCompletion,
} from "../domain/taskOperations.ts";
import type { Task } from "../domain/task.ts";

function copyTasks(tasks: readonly Task[]): Task[] {
  return tasks.map((task) => ({ ...task }));
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => copyTasks(initialTasks));
  const [titleError, setTitleError] = useState<string | null>(null);

  function addTask(rawTitle: string): boolean {
    const result = addTaskToList(tasks, rawTitle, createTaskId());

    if (!result.ok) {
      setTitleError(result.error);
      return false;
    }

    setTitleError(null);
    setTasks(result.tasks);
    return true;
  }

  function toggleTask(id: string) {
    setTasks((current) => toggleTaskCompletion(current, id));
  }

  function deleteTask(id: string) {
    setTasks((current) => deleteTaskById(current, id));
  }

  return {
    tasks,
    titleError,
    remainingCount: countRemainingTasks(tasks),
    addTask,
    toggleTask,
    deleteTask,
  };
}
