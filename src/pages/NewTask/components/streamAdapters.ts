/**
 * streamAdapters.ts
 *
 * 统一流式适配器接口 + 三种实现：
 * - mockStreamAdapter：当前默认，前端模拟流式输出
 * - sseStreamAdapter：SSE 骨架（10.x 阶段接入）
 * - websocketStreamAdapter：WebSocket 骨架（10.x 阶段接入）
 *
 * NewTaskPage 只调用 activeAdapter.start()，不关心底层实现。
 */

import type {
  AttachedFileMeta,
  RunStatus,
  ToolCallLog,
  WorkflowStep,
} from './conversationStorage'

/* ── 统一接口 ── */

export interface StreamAdapterPayload {
  conversationId: string
  input: string
  model: string
  mode: string
  workDirName?: string
  attachments?: AttachedFileMeta[]
}

export interface StreamAdapterCallbacks {
  onDelta: (delta: string) => void
  onDone: () => void
  onError: (error: Error) => void
  onStatus?: (status: RunStatus) => void
  onToolCall?: (log: ToolCallLog) => void
  onWorkflow?: (steps: WorkflowStep[]) => void
}

export interface StreamAdapter {
  start: (
    payload: StreamAdapterPayload,
    callbacks: StreamAdapterCallbacks,
    signal: AbortSignal,
  ) => Promise<void>
}

/* ── Mock 工具调用定义 ── */

const MOCK_TOOL_CALLS: Array<{
  id: string
  name: string
  inputSummary: string
  outputSummary: string
}> = [
  {
    id: 'tool_read_dir',
    name: '读取工作目录',
    inputSummary: '读取当前绑定的工作目录名称和可用文件元信息。',
    outputSummary: '已确认工作目录上下文，等待接入真实文件系统索引。',
  },
  {
    id: 'tool_check_data',
    name: '检查空间数据',
    inputSummary: '检查任务中提到的 GeoJSON、CSV、栅格影像或图层线索。',
    outputSummary: '已生成数据需求清单。',
  },
  {
    id: 'tool_select_gis',
    name: '选择 GIS 工具',
    inputSummary: '根据任务类型匹配空间分析、专题制图、遥感解译或论文辅助能力。',
    outputSummary: '已选择 GeoWork 前端 mock 工具链。',
  },
  {
    id: 'tool_gen_plan',
    name: '生成执行计划',
    inputSummary: '把自然语言任务拆解为可确认的执行步骤。',
    outputSummary: '已生成待确认工作流计划。',
  },
]

const MOCK_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    key: 'understand',
    title: '理解任务',
    description: '解析用户目标、空间对象和预期输出。',
    status: 'finish',
  },
  {
    key: 'prepare',
    title: '准备数据',
    description: '检查工作目录、输入文件、图层和坐标系统。',
    status: 'finish',
  },
  {
    key: 'select',
    title: '选择能力',
    description: '匹配空间分析、专题制图、遥感解译或论文辅助能力。',
    status: 'finish',
  },
  {
    key: 'confirm',
    title: '等待确认',
    description: '生成可执行计划，等待用户确认后进入真实执行。',
    status: 'process',
  },
]

/* ── Mock 响应模板 ── */

const MOCK_RESPONSE_TEMPLATE = `我已理解你的空间任务，下面会把它拆成可执行的 GeoWork 工作流。

**第一步：确认输入**
我会检查输入数据、工作目录和坐标系统是否正确。

**第二步：选择能力**
根据任务类型，匹配以下能力之一：
- 空间分析（缓冲区、叠加、空间查询）
- 专题制图（生成专题地图和可视化）
- 遥感解译（影像处理和分类）
- 论文辅助（学术写作和文献引用）

**第三步：生成执行计划**
输出可执行计划并等待你确认后再进入真实执行阶段。

示例配置片段：
\`\`\`json
{
  "task": "spatial-analysis",
  "input": "land_parcels.geojson",
  "crs": "EPSG:4326",
  "buffer": 500
}
\`\`\`

> 当前版本是前端交互流程演示，后续会接入真实模型网关、工具调用和任务队列。`

function generateMockResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('遥感') || lower.includes('影像')) {
    return MOCK_RESPONSE_TEMPLATE.replace(
      '我已理解你的空间任务，下面会把它拆成可执行的 GeoWork 工作流。',
      '我已理解你的遥感任务，下面会把它拆成可执行的 GeoWork 工作流。',
    )
  }
  if (lower.includes('制图') || lower.includes('地图')) {
    return MOCK_RESPONSE_TEMPLATE.replace(
      '我已理解你的空间任务，下面会把它拆成可执行的 GeoWork 工作流。',
      '我已理解你的制图任务，下面会把它拆成可执行的 GeoWork 工作流。',
    )
  }
  return MOCK_RESPONSE_TEMPLATE
}

/* ── 辅助：可中断的延迟 ── */

function createInterruptibleDelay(
  fn: () => void,
  ms: number,
  signal: AbortSignal,
  timers: Set<ReturnType<typeof setTimeout>>,
): void {
  if (signal.aborted) return
  const t = setTimeout(() => {
    timers.delete(t)
    if (!signal.aborted) fn()
  }, ms)
  timers.add(t)
}

/**
 * mockStreamAdapter
 *
 * 流程：
 * 1. onStatus('thinking')
 * 2. 500-700ms 后 onStatus('planning')
 * 3. 流式输出文本，期间逐步触发 4 条 mock 工具调用
 * 4. 文本完成后 onWorkflow + onStatus('waiting-confirmation') + onDone()
 * 5. AbortSignal 中断时停止一切，不 onDone
 */
export const mockStreamAdapter: StreamAdapter = {
  async start(payload, callbacks, signal) {
    const fullText = generateMockResponse(payload.input)
    let index = 0
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const toolCallTriggered = new Set<number>()
    let planningScheduled = false

    const clearAllTimers = () => {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }

    /* 触发一条工具调用：先 running，延迟后 success */
    const emitToolCall = (toolIndex: number) => {
      if (toolCallTriggered.has(toolIndex)) return
      toolCallTriggered.add(toolIndex)

      const tool = MOCK_TOOL_CALLS[toolIndex]
      const now = Date.now()

      /* 先发 running */
      callbacks.onToolCall?.({
        id: tool.id,
        name: tool.name,
        status: 'running',
        inputSummary: tool.inputSummary,
        startedAt: now,
      })

      /* 300-500ms 后更新为 success */
      const delay = 300 + Math.floor(Math.random() * 201)
      createInterruptibleDelay(
        () => {
          callbacks.onToolCall?.({
            id: tool.id,
            name: tool.name,
            status: 'success',
            inputSummary: tool.inputSummary,
            outputSummary: tool.outputSummary,
            startedAt: now,
            endedAt: Date.now(),
          })
        },
        delay,
        signal,
        timers,
      )
    }

    return new Promise<void>((resolve) => {
      const tick = () => {
        if (signal.aborted) {
          clearAllTimers()
          resolve()
          return
        }
        if (index >= fullText.length) {
          /* 文本完成 */
          callbacks.onWorkflow?.(MOCK_WORKFLOW_STEPS)
          callbacks.onStatus?.('waiting-confirmation')
          callbacks.onDone()
          clearAllTimers()
          resolve()
          return
        }

        /* 在流式输出过程中触发工具调用（20%、40%、60%、80% 进度） */
        const progress = index / fullText.length
        for (let i = 0; i < MOCK_TOOL_CALLS.length; i++) {
          const threshold = (i + 1) * 0.2
          if (progress >= threshold && !toolCallTriggered.has(i)) {
            emitToolCall(i)
          }
        }

        const chunkSize = 2 + Math.floor(Math.random() * 3)
        const chunk = fullText.slice(index, index + chunkSize)
        index += chunkSize
        callbacks.onDelta(chunk)

        const delay = 20 + Math.floor(Math.random() * 16)
        createInterruptibleDelay(tick, delay, signal, timers)
      }

      if (signal.aborted) {
        resolve()
        return
      }

      /* 开始：thinking */
      callbacks.onStatus?.('thinking')

      /* 500-700ms 后 planning */
      const planningDelay = 500 + Math.floor(Math.random() * 201)
      createInterruptibleDelay(
        () => {
          if (!planningScheduled) {
            planningScheduled = true
            callbacks.onStatus?.('planning')
          }
        },
        planningDelay,
        signal,
        timers,
      )

      /* 300ms 后开始流式输出 */
      createInterruptibleDelay(tick, 300, signal, timers)

      signal.addEventListener('abort', () => {
        clearAllTimers()
        resolve()
      })
    })
  },
}

/* ── SSE 适配器骨架 ── */

export const sseStreamAdapter: StreamAdapter = {
  async start(_payload, _callbacks, _signal) {
    throw new Error('SSE stream adapter not implemented yet')
  },
}

/* ── WebSocket 适配器骨架 ── */

export const websocketStreamAdapter: StreamAdapter = {
  async start(_payload, _callbacks, _signal) {
    throw new Error('WebSocket stream adapter not implemented yet')
  },
}

/* ── 当前默认适配器 ── */
export const activeAdapter: StreamAdapter = mockStreamAdapter
