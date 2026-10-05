# Trainer notes

These notes are for the person distributing and teaching from this starter. Participants can read them, but the reserved labs below are intentionally not implemented.

## Distribute an identical baseline

Give every participant the same passing tree.

1. Confirm `npm run check` passes on the shared baseline.
2. Publish that tree to the course remote, or pack a zip of the project that includes `package-lock.json` and excludes `node_modules`, `dist`, and `coverage`.
3. When you are ready to freeze the baseline, record one commit and one tag. This repository does not create that commit or tag for you.
4. Tell participants to clone that commit, or to unpack the zip, and then run `npm ci`.

`npm ci` installs the lockfile exactly. Ask participants not to delete `package-lock.json` and not to run a dependency upgrade before class unless you have published a new baseline.

## Separate working branches or copies

Keep the shared baseline unchanged during labs.

- Preferred: each participant creates a lab branch from the frozen baseline.
- Alternative: each lab uses a separate folder copied from the baseline zip. Use this when the lab is not about Git.

Example, after you have tagged the baseline:

```bash
git switch -c lab-04-harness checkpoint/00-baseline
```

Ask participants not to commit lab experiments onto the baseline branch.

## Verify installation before class

On a clean machine, or after deleting `node_modules`:

```bash
node -v
npm ci
npm run check
npm run dev
```

`node -v` should report a supported version from the README. `npm run check` should exit with no failures. In the browser, confirm the three sample tasks, add a task, mark it complete, delete it, and submit an empty title so the validation message appears.

## Checkpoint naming

Use this scheme when you choose to mark progress. Do not treat this file as those Git objects; create the branches and tags yourself when a checkpoint is real.

| Checkpoint                  | Suggested name                  |
| --------------------------- | ------------------------------- |
| Frozen starter              | `checkpoint/00-baseline`        |
| Codebase understanding      | `checkpoint/01-understand`      |
| Repository-aware planning   | `checkpoint/02-plan`            |
| Specification engineering   | `checkpoint/03-specify`         |
| Agent harness configuration | `checkpoint/04-harness`         |
| Agentic feature development | `checkpoint/05-agentic-feature` |
| Build–test–fix loop         | `checkpoint/06-build-test-fix`  |

Matching lab branches can use the same words, for example `lab-04-harness`.

## Reserved exercises

Leave these out of the shared baseline. Do not add reference solutions to this repository.

- **Maximum task-title length.** Reserved for the harness lab. Participants will decide the rule, document it, and implement it with the agent setup they create in that lab.
- **Task search.** Reserved for the planning lab and the agentic implementation lab. Participants will specify and build search themselves.
- **A temporary, reversible failure.** Reserved for the loop lab. During that session you may introduce a short-lived failure so participants can practice a build–test–fix cycle. Remove it before you republish the baseline.

The shipped starter must pass `npm run check`. Do not leave a deliberate failure, a skipped test, or a weakened lint rule in the baseline.

## Agent instructions

Participants create their own agent instruction file during the harness lab. Do not add `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.cursor/rules`, or an equivalent file to the baseline. If a participant already has a local instruction file, leave it in their own copy rather than publishing it as part of the starter.
