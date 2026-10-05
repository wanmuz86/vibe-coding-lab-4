import type { Task } from "./task.ts";

export const EMPTY_TITLE_MESSAGE = "Enter a task title.";

export type AddTaskResult =
  { ok: true; tasks: Task[] } | { ok: false; error: string };

export function createTaskId(): string {
  return crypto.randomUUID();
}

export function addTask(
  tasks: readonly Task[],
  rawTitle: string,
  id: string,
): AddTaskResult {
  const title = rawTitle.trim();

  if (title.length === 0) {
    return { ok: false, error: EMPTY_TITLE_MESSAGE };
  }

  return {
    ok: true,
    tasks: [...tasks, { id, title, completed: false }],
  };
}

export function toggleTaskCompletion(
  tasks: readonly Task[],
  id: string,
): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );
}

export function deleteTask(tasks: readonly Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id);
}

export function countRemainingTasks(tasks: readonly Task[]): number {
  return tasks.filter((task) => !task.completed).length;
}
