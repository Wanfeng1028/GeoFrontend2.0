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

import type { AttachedFileMeta } from './conversationStorage'

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
}

export interface StreamAdapter {
  start: (
    payload: StreamAdapterPayload,
    callbacks: StreamAdapterCallbacks,
    signal: AbortSignal,
  ) => Promise<void>
}

/* ── Mock 适配器 ── */

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
  /* 简单根据输入关键词调整回复开头 */
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

/**
 * mockStreamAdapter
 *
 * 每 20-35ms 输出 2-4 个字符，模拟逐字流式输出。
 * 支持 AbortSignal 中断。
 */
export const mockStreamAdapter: StreamAdapter = {
  async start(payload, callbacks, signal) {
    const fullText = generateMockResponse(payload.input)
    let index = 0

    return new Promise<void>((resolve, _reject) => {
      const tick = () => {
        if (signal.aborted) {
          resolve()
          return
        }
        if (index >= fullText.length) {
          callbacks.onDone()
          resolve()
          return
        }
        /* 每次输出 2-4 个字符 */
        const chunkSize = 2 + Math.floor(Math.random() * 3)
        const chunk = fullText.slice(index, index + chunkSize)
        index += chunkSize
        callbacks.onDelta(chunk)

        /* 20-35ms 随机间隔 */
        const delay = 20 + Math.floor(Math.random() * 16)
        setTimeout(tick, delay)
      }

      /* 启动前检查 signal */
      if (signal.aborted) {
        resolve()
        return
      }

      /* 初始延迟模拟"思考" */
      setTimeout(tick, 300)

      /* signal abort 时 resolve */
      signal.addEventListener('abort', () => resolve())
    })
  },
}

/* ── SSE 适配器骨架 ── */

export const sseStreamAdapter: StreamAdapter = {
  async start(_payload, _callbacks, _signal) {
    /*
     * TODO: 接入真实 SSE 端点
     * const eventSource = new EventSource(`/api/stream?conv=${payload.conversationId}`)
     * eventSource.onmessage = (e) => callbacks.onDelta(e.data)
     * eventSource.onerror = () => callbacks.onError(new Error('SSE connection failed'))
     * signal.addEventListener('abort', () => eventSource.close())
     */
    throw new Error('SSE stream adapter not implemented yet')
  },
}

/* ── WebSocket 适配器骨架 ── */

export const websocketStreamAdapter: StreamAdapter = {
  async start(_payload, _callbacks, _signal) {
    /*
     * TODO: 接入真实 WebSocket 端点
     * const ws = new WebSocket(`wss://api.geowork.dev/stream`)
     * ws.onmessage = (e) => callbacks.onDelta(e.data)
     * ws.onerror = () => callbacks.onError(new Error('WebSocket connection failed'))
     * signal.addEventListener('abort', () => ws.close())
     */
    throw new Error('WebSocket stream adapter not implemented yet')
  },
}

/* ── 当前默认适配器 ── */
export const activeAdapter: StreamAdapter = mockStreamAdapter
