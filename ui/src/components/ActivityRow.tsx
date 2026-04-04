import { Link } from "@/lib/router";
import { Identity } from "./Identity";
import { timeAgo } from "../lib/timeAgo";
import { cn } from "../lib/utils";
import { deriveProjectUrlKey, type ActivityEvent, type Agent } from "@paperclipai/shared";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

const ACTION_VERB_KEYS: Record<string, string> = {
  "issue.created": "activityRow.verbs.issueCreated",
  "issue.updated": "activityRow.verbs.issueUpdated",
  "issue.checked_out": "activityRow.verbs.issueCheckedOut",
  "issue.released": "activityRow.verbs.issueReleased",
  "issue.comment_added": "activityRow.verbs.issueCommentAdded",
  "issue.attachment_added": "activityRow.verbs.issueAttachmentAdded",
  "issue.attachment_removed": "activityRow.verbs.issueAttachmentRemoved",
  "issue.document_created": "activityRow.verbs.issueDocumentCreated",
  "issue.document_updated": "activityRow.verbs.issueDocumentUpdated",
  "issue.document_deleted": "activityRow.verbs.issueDocumentDeleted",
  "issue.commented": "activityRow.verbs.issueCommented",
  "issue.deleted": "activityRow.verbs.issueDeleted",
  "agent.created": "activityRow.verbs.agentCreated",
  "agent.updated": "activityRow.verbs.agentUpdated",
  "agent.paused": "activityRow.verbs.agentPaused",
  "agent.resumed": "activityRow.verbs.agentResumed",
  "agent.terminated": "activityRow.verbs.agentTerminated",
  "agent.key_created": "activityRow.verbs.agentKeyCreated",
  "agent.budget_updated": "activityRow.verbs.agentBudgetUpdated",
  "agent.runtime_session_reset": "activityRow.verbs.agentRuntimeSessionReset",
  "heartbeat.invoked": "activityRow.verbs.heartbeatInvoked",
  "heartbeat.cancelled": "activityRow.verbs.heartbeatCancelled",
  "approval.created": "activityRow.verbs.approvalCreated",
  "approval.approved": "activityRow.verbs.approvalApproved",
  "approval.rejected": "activityRow.verbs.approvalRejected",
  "project.created": "activityRow.verbs.projectCreated",
  "project.updated": "activityRow.verbs.projectUpdated",
  "project.deleted": "activityRow.verbs.projectDeleted",
  "goal.created": "activityRow.verbs.goalCreated",
  "goal.updated": "activityRow.verbs.goalUpdated",
  "goal.deleted": "activityRow.verbs.goalDeleted",
  "cost.reported": "activityRow.verbs.costReported",
  "cost.recorded": "activityRow.verbs.costRecorded",
  "company.created": "activityRow.verbs.companyCreated",
  "company.updated": "activityRow.verbs.companyUpdated",
  "company.archived": "activityRow.verbs.companyArchived",
  "company.budget_updated": "activityRow.verbs.companyBudgetUpdated",
};

function humanizeValue(value: unknown): string {
  if (typeof value !== "string") return String(value ?? "none");
  return value.replace(/_/g, " ");
}

function formatVerb(action: string, details: Record<string, unknown> | null | undefined, t: TFunction): string {
  if (action === "issue.updated" && details) {
    const previous = (details._previous ?? {}) as Record<string, unknown>;
    if (details.status !== undefined) {
      const from = previous.status;
      return from
        ? t("activityRow.changedStatusFromTo", { from: humanizeValue(from), to: humanizeValue(details.status) })
        : t("activityRow.changedStatusTo", { to: humanizeValue(details.status) });
    }
    if (details.priority !== undefined) {
      const from = previous.priority;
      return from
        ? t("activityRow.changedPriorityFromTo", { from: humanizeValue(from), to: humanizeValue(details.priority) })
        : t("activityRow.changedPriorityTo", { to: humanizeValue(details.priority) });
    }
  }
  const key = ACTION_VERB_KEYS[action];
  return key ? t(key) : action.replace(/[._]/g, " ");
}

function entityLink(entityType: string, entityId: string, name?: string | null): string | null {
  switch (entityType) {
    case "issue": return `/issues/${name ?? entityId}`;
    case "agent": return `/agents/${entityId}`;
    case "project": return `/projects/${deriveProjectUrlKey(name, entityId)}`;
    case "goal": return `/goals/${entityId}`;
    case "approval": return `/approvals/${entityId}`;
    default: return null;
  }
}

interface ActivityRowProps {
  event: ActivityEvent;
  agentMap: Map<string, Agent>;
  entityNameMap: Map<string, string>;
  entityTitleMap?: Map<string, string>;
  className?: string;
}

export function ActivityRow({ event, agentMap, entityNameMap, entityTitleMap, className }: ActivityRowProps) {
  const { t } = useTranslation();
  const verb = formatVerb(event.action, event.details, t);

  const isHeartbeatEvent = event.entityType === "heartbeat_run";
  const heartbeatAgentId = isHeartbeatEvent
    ? (event.details as Record<string, unknown> | null)?.agentId as string | undefined
    : undefined;

  const name = isHeartbeatEvent
    ? (heartbeatAgentId ? entityNameMap.get(`agent:${heartbeatAgentId}`) : null)
    : entityNameMap.get(`${event.entityType}:${event.entityId}`);

  const entityTitle = entityTitleMap?.get(`${event.entityType}:${event.entityId}`);

  const link = isHeartbeatEvent && heartbeatAgentId
    ? `/agents/${heartbeatAgentId}/runs/${event.entityId}`
    : entityLink(event.entityType, event.entityId, name);

  const actor = event.actorType === "agent" ? agentMap.get(event.actorId) : null;
  const actorName = actor?.name ?? (event.actorType === "system" ? t("activityRow.system") : event.actorType === "user" ? t("activityRow.board") : event.actorId || t("activityRow.unknown"));

  const inner = (
    <div className="flex gap-3">
      <p className="flex-1 min-w-0 truncate">
        <Identity
          name={actorName}
          size="xs"
          className="align-baseline"
        />
        <span className="text-muted-foreground ml-1">{verb} </span>
        {name && <span className="font-medium">{name}</span>}
        {entityTitle && <span className="text-muted-foreground ml-1">— {entityTitle}</span>}
      </p>
      <span className="text-xs text-muted-foreground shrink-0 pt-0.5">{timeAgo(event.createdAt)}</span>
    </div>
  );

  const classes = cn(
    "px-4 py-2 text-sm",
    link && "cursor-pointer hover:bg-accent/50 transition-colors",
    className,
  );

  if (link) {
    return (
      <Link to={link} className={cn(classes, "no-underline text-inherit block")}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={classes}>
      {inner}
    </div>
  );
}
