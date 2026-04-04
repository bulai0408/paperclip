import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC_ROOT = path.resolve(__dirname, "..");

const cases: Array<{ file: string; forbidden: string[] }> = [
  {
    file: "components/NewIssueDialog.tsx",
    forbidden: [
      "Failed to create issue. Try again.",
    ],
  },
  {
    file: "components/IssueDocumentsSection.tsx",
    forbidden: [
      "Failed to delete document",
      "Failed to restore document revision",
      "Failed to save document",
      "This document changed while you were editing. Your local draft is preserved and autosave is paused.",
      "Keep my draft",
      "Reload remote",
      "Overwrite remote",
      "Remote revision",
      "Viewing historical revision",
      "Could not save",
      "Delete this document? This cannot be undone.",
    ],
  },
  {
    file: "pages/Inbox.tsx",
    forbidden: [
      "Run exited with an error.",
      "No project",
      "Failed run",
      "Retrying…",
      "requested by",
      "Human join request",
      "Failed to approve join request",
      "No inbox items match your search.",
      "Inbox zero.",
      "Budget at",
      "utilization this month",
    ],
  },
  {
    file: "pages/ProjectWorkspaceDetail.tsx",
    forbidden: [
      "Failed to save workspace.",
      "Failed to update workspace.",
      "Runtime services stopped.",
      "Runtime services restarted.",
      "Runtime services started.",
      "Failed to control runtime services.",
      "Loading workspace…",
      "Failed to load workspace",
      "Workspace not found for this project.",
      "No unsaved changes.",
      "No command recorded",
    ],
  },
  {
    file: "pages/PluginSettings.tsx",
    forbidden: [
      "just now",
      "s ago",
      "m ago",
      "h ago",
      "d ago",
    ],
  },
  {
    file: "lib/timeAgo.ts",
    forbidden: [
      "just now",
      "m ago",
      "h ago",
      "d ago",
      "w ago",
      "mo ago",
    ],
  },
  {
    file: "pages/ExecutionWorkspaceDetail.tsx",
    forbidden: [
      "Workspace runtime JSON must be a JSON object.",
      "Repo URL must be a valid URL.",
      "Copied",
    ],
  },
  {
    file: "components/BudgetIncidentCard.tsx",
    forbidden: [
      "Project execution is paused. New work in this project will not start until you resolve the budget incident.",
      "This scope is paused. New heartbeats will not start until you resolve the budget incident.",
    ],
  },
  {
    file: "pages/InstanceSettings.tsx",
    forbidden: [
      "Failed to update heartbeat.",
      "Failed to disable all heartbeats.",
      "Unknown error",
      "Disable timer heartbeats for all ",
      ": \"never\"",
    ],
  },
  {
    file: "pages/ProjectWorkspaceDetail.tsx",
    forbidden: [
      "Runs when this workspace needs custom bootstrap",
      "Runs before project-level execution workspace teardown",
      "Default runtime services for this workspace. Execution workspaces inherit this config unless they set an override. If you do not know the commands yet, ask your CEO to configure them for you.",
    ],
  },
  {
    file: "components/IssueDocumentsSection.tsx",
    forbidden: [
      "Deleting...",
    ],
  },
  {
    file: "components/IssueProperties.tsx",
    forbidden: [
      "Assign to requester",
      "Assign to ${creatorUserLabel}",
    ],
  },
  {
    file: "pages/IssueDetail.tsx",
    forbidden: [
      "label: \"Me\"",
    ],
  },
  {
    file: "components/ui/command.tsx",
    forbidden: [
      "Command Palette",
      "Search for a command to run...",
    ],
  },
  {
    file: "lib/assignees.ts",
    forbidden: [
      "label: \"Me\"",
      "return \"Me\"",
      "return \"Board\"",
    ],
  },
  {
    file: "plugins/launchers.tsx",
    forbidden: [
      "return \"Unknown error\"",
    ],
  },
  {
    file: "components/CommentThread.tsx",
    forbidden: [
      "?? \"Board\"",
      ": \"Unassigned\"",
      ": \"System\"",
    ],
  },
];

describe("runtime i18n regression audit", () => {
  for (const { file, forbidden } of cases) {
    it(`does not keep known leaked English UI strings in ${file}`, () => {
      const source = fs.readFileSync(path.join(SRC_ROOT, file), "utf8");

      for (const phrase of forbidden) {
        expect(source).not.toContain(phrase);
      }
    });
  }
});
