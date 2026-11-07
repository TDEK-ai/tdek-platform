import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Compass,
  Search,
  LineChart,
  Bot,
  FolderGit2,
  Brain,
  FileText,
  Palette,
  CheckSquare,
  History,
  Cpu,
  BarChart3,
  Settings,
  ShieldAlert,
  Send,
  RefreshCw,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Menu,
  X,
  FileCheck,
  Sliders,
  DollarSign,
  Lock,
  Info
} from "lucide-react";
import {
  NavigationModule,
  Message,
  StrategicAnalysis,
  AgentConfig,
  MemoryItem,
  ProjectItem,
  AuditLog,
} from "./types";

const INITIAL_AGENTS: AgentConfig[] = [
  {
    id: "ag-1",
    slug: "general",
    name: "General Intelligence",
    role: "General strategic productivity & analytical dialogue",
    description: "Default assistant adhering to critical objectivity principles.",
    defaultModel: "llama3:latest",
    status: "active",
    permissions: {
      internetSearch: "execute_approval",
      modifyDocuments: "execute_approval",
      readMemory: "read_only",
      externalActions: "disabled",
    },
  },
  {
    id: "ag-2",
    slug: "research",
    name: "Research Agent",
    role: "Literature, citation check, and fact-finding",
    description: "Focuses on corroborating claims and dating evidence.",
    defaultModel: "llama3:latest",
    status: "active",
    permissions: {
      internetSearch: "automatic",
      modifyDocuments: "read_only",
      readMemory: "read_only",
      externalActions: "execute_approval",
    },
  },
  {
    id: "ag-3",
    slug: "analysis",
    name: "Analysis Agent",
    role: "Contradiction detection and scenario modeling",
    description: "Evaluates hidden flaws, cost models, and decision trees.",
    defaultModel: "llama3:latest",
    status: "active",
    permissions: {
      internetSearch: "disabled",
      modifyDocuments: "read_only",
      readMemory: "read_only",
      externalActions: "disabled",
    },
  },
  {
    id: "ag-4",
    slug: "strategic-advisor",
    name: "Strategic Advisor",
    role: "Executive risk framing and counter-strategy",
    description: "Challenges implicit user assumptions respectfully.",
    defaultModel: "llama3:latest",
    status: "active",
    permissions: {
      internetSearch: "read_only",
      modifyDocuments: "execute_approval",
      readMemory: "read_only",
      externalActions: "execute_approval",
    },
  },
  {
    id: "ag-5",
    slug: "creative",
    name: "Creative Studio Agent",
    role: "Writing synthesis, proposals & visual prompts",
    description: "Drafts executive briefs and connects to local ComfyUI pipelines.",
    defaultModel: "mistral:latest",
    status: "active",
    permissions: {
      internetSearch: "read_only",
      modifyDocuments: "automatic",
      readMemory: "read_only",
      externalActions: "disabled",
    },
  },
  {
    id: "ag-6",
    slug: "document",
    name: "Document & RAG Agent",
    role: "Semantic extraction and vector search reasoning",
    description: "Synthesizes uploaded files without data leakage.",
    defaultModel: "llama3:latest",
    status: "active",
    permissions: {
      internetSearch: "disabled",
      modifyDocuments: "read_only",
      readMemory: "read_only",
      externalActions: "disabled",
    },
  },
];

export default function App() {
  const [currentModule, setCurrentModule] = useState<NavigationModule>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOwner] = useState(true);

  const [ollamaConnected, setOllamaConnected] = useState<boolean>(false);
  const [ollamaChecking, setOllamaChecking] = useState<boolean>(false);
  const [ollamaEndpoint] = useState<string>("http://127.0.0.1:11434");
  const [detectedLocalModels, setDetectedLocalModels] = useState<string[]>([
    "llama3:latest",
    "mistral:latest",
    "nomic-embed-text:latest",
  ]);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("tdek_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "msg-0",
        sender: "assistant",
        content:
          "TDEK Strategic Intelligence Engine initialized. Operating under local-first zero-cost parameters. State your operational challenge, hypothesis, or research goal.",
        model: "llama3:latest",
        isLocal: true,
        timestamp: Date.now(),
        reasoning: {
          facts: ["Local Ollama interface reachable", "Zero external paid APIs active"],
          assumptions: ["User expects critical strategic evaluation"],
          risks: ["Host memory constraints govern token context length"],
          confidence: "High",
        },
      },
    ];
  });
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedChatModel, setSelectedChatModel] = useState("llama3:latest");

  const [analysisTopic, setAnalysisTopic] = useState("");
  const [analysisDepth, setAnalysisDepth] = useState<"quick" | "standard" | "deep" | "advanced">("standard");
  const [analyses, setAnalyses] = useState<StrategicAnalysis[]>(() => {
    const saved = localStorage.getItem("tdek_analyses");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "sa-1",
            topic: "Migration from Cloud LLM APIs to Air-Gapped Local Inference",
            depth: "deep",
            executiveSummary:
              "Migrating strategic operations to local open weights reduces recurring API costs to €0 and eliminates third-party telemetry risks. However, host hardware memory bandwidth dictates latency.",
            confirmedFacts: [
              "Local models (Llama 3 8B) run fully offline on Apple Silicon or 12GB+ VRAM.",
              "Zero per-token billing.",
            ],
            assumptions: [
              "Workstation remains locally powered during intensive analytical cycles.",
            ],
            contradictions: [
              "User desires real-time sub-second generation while requesting 70B parameter precision on consumer hardware.",
            ],
            risks: [
              {
                risk: "VRAM OOM on oversized RAG context windows",
                severity: "medium",
                mitigation: "Strict chunking threshold of 800 tokens via nomic-embed-text",
              },
            ],
            scenarios: [
              {
                title: "Dedicated Local Inference Server",
                likelihood: "High",
                impact: "Maximum data privacy with sustained throughput",
              },
            ],
            recommendation:
              "Deploy Ollama as local service, default to quantized 8B weights, reserve external providers for optional emergency fallback.",
            timestamp: Date.now() - 3600000,
          },
        ];
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem("tdek_projects");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "proj-1",
            name: "Sovereign Infrastructure Initiative",
            description: "Evaluating self-hosted AI compute, local models and air-gapped data retention.",
            isPrivate: true,
            documentCount: 4,
            updatedAt: Date.now() - 86400000,
          },
          {
            id: "proj-2",
            name: "Q3 Strategic Market Assessment",
            description: "Competitor positioning, pricing pressures and scenario forecasting.",
            isPrivate: true,
            documentCount: 8,
            updatedAt: Date.now() - 172800000,
          },
        ];
  });
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    const saved = localStorage.getItem("tdek_memories");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "mem-1",
            category: "preference",
            content: "Always distinguish empirical facts from interpretive hypotheses.",
            certainty: "confirmed",
            createdAt: Date.now() - 500000,
          },
          {
            id: "mem-2",
            category: "decision",
            content: "External paid AI APIs remain disabled by default unless explicitly armed.",
            certainty: "confirmed",
            createdAt: Date.now() - 400000,
          },
          {
            id: "mem-3",
            category: "context",
            content: "Primary compute node: Local workstation with Ollama daemon at port 11434.",
            certainty: "confirmed",
            createdAt: Date.now() - 300000,
          },
        ];
  });
  const [newMemoryText, setNewMemoryText] = useState("");
  const [newMemoryCategory, setNewMemoryCategory] = useState<MemoryItem["category"]>("context");
  const [newMemoryCertainty, setNewMemoryCertainty] = useState<MemoryItem["certainty"]>("confirmed");

  const [agents] = useState<AgentConfig[]>(() => {
    const saved = localStorage.getItem("tdek_agents");
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [tasks] = useState([
    {
      id: "tsk-1",
      title: "Index Research Repository (Local Vector Store)",
      agent: "Document & RAG Agent",
      status: "completed",
      progress: 100,
    },
    {
      id: "tsk-2",
      title: "Synthesize Competitive Scenario Matrix",
      agent: "Strategic Advisor",
      status: "running",
      progress: 68,
    },
    {
      id: "tsk-3",
      title: "External Source Verification Scan",
      agent: "Research Agent",
      status: "waiting_approval",
      progress: 0,
    },
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: "aud-1",
      action: "Local Ollama model invoked (llama3:latest)",
      user: "owner@tdek.local",
      category: "model",
      timestamp: Date.now() - 120000,
      status: "success",
    },
    {
      id: "aud-2",
      action: "Attempted unauthenticated external API call",
      user: "system_router",
      category: "security",
      timestamp: Date.now() - 340000,
      status: "denied",
    },
  ]);

  const [allowExternalProviders, setAllowExternalProviders] = useState(false);
  const [donationUrl, setDonationUrl] = useState("https://github.com/sponsors/tdek");
  const [inviteEmail, setInviteEmail] = useState("");
  const [generatedInviteTokens, setGeneratedInviteTokens] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("tdek_messages", JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem("tdek_analyses", JSON.stringify(analyses));
  }, [analyses]);
  useEffect(() => {
    localStorage.setItem("tdek_projects", JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem("tdek_memories", JSON.stringify(memories));
  }, [memories]);

  const probeOllama = async () => {
    setOllamaChecking(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${ollamaEndpoint}/api/tags`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        const models = (data.models || []).map((m: any) => m.name);
        setDetectedLocalModels(models.length > 0 ? models : ["llama3:latest"]);
        setOllamaConnected(true);
      } else {
        setOllamaConnected(false);
      }
    } catch (e) {
      setOllamaConnected(false);
    } finally {
      setOllamaChecking(false);
    }
  };

  useEffect(() => {
    probeOllama();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userText = chatInput.trim();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: userText,
      model: "User Query",
      isLocal: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsGenerating(true);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        content: `Strategic evaluation of: "${userText}"\n\n1. Structural Breakdown:\nThe query concerns operational resource allocation. Sovereign local model deployment eliminates third-party subscription overhead.\n\n2. Analytical Perspective:\nPrioritizing data independence prevents cloud provider lock-in and protects proprietary knowledge assets.\n\n3. Strategic Recommendation:\nProceed with offline local vector embeddings. Ensure prompt templates enforce strict distinction between confirmed evidence and assumptions.`,
        model: `${selectedChatModel} (Local Core)`,
        isLocal: true,
        timestamp: Date.now(),
        reasoning: {
          facts: ["Processed with €0 per-token overhead", "Storage retains active context"],
          assumptions: ["User prioritizes privacy and local control"],
          risks: ["Throughput bounded by local device memory bandwidth"],
          confidence: "High",
        },
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 600);
  };

  const handleExecuteAnalysis = () => {
    if (!analysisTopic.trim()) return;

    const newAnalysis: StrategicAnalysis = {
      id: `sa-${Date.now()}`,
      topic: analysisTopic,
      depth: analysisDepth,
      executiveSummary: `Strategic assessment on '${analysisTopic}'. Analysis demonstrates high leverage potential through disciplined sovereign architecture.`,
      confirmedFacts: [
        "Inference operates at €0.00 incremental cost.",
        "Zero data transmission to external APIs.",
      ],
      assumptions: [
        "Target environment supports quantized local model weights.",
      ],
      contradictions: [
        "Requirement for absolute privacy contradicts past usage of commercial cloud chat tools.",
      ],
      risks: [
        {
          risk: "Local host memory saturation during large context queries",
          severity: "medium",
          mitigation: "Enforce 800-token chunk limits in vector ingestion pipeline",
        },
      ],
      scenarios: [
        {
          title: "Full Sovereign Local Posture",
          likelihood: "80%",
          impact: "Complete privacy and regulatory compliance",
        },
      ],
      recommendation:
        "Standardize on local model pipelines and keep external providers disabled by default.",
      timestamp: Date.now(),
    };

    setAnalyses([newAnalysis, ...analyses]);
    setAnalysisTopic("");
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const proj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      description: newProjectDesc.trim() || "No description provided.",
      isPrivate: true,
      documentCount: 0,
      updatedAt: Date.now(),
    };
    setProjects([proj, ...projects]);
    setNewProjectName("");
    setNewProjectDesc("");
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;
    const mem: MemoryItem = {
      id: `mem-${Date.now()}`,
      category: newMemoryCategory,
      content: newMemoryText.trim(),
      certainty: newMemoryCertainty,
      createdAt: Date.now(),
    };
    setMemories([mem, ...memories]);
    setNewMemoryText("");
  };

  const handleGenerateInvite = () => {
    if (!inviteEmail.trim()) return;
    const token = `TDEK-INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setGeneratedInviteTokens([`${inviteEmail} -> ${token}`, ...generatedInviteTokens]);
    setInviteEmail("");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 antialiased">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-slate-300 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col border-r border-slate-800 shadow-xl md:shadow-none`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold tracking-wider text-white shadow-md shadow-blue-500/20">
              T
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wider text-white">TDEK</div>
              <div className="text-[10px] font-medium tracking-tight text-slate-400">
                STRATEGIC INTELLIGENCE
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3 text-xs">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "chat", label: "AI Chat", icon: MessageSquare },
            { id: "intelligence", label: "Intelligence", icon: Compass },
            { id: "research", label: "Research", icon: Search },
            { id: "analysis", label: "Analysis", icon: LineChart },
            { id: "agents", label: "AI Agents", icon: Bot },
            { id: "projects", label: "Projects", icon: FolderGit2 },
            { id: "memory", label: "Memory", icon: Brain },
            { id: "documents", label: "Documents", icon: FileText },
            { id: "creative", label: "Creative Studio", icon: Palette },
            { id: "tasks", label: "Tasks", icon: CheckSquare },
            { id: "history", label: "History", icon: History },
            { id: "models", label: "Model Center", icon: Cpu },
            { id: "statistics", label: "Statistics", icon: BarChart3 },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const active = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentModule(item.id as NavigationModule);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {isOwner && (
            <div className="mt-4 border-t border-slate-800 pt-3">
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Governance
              </div>
              <button
                onClick={() => {
                  setCurrentModule("control-center");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left font-medium transition-colors ${
                  currentModule === "control-center"
                    ? "bg-amber-600 text-white shadow-sm font-semibold"
                    : "text-amber-400/90 hover:bg-amber-950/40 hover:text-amber-300"
                }`}
              >
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Control Center</span>
              </button>
            </div>
          )}
        </nav>

        <div className="border-t border-slate-800 bg-slate-950/70 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Local Engine (Ollama)</span>
            <span
              className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                ollamaConnected
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {ollamaChecking ? "Checking..." : ollamaConnected ? "Connected" : "Simulated"}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 truncate">
            {ollamaConnected ? "127.0.0.1:11434 (Active)" : "Offline • Internal fallback"}
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-slate-600 hover:text-slate-900 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-semibold capitalize text-slate-800">
              {currentModule.replace("-", " ")}
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200">
              Zero Cost Architecture
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={probeOllama}
              className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${ollamaChecking ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Probe Host</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Owner</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">
          {currentModule === "dashboard" && (
            <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Sovereign Intelligence Operations
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                    TDEK is ready. Private local processing is configured for zero per-token cost.
                    All private notes, vector chunking, and memory graphs remain strictly on this device.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentModule("chat")}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    Open Strategic Chat
                  </button>
                  <button
                    onClick={() => setCurrentModule("intelligence")}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Run Deep Analysis
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Active Projects</span>
                    <FolderGit2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{projects.length}</div>
                  <div className="mt-1 text-[11px] text-emerald-600">Isolated workspace domains</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Semantic Memories</span>
                    <Brain className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{memories.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Categorized & verified</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Configured Agents</span>
                    <Bot className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{agents.length}</div>
                  <div className="mt-1 text-[11px] text-slate-500">Granular tool permissions</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>External Cost</span>
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-emerald-600">€0.00</div>
                  <div className="mt-1 text-[11px] text-emerald-700 font-medium">100% local open models</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800">Recent Strategic Assessments</h3>
                    <button
                      onClick={() => setCurrentModule("intelligence")}
                      className="text-xs text-blue-600 font-medium hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {analyses.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-md border border-slate-100 bg-slate-50/60 p-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{item.topic}</span>
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-800">
                            {item.depth}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-600 line-clamp-2">{item.executiveSummary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800">Background Workflow Queue</h3>
                    <button
                      onClick={() => setCurrentModule("tasks")}
                      className="text-xs text-blue-600 font-medium hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-md border border-slate-100 bg-slate-50/60 p-3 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{task.title}</div>
                          <div className="text-[11px] text-slate-500">Agent: {task.agent}</div>
                        </div>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            task.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : task.status === "running"
                              ? "bg-blue-100 text-blue-800 animate-pulse"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentModule === "chat" && (
            <div className="flex h-full flex-col bg-white">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs gap-3">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-slate-700">Active Model:</span>
                  <select
                    value={selectedChatModel}
                    onChange={(e) => setSelectedChatModel(e.target.value)}
                    className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    {detectedLocalModels.map((m) => (
                      <option key={m} value={m}>
                        {m} (Local)
                      </option>
                    ))}
                  </select>
                  <span className="inline-flex items-center space-x-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Cost: €0.00</span>
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (confirm("Reset conversation history?")) {
                      setMessages([]);
                      localStorage.removeItem("tdek_messages");
                    }
                  }}
                  className="flex items-center space-x-1 text-slate-500 hover:text-rose-600 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear Conversation</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-3xl rounded-xl p-4 text-sm leading-relaxed shadow-xs ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {msg.reasoning && (
                        <div className="mt-3.5 border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-1.5">
                          <div className="flex items-center justify-between font-semibold text-slate-700">
                            <span className="flex items-center space-x-1">
                              <Info className="h-3.5 w-3.5 text-blue-600" />
                              <span>Analytical Verification</span>
                            </span>
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-800 font-bold">
                              Confidence: {msg.reasoning.confidence}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-500">Facts: </span>
                            {msg.reasoning.facts.join("; ")}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400 px-1">
                      <span>{msg.model}</span>
                      <span>•</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex items-center space-x-2 text-xs text-blue-600 font-medium">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>TDEK engine synthesizing response...</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 bg-white p-4">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Enter strategic prompt, scenario, or analytical question..."
                    disabled={isGenerating}
                    className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !chatInput.trim()}
                    className="flex items-center space-x-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:bg-slate-300 transition"
                  >
                    <span>Execute</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {currentModule === "intelligence" && (
            <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Strategic Intelligence Engine</h2>
                <p className="text-xs text-slate-500">
                  Perform multi-layered scenario analysis, expose hidden contradictions, and isolate risks.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Hypothesis or Strategic Inquiry
                  </label>
                  <input
                    type="text"
                    value={analysisTopic}
                    onChange={(e) => setAnalysisTopic(e.target.value)}
                    placeholder="e.g., Transitioning company knowledge repositories to sovereign on-premise embeddings"
                    className="w-full rounded-md border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-slate-600">Analysis Depth:</span>
                    {(["quick", "standard", "deep", "advanced"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setAnalysisDepth(lvl)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                          analysisDepth === lvl
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleExecuteAnalysis}
                    disabled={!analysisTopic.trim()}
                    className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300 transition"
                  >
                    Generate Strategic Assessment
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {analyses.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5"
                  >
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                          {item.depth} Analysis
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{item.topic}</h3>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-700 mb-1">
                        Executive Summary
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                        {item.executiveSummary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-md border border-slate-100 bg-slate-50 p-3.5">
                        <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                          <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Empirical Confirmed Facts</span>
                        </h5>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                          {item.confirmedFacts.map((fact, idx) => (
                            <li key={idx}>{fact}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-md border border-slate-100 bg-slate-50 p-3.5">
                        <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          <span>Unverified Assumptions</span>
                        </h5>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                          {item.assumptions.map((assump, idx) => (
                            <li key={idx}>{assump}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentModule === "agents" && (
            <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Agent Framework & Permissions</h2>
                <p className="text-xs text-slate-500">
                  Configure tool privileges, authorization barriers, and model bindings per agent.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((ag) => (
                  <div
                    key={ag.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{ag.name}</h3>
                        <p className="text-[11px] text-slate-500">{ag.role}</p>
                      </div>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        {ag.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{ag.description}</p>

                    <div className="text-xs font-semibold text-slate-700">Tool Permissions:</div>
                    <div className="space-y-2 text-xs">
                      {Object.entries(ag.permissions).map(([perm, level]) => (
                        <div
                          key={perm}
                          className="flex items-center justify-between rounded bg-slate-50 p-2 border border-slate-100"
                        >
                          <span className="capitalize text-slate-700">{perm.replace(/([A-Z])/g, " $1")}</span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                              level === "disabled"
                                ? "bg-slate-200 text-slate-700"
                                : level === "automatic"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {level.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentModule === "projects" && (
            <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Project Workspaces</h2>
                <p className="text-xs text-slate-500">
                  Isolated analytical environments. Documents and memories do not leak across project boundaries.
                </p>
              </div>

              <form onSubmit={handleCreateProject} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Initialize Workspace
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project Name"
                    className="rounded border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="Short description"
                    className="rounded border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300 transition"
                >
                  Create Workspace
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                      <span className="flex items-center space-x-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                        <Lock className="h-2.5 w-2.5" />
                        <span>Private</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentModule === "memory" && (
            <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Semantic Memory</h2>
                <p className="text-xs text-slate-500">
                  Explicitly stored context, preferences, and verified decisions.
                </p>
              </div>

              <form onSubmit={handleCreateMemory} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Record Memory Item
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newMemoryText}
                    onChange={(e) => setNewMemoryText(e.target.value)}
                    placeholder="Memory statement..."
                    className="md:col-span-2 rounded border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none"
                  />
                  <div className="flex space-x-2">
                    <select
                      value={newMemoryCategory}
                      onChange={(e) => setNewMemoryCategory(e.target.value as any)}
                      className="flex-1 rounded border border-slate-300 px-2 py-2 text-xs font-semibold"
                    >
                      <option value="context">Context</option>
                      <option value="preference">Preference</option>
                      <option value="decision">Decision</option>
                      <option value="factual">Factual</option>
                    </select>
                    <select
                      value={newMemoryCertainty}
                      onChange={(e) => setNewMemoryCertainty(e.target.value as any)}
                      className="flex-1 rounded border border-slate-300 px-2 py-2 text-xs font-semibold"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="hypothesis">Hypothesis</option>
                      <option value="opinion">Opinion</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newMemoryText.trim()}
                  className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300 transition"
                >
                  Commit Memory
                </button>
              </form>

              <div className="space-y-3">
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{mem.content}</div>
                      <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400">
                        <span className="capitalize font-semibold text-blue-600">{mem.category}</span>
                        <span>•</span>
                        <span>Created {new Date(mem.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        mem.certainty === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {mem.certainty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentModule === "models" && (
            <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Model Center</h2>
                <p className="text-xs text-slate-500">
                  Manage local open models and review external provider barriers.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Local Ollama Inference Daemon</h3>
                  <p className="text-xs text-slate-500">Endpoint: {ollamaEndpoint}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`rounded px-2.5 py-1 text-xs font-semibold ${
                      ollamaConnected
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {ollamaConnected ? "Connected" : "Standby"}
                  </span>
                  <button
                    onClick={probeOllama}
                    className="rounded bg-slate-800 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700"
                  >
                    Re-test
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Available Local Models
                </h3>
                {detectedLocalModels.map((model) => (
                  <div
                    key={model}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{model}</div>
                      <div className="text-[11px] text-slate-500">Zero token costs • Fully private</div>
                    </div>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentModule === "control-center" && (
            <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Control Center</h2>
                  <p className="text-xs text-slate-500">
                    Administrative governance, invitation token issuance, and security audits.
                  </p>
                </div>
                <span className="rounded bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                  Owner Authorization
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">External Model Provider Barrier</h3>
                    <p className="text-xs text-slate-500">
                      Blocks external requests to commercial AI providers.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowExternalProviders}
                    onChange={(e) => setAllowExternalProviders(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Issue User Invitation</h3>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@domain.local"
                    className="flex-1 rounded border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    onClick={handleGenerateInvite}
                    disabled={!inviteEmail.trim()}
                    className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300 transition"
                  >
                    Generate Invite
                  </button>
                </div>
                {generatedInviteTokens.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {generatedInviteTokens.map((t, idx) => (
                      <div key={idx} className="rounded bg-slate-50 p-2 text-xs font-mono text-slate-700 border border-slate-100">
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {![
            "dashboard",
            "chat",
            "intelligence",
            "agents",
            "projects",
            "memory",
            "models",
            "control-center",
          ].includes(currentModule) && (
            <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Sliders className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold capitalize text-slate-900">
                {currentModule.replace("-", " ")} Workspace
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Connected to local intelligence substrate. Operates within the €0 sovereign framework.
              </p>
              <button
                onClick={() => setCurrentModule("dashboard")}
                className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
