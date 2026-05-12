export enum ToolType {
  BLOATWARE = "bloatware",
  CLEANUP = "cleanup",
  REGISTRY = "registry",
  MONITOR = "monitor",
}

export type ScanProfile = "gaming" | "workstation" | "minimalist";

export interface BloatwareItem {
  id: string;
  name: string;
  publisher: string;
  impact: "high" | "medium" | "low";
  reason: string;
  size: string;
  isPUP: boolean;
}

export interface TerminalMessage {
  id: string;
  text: string;
  type: "system" | "user" | "companion" | "error";
  timestamp: Date;
  origin?: "chat" | "idle" | "system";
}

export interface ColorScheme {
  name: string;
  color: string;
}
