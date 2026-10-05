import { TaskForm } from "../components/TaskForm.tsx";
import { TaskList } from "../components/TaskList.tsx";
import { useTasks } from "../hooks/useTasks.ts";

function remainingLabel(count: number): string {
  return count === 1 ? "1 task remaining" : `${count} tasks remaining`;
}

export function App() {
  const { tasks, titleError, remainingCount, addTask, toggleTask, deleteTask } =
    useTasks();

  return (
    <main className="app">
      <h1>Task Manager</h1>
      <p className="summary">
        Add tasks, mark them complete, and delete them. Refreshing the page
        restores the sample tasks.
      </p>
      <TaskForm error={titleError} onAddTask={addTask} />
      <p className="remaining" aria-live="polite">
        {remainingLabel(remainingCount)}
      </p>
      <TaskList
        tasks={tasks}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
      />
    </main>
  );
}
