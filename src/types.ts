export type NavigationModule =
  | "dashboard"
  | "chat"
  | "intelligence"
  | "research"
  | "analysis"
  | "agents"
  | "projects"
  | "memory"
  | "documents"
  | "creative"
  | "tasks"
  | "history"
  | "models"
  | "statistics"
  | "settings"
  | "control-center";

export interface Message {
  id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  model: string;
  isLocal: boolean;
  timestamp: number;
  reasoning?: {
    facts: string[];
    assumptions: string[];
    risks: string[];
    confidence: "High" | "Moderate" | "Low";
  };
}

export interface StrategicAnalysis {
  id: string;
  topic: string;
  depth: "quick" | "standard" | "deep" | "advanced";
  executiveSummary: string;
  confirmedFacts: string[];
  assumptions: string[];
  contradictions: string[];
  risks: { risk: string; severity: "low" | "medium" | "critical"; mitigation: string }[];
  scenarios: { title: string; likelihood: string; impact: string }[];
  recommendation: string;
  timestamp: number;
}

export interface AgentConfig {
  id: string;
  slug: string;
  name: string;
  role: string;
  description: string;
  defaultModel: string;
  status: "active" | "disabled";
  permissions: {
    internetSearch: "disabled" | "read_only" | "execute_approval" | "automatic";
    modifyDocuments: "disabled" | "read_only" | "execute_approval" | "automatic";
    readMemory: "disabled" | "read_only" | "execute_approval" | "automatic";
    externalActions: "disabled" | "read_only" | "execute_approval" | "automatic";
  };
}

export interface MemoryItem {
  id: string;
  category: "preference" | "context" | "decision" | "factual";
  content: string;
  certainty: "confirmed" | "hypothesis" | "opinion";
  projectId?: string;
  createdAt: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  documentCount: number;
  updatedAt: number;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  category: "security" | "model" | "document" | "admin";
  timestamp: number;
  status: "success" | "warning" | "denied";
}
