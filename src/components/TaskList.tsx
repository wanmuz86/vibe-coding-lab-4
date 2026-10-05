import type { Task } from "../domain/task.ts";
import { TaskItem } from "./TaskItem.tsx";

type TaskListProps = {
  tasks: readonly Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet.</p>;
  }

  return (
    <ul className="task-list" aria-label="Tasks">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
}
