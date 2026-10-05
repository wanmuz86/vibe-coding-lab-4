import type { Task } from "../domain/task.ts";

type TaskItemProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskItem({ task, onToggleTask, onDeleteTask }: TaskItemProps) {
  const checkboxId = `task-${task.id}-completed`;

  return (
    <li className={task.completed ? "task-item is-complete" : "task-item"}>
      <input
        id={checkboxId}
        className="task-checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={() => {
          onToggleTask(task.id);
        }}
      />
      <label className="task-title" htmlFor={checkboxId}>
        {task.title}
      </label>
      {task.completed ? <span className="task-status">Completed</span> : null}
      <button
        className="button button-danger"
        type="button"
        aria-label={`Delete ${task.title}`}
        onClick={() => {
          onDeleteTask(task.id);
        }}
      >
        Delete
      </button>
    </li>
  );
}
