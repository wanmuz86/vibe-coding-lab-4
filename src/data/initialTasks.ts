import type { Task } from "../domain/task.ts";

export const initialTasks: readonly Task[] = [
  {
    id: "sample-draft-outline",
    title: "Draft the workshop outline",
    completed: false,
  },
  {
    id: "sample-review-starter",
    title: "Review the starter repository",
    completed: true,
  },
  {
    id: "sample-prepare-demo",
    title: "Prepare sample tasks for the demo",
    completed: false,
  },
];
