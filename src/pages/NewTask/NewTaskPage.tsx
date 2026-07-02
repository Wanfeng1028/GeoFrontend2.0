import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import {
  App,
  BorderBeam,
  Tag,
  Tour,
  Typography,
  theme,
} from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { WorkflowGuideCard } from './components/WorkflowGuideCard'
import { ChatComposer } from './components/ChatComposer'
import { ConversationMessageView } from './components/ConversationMessage'
import { activeAdapter } from './components/streamAdapters'
import type { ConversationMessage } from './components/conversationStorage'
import { useAppearanceStore } from '../../shared/stores/appearanceStore'
import styles from './NewTaskPage.module.css'

const { Title, Text } = Typography

export function NewTaskPage() {
  const { message } = App.useApp()
  const { token } = theme.useToken()
  const { appearance } = useAppearanceStore()
  const isLight = appearance === 'light'

  /* ── 核心状态 ── */
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('Auto')
  const [workDir, setWorkDir] = useState<string | null>(null)
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const hasConversation = messages.length > 0
  const abortRef = useRef<AbortController | null>(null)
  const messageListRef = useRef<HTMLDivElement>(null)

  /* ── location state 兼容（initialPrompt + resetKey） ── */
  const location = useLocation()
  const promptFilledRef = useRef(false)
  const lastResetKeyRef = useRef<number | null>(null)

  useEffect(() => {
    const state = location.state as { initialPrompt?: string; resetKey?: number } | null

    /* resetKey：侧栏"新任务"点击时重置会话 */
    if (state?.resetKey && state.resetKey !== lastResetKeyRef.current) {
      lastResetKeyRef.current = state.resetKey
      abortRef.current?.abort()
      setMessages([])
      setIsStreaming(false)
      setPrompt('')
    }

    /* initialPrompt：定时任务页面传入的提示词 */
    if (state?.initialPrompt && !promptFilledRef.current) {
      setPrompt((prev) => {
        if (prev === '') {
          promptFilledRef.current = true
          message.success('已生成定时任务提示词，请继续补充细节')
          return state.initialPrompt!
        }
        return prev
      })
    }
  }, [location.state, message])

  /* ── 自动滚动到底部 ── */
  useEffect(() => {
    const el = messageListRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  /* ── Tour refs ── */
  const [tourOpen, setTourOpen] = useState(false)
  const composerRef = useRef<HTMLDivElement>(null)
  const guideCardRef = useRef<HTMLDivElement>(null)

  /* ── Typewriter ── */
  const heroText = '用自然语言搞定空间智能工作流'
  const [typedIndex, setTypedIndex] = useState(0)
  const [loop, setLoop] = useState(0)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) { setTypedIndex(heroText.length); return }
    if (typedIndex >= heroText.length) {
      const pause = setTimeout(() => { setTypedIndex(0); setLoop((l) => l + 1) }, 2000)
      return () => clearTimeout(pause)
    }
    const timer = setTimeout(() => setTypedIndex((prev) => prev + 1), 100)
    return () => clearTimeout(timer)
  }, [typedIndex, heroText.length, loop])

  /* ── 发送消息 ── */
  const handleSend = () => {
    if (!prompt.trim()) return
    const userMsg: ConversationMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: prompt.trim(),
      createdAt: Date.now(),
    }
    const assistantMsg: ConversationMessage = {
      id: `msg_${Date.now()}_a`,
      role: 'assistant',
      content: '',
      status: 'streaming',
      createdAt: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setPrompt('')
    setIsStreaming(true)

    /* 启动 mock streaming */
    const controller = new AbortController()
    abortRef.current = controller

    activeAdapter.start(
      {
        conversationId: 'current',
        input: userMsg.content,
        model,
        mode: '通用 GIS',
        workDirName: workDir ?? undefined,
      },
      {
        onDelta: (delta) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: m.content + delta }
                : m,
            ),
          )
        },
        onDone: () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, status: 'done' as const } : m,
            ),
          )
          setIsStreaming(false)
          message.success('任务已进入前端队列，后续将接入真实执行流程')
        },
        onError: (error) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, status: 'error' as const, content: m.content + '\n\n执行出错：' + error.message }
                : m,
            ),
          )
          setIsStreaming(false)
        },
      },
      controller.signal,
    )
  }

  /* ── 停止生成 ── */
  const handleStop = () => {
    abortRef.current?.abort()
    setMessages((prev) =>
      prev.map((m) =>
        m.status === 'streaming'
          ? { ...m, status: 'done' as const, content: m.content + '\n\n生成已停止。' }
          : m,
      ),
    )
    setIsStreaming(false)
    message.info('已停止生成')
  }

  /* ── 清理 ── */
  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  /* ══════════════ Home 态 ══════════════ */
  const homeView = (
    <div className={styles.homeView}>
      {/* Hero */}
      <div className={styles.hero}>
        <svg className={styles.heroLogo} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="56" height="56" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <line x1="4" y1="24" x2="60" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
          <line x1="4" y1="44" x2="60" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
          <line x1="24" y1="4" x2="24" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
          <line x1="44" y1="4" x2="44" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
          <circle cx="32" cy="28" r="5" fill={token.colorPrimary} opacity="0.85" />
          <path d="M32 33 L28 28 A4 4 0 1 1 36 28 Z" fill={token.colorPrimary} />
          <path d="M12 50 L32 40 L52 50 L32 60 Z" stroke="currentColor" strokeWidth="1.5" fill={token.colorPrimary} opacity="0.12" />
          <path d="M12 46 L32 36 L52 46" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />
        </svg>
        <Title level={2} className={styles.heroTitle} style={{ color: token.colorText }}>
          {heroText.slice(0, typedIndex)}
          <span className={styles.typewriterCursor} style={{ color: token.colorPrimary, fontWeight: 400 }}>▎</span>
        </Title>
        <Text type="secondary" className={styles.heroSubtitle}>
          用自然语言连接数据、地图、模型与工具，完成可追溯的 GIS 分析。
        </Text>
      </div>

      {/* Composer */}
      <div ref={composerRef}>
        {(() => {
          const composer = (
            <ChatComposer
              prompt={prompt}
              onPromptChange={setPrompt}
              onSend={handleSend}
              onStop={handleStop}
              isStreaming={isStreaming}
              model={model}
              onModelChange={setModel}
              workDir={workDir}
              onWorkDirChange={setWorkDir}
            />
          )
          return isLight ? (
            <BorderBeam color={token.colorPrimary} outset={0}>{composer}</BorderBeam>
          ) : composer
        })()}
      </div>

      {/* Work Dir */}
      <div className={styles.workDirRow}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          当前工作目录：{workDir ?? '未选择'}
        </Text>
      </div>

      {/* Guide Card */}
      {(() => {
        const guide = (
          <div ref={guideCardRef} style={{ marginTop: 48 }}>
            <WorkflowGuideCard onStartTour={() => setTourOpen(true)} />
          </div>
        )
        return isLight ? (
          <BorderBeam color={token.colorPrimary} outset={0}>{guide}</BorderBeam>
        ) : guide
      })()}
    </div>
  )

  /* ══════════════ Conversation 态 ══════════════ */
  const conversationView = (
    <div className={styles.conversationView}>
      {/* Header */}
      <div
        className={styles.convHeader}
        style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}
      >
        <div className={styles.convHeaderLeft}>
          <Title level={5} className={styles.convHeaderTitle}>新任务</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {model} · {workDir ?? '未选择目录'}
          </Text>
          {isStreaming && (
            <Tag icon={<LoadingOutlined />} color="processing">思考中</Tag>
          )}
        </div>
      </div>

      {/* Message List */}
      <div className={styles.messageList} ref={messageListRef}>
        {messages.map((msg) => (
          <ConversationMessageView key={msg.id} data={msg} />
        ))}
      </div>

      {/* Composer */}
      <div className={styles.composerArea}>
        <ChatComposer
          prompt={prompt}
          onPromptChange={setPrompt}
          onSend={handleSend}
          onStop={handleStop}
          isStreaming={isStreaming}
          model={model}
          onModelChange={setModel}
          workDir={workDir}
          onWorkDirChange={setWorkDir}
          conversationMode
        />
      </div>
    </div>
  )

  return (
    <div
      className={styles.root}
      style={{
        background: `linear-gradient(180deg, ${token.colorPrimaryBgHover} 0%, ${token.colorBgLayout} 50%)`,
      }}
    >
      {hasConversation ? conversationView : homeView}

      {/* Tour */}
      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={[
          {
            target: () => composerRef.current!,
            title: '输入任务描述',
            description: '在这里用自然语言描述您的 GIS 任务，例如缓冲区分析、专题制图等。',
            placement: 'bottom',
          },
          {
            target: () => guideCardRef.current!,
            title: '工作流引导',
            description: '从这里开始您的空间分析工作流，随时可以点击"开始引导"重新查看。',
            placement: 'top',
          },
        ]}
      />
    </div>
  )
}
