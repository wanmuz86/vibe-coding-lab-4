import { useState, type FormEvent } from "react";

type TaskFormProps = {
  error: string | null;
  onAddTask: (title: string) => boolean;
};

export function TaskForm({ error, onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const errorId = "task-title-error";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const added = onAddTask(title);

    if (added) {
      setTitle("");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="task-title">Task title</label>
      <div className="form-row">
        <input
          id="task-title"
          name="title"
          type="text"
          value={title}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <button className="button button-primary" type="submit">
          Add Task
        </button>
      </div>
      {error ? (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
