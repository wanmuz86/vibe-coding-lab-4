import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App.tsx";

const sampleTitles = [
  "Draft the workshop outline",
  "Review the starter repository",
  "Prepare sample tasks for the demo",
] as const;

function renderApp() {
  const user = userEvent.setup();
  render(<App />);
  return { user };
}

function itemsNamed(title: string): HTMLElement[] {
  return screen.getAllByRole("listitem").filter((item) => {
    return within(item).queryByText(title) !== null;
  });
}

function itemNamed(title: string): HTMLElement {
  const match = itemsNamed(title)[0];
  if (!match) {
    throw new Error(`No task named "${title}".`);
  }
  return match;
}

async function addTask(title: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Task title"), title);
  await user.click(screen.getByRole("button", { name: "Add Task" }));
  return user;
}

describe("Task Manager", () => {
  it("starts with three sample tasks and two remaining", () => {
    renderApp();

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("2 tasks remaining")).toBeInTheDocument();
    expect(screen.queryByText("No tasks yet.")).not.toBeInTheDocument();

    for (const title of sampleTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }

    const completed = itemNamed("Review the starter repository");

    expect(within(completed).getByRole("checkbox")).toBeChecked();
    expect(within(completed).getByText("Completed")).toBeInTheDocument();
    expect(
      within(itemNamed("Draft the workshop outline")).getByRole("checkbox"),
    ).not.toBeChecked();
  });

  it("adds a valid task, clears the input, and updates the remaining count", async () => {
    const { user } = renderApp();
    const input = screen.getByLabelText("Task title");

    await user.type(input, "Ship the handout");
    await user.click(screen.getByRole("button", { name: "Add Task" }));

    expect(screen.getByText("Ship the handout")).toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("3 tasks remaining")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("adds a task when the form is submitted with Enter", async () => {
    const { user } = renderApp();

    await user.type(
      screen.getByLabelText("Task title"),
      "Book the classroom{Enter}",
    );

    expect(screen.getByText("Book the classroom")).toBeInTheDocument();
    expect(screen.getByLabelText("Task title")).toHaveValue("");
    expect(screen.getByText("3 tasks remaining")).toBeInTheDocument();
  });

  it("trims surrounding whitespace before adding a task", async () => {
    renderApp();
    await addTask("   Schedule the lab   ");

    expect(screen.getByText("Schedule the lab")).toBeInTheDocument();
    expect(
      screen.queryByText("   Schedule the lab   "),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Task title")).toHaveValue("");
  });

  it("shows feedback and does not add a blank title", async () => {
    const { user } = renderApp();
    const input = screen.getByLabelText("Task title");

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Enter a task title.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "task-title-error");
    expect(alert).toHaveAttribute("id", "task-title-error");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("2 tasks remaining")).toBeInTheDocument();
  });

  it("shows feedback and does not add a whitespace-only title", async () => {
    const { user } = renderApp();
    const input = screen.getByLabelText("Task title");

    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: "Add Task" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a task title.");
    expect(input).toHaveValue("   ");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("2 tasks remaining")).toBeInTheDocument();
  });

  it("shows both tasks when a duplicate title is added", async () => {
    renderApp();
    await addTask("Draft the workshop outline");

    const matches = itemsNamed("Draft the workshop outline");
    expect(matches).toHaveLength(2);
    expect(matches[0]).not.toBe(matches[1]);
    expect(screen.getByText("3 tasks remaining")).toBeInTheDocument();
  });

  it("marks a task complete and incomplete and updates the remaining count", async () => {
    const { user } = renderApp();
    const item = itemNamed("Draft the workshop outline");

    const checkbox = within(item).getByRole("checkbox", {
      name: "Draft the workshop outline",
    });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(within(item).getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("1 task remaining")).toBeInTheDocument();

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(within(item).queryByText("Completed")).not.toBeInTheDocument();
    expect(screen.getByText("2 tasks remaining")).toBeInTheDocument();
  });

  it("deletes only the chosen task when titles are duplicates", async () => {
    const { user } = renderApp();
    await user.type(
      screen.getByLabelText("Task title"),
      "Prepare sample tasks for the demo",
    );
    await user.click(screen.getByRole("button", { name: "Add Task" }));

    const matches = itemsNamed("Prepare sample tasks for the demo");
    expect(matches).toHaveLength(2);
    const firstCopy = matches[0];
    const secondCopy = matches[1];
    if (!firstCopy || !secondCopy) {
      throw new Error("Expected two tasks with the same title.");
    }

    await user.click(
      within(firstCopy).getByRole("button", {
        name: "Delete Prepare sample tasks for the demo",
      }),
    );

    expect(itemsNamed("Prepare sample tasks for the demo")).toEqual([
      secondCopy,
    ]);
    expect(screen.getByText("Draft the workshop outline")).toBeInTheDocument();
    expect(
      screen.getByText("Review the starter repository"),
    ).toBeInTheDocument();
    expect(screen.getByText("2 tasks remaining")).toBeInTheDocument();
  });

  it("shows the empty state after every task is deleted", async () => {
    const { user } = renderApp();

    for (const title of sampleTitles) {
      await user.click(
        within(itemNamed(title)).getByRole("button", {
          name: `Delete ${title}`,
        }),
      );
    }

    expect(screen.getByText("No tasks yet.")).toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: "Tasks" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("0 tasks remaining")).toBeInTheDocument();
  });
});
