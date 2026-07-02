/**
 * conversationStorage.ts
 *
 * 10.1 阶段：仅定义类型，不包含 localStorage 持久化逻辑。
 * 持久化将在 10.3 阶段接入。
 */

/* ── 消息角色 ── */
export type MessageRole = 'user' | 'assistant' | 'system'

/* ── 消息状态 ── */
export type MessageStatus = 'streaming' | 'done' | 'error'

/* ── 任务执行状态 ── */
export type RunStatus =
  | 'idle'
  | 'thinking'
  | 'planning'
  | 'waiting-confirmation'
  | 'running'
  | 'completed'
  | 'failed'
  | 'stopped'

/* ── 工作流步骤 ── */
export type WorkflowStepStatus = 'wait' | 'process' | 'finish'

export interface WorkflowStep {
  key: string
  title: string
  description: string
  status: WorkflowStepStatus
}

/* ── 工具调用日志 ── */
export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error'

export interface ToolCallLog {
  id: string
  name: string
  status: ToolCallStatus
  inputSummary: string
  outputSummary?: string
  startedAt: number
  endedAt?: number
}

/* ── 附件元信息 ── */
export type AttachedFileKind = 'file' | 'image'

export interface AttachedFileMeta {
  id: string
  name: string
  size: number
  type: string
  previewUrl?: string
  kind: AttachedFileKind
}

/* ── 对话消息 ── */
export interface ConversationMessage {
  id: string
  role: MessageRole
  content: string
  status?: MessageStatus
  createdAt: number
  workflow?: WorkflowStep[]
  toolCalls?: ToolCallLog[]
  attachments?: AttachedFileMeta[]
}

/* ── 单个会话 ── */
export interface Conversation {
  id: string
  title: string
  messages: ConversationMessage[]
  model: string
  mode: string
  workDirName?: string
  runStatus: RunStatus
  createdAt: number
  updatedAt: number
}

/* ── 会话存储根对象 ── */
export interface ConversationStore {
  conversations: Conversation[]
  currentId: string | null
}

/* ── 工具函数（10.3 阶段扩展） ── */
export function createEmptyConversation(model = 'Auto', mode = '通用 GIS'): Conversation {
  const now = Date.now()
  return {
    id: `conv_${now}_${Math.random().toString(36).slice(2, 8)}`,
    title: '新任务',
    messages: [],
    model,
    mode,
    runStatus: 'idle',
    createdAt: now,
    updatedAt: now,
  }
}
