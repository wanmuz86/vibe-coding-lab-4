import { describe, expect, it } from "vitest";
import type { Task } from "./task.ts";
import {
  EMPTY_TITLE_MESSAGE,
  addTask,
  countRemainingTasks,
  createTaskId,
  deleteTask,
  toggleTaskCompletion,
} from "./taskOperations.ts";

const draft: Task = {
  id: "task-draft",
  title: "Draft the workshop outline",
  completed: false,
};

const review: Task = {
  id: "task-review",
  title: "Review the starter repository",
  completed: true,
};

describe("addTask", () => {
  it("trims surrounding whitespace and adds a task with the given id", () => {
    const tasks = [draft];

    expect(addTask(tasks, "  Schedule the lab  ", "task-lab")).toEqual({
      ok: true,
      tasks: [
        draft,
        { id: "task-lab", title: "Schedule the lab", completed: false },
      ],
    });
    expect(tasks).toEqual([draft]);
  });

  it("rejects an empty title", () => {
    const tasks = [draft];

    expect(addTask(tasks, "", "task-empty")).toEqual({
      ok: false,
      error: EMPTY_TITLE_MESSAGE,
    });
    expect(tasks).toEqual([draft]);
  });

  it("rejects a whitespace-only title", () => {
    expect(addTask([draft], " \n\t ", "task-blank")).toEqual({
      ok: false,
      error: EMPTY_TITLE_MESSAGE,
    });
  });

  it("allows duplicate titles when the ids are different", () => {
    const result = addTask([draft], draft.title, "task-draft-copy");

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.tasks).toHaveLength(2);
    expect(result.tasks[0]).toBe(draft);
    expect(result.tasks[1]).toEqual({
      id: "task-draft-copy",
      title: draft.title,
      completed: false,
    });
    expect(result.tasks[0]?.id).not.toBe(result.tasks[1]?.id);
  });
});

describe("toggleTaskCompletion", () => {
  it("toggles only the task with the given id", () => {
    const result = toggleTaskCompletion([draft, review], review.id);

    expect(result[0]).toBe(draft);
    expect(result[1]).toEqual({ ...review, completed: false });
  });

  it("can mark a task complete and then incomplete", () => {
    const completed = toggleTaskCompletion([draft], draft.id);
    const reopened = toggleTaskCompletion(completed, draft.id);

    expect(completed[0]).toEqual({ ...draft, completed: true });
    expect(reopened[0]).toEqual(draft);
  });

  it("does not modify any task when the id is unknown", () => {
    const tasks = [draft, review];
    const result = toggleTaskCompletion(tasks, "missing-task");

    expect(result).toEqual(tasks);
    expect(result[0]).toBe(draft);
    expect(result[1]).toBe(review);
  });
});

describe("deleteTask", () => {
  it("deletes only the task with the given id", () => {
    const result = deleteTask([draft, review], draft.id);

    expect(result).toEqual([review]);
    expect(result[0]).toBe(review);
  });

  it("preserves the other task when titles are duplicates", () => {
    const firstCopy: Task = {
      id: "copy-1",
      title: "Prepare sample tasks for the demo",
      completed: false,
    };
    const secondCopy: Task = {
      id: "copy-2",
      title: "Prepare sample tasks for the demo",
      completed: true,
    };

    expect(deleteTask([firstCopy, secondCopy], "copy-1")).toEqual([secondCopy]);
    expect(deleteTask([firstCopy, secondCopy], "copy-2")[0]).toBe(firstCopy);
  });

  it("does not modify any task when the id is unknown", () => {
    const tasks = [draft, review];
    const result = deleteTask(tasks, "missing-task");

    expect(result).toEqual(tasks);
    expect(result[0]).toBe(draft);
    expect(result[1]).toBe(review);
  });
});

describe("countRemainingTasks", () => {
  it("counts tasks that are not complete", () => {
    expect(countRemainingTasks([draft, review])).toBe(1);
    expect(countRemainingTasks([])).toBe(0);
    expect(
      countRemainingTasks([
        { ...draft, completed: true },
        { ...review, completed: true },
      ]),
    ).toBe(0);
  });
});

describe("createTaskId", () => {
  it("returns a different id on each call", () => {
    const first = createTaskId();
    const second = createTaskId();

    expect(first).not.toBe(second);
    expect(first).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});
