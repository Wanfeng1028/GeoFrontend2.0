import { App, Button, Typography, theme } from 'antd'
import { CopyOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons'
import type { ConversationMessage as ConversationMessageType, RunStatus } from './conversationStorage'
import { MarkdownLite } from './MarkdownLite'
import { ToolCallTimeline } from './ToolCallTimeline'
import { WorkflowRunCard } from './WorkflowRunCard'
import styles from './ConversationMessage.module.css'

const { Text } = Typography

interface ConversationMessageProps {
  data: ConversationMessageType
  /** 当前 runStatus，仅最后一条 assistant message 使用 */
  runStatus?: RunStatus
  onConfirmRun?: () => void
  onAdjustPlan?: () => void
  /** 是否是最后一条 assistant message */
  isLastAssistant?: boolean
}

export function ConversationMessageView({
  data,
  runStatus,
  onConfirmRun,
  onAdjustPlan,
  isLastAssistant,
}: ConversationMessageProps) {
  const { token } = theme.useToken()
  const { message } = App.useApp()

  const isUser = data.role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(data.content).then(
      () => message.success('已复制回复内容'),
      () => message.warning('复制失败，请手动选择文本复制'),
    )
  }

  return (
    <div className={`${styles.messageRow} ${isUser ? styles.messageRowUser : styles.messageRowAssistant}`}>
      {/* 助手头像 */}
      {!isUser && (
        <div
          className={styles.avatar}
          style={{ background: token.colorPrimaryBg, color: token.colorPrimary }}
        >
          <RobotOutlined />
        </div>
      )}

      {/* 内容区：bubble + timeline + workflow 纵向排列 */}
      <div className={styles.contentColumn}>
        {/* 消息气泡 */}
        <div
          className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}
          style={{
            background: isUser ? token.colorPrimary : token.colorFillQuaternary,
            color: isUser ? token.colorTextLightSolid : token.colorText,
            border: isUser ? 'none' : `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {isUser ? (
            <Text style={{ whiteSpace: 'pre-wrap', color: 'inherit' }}>
              {data.content}
            </Text>
          ) : (
            <>
              <MarkdownLite content={data.content} />
              {data.status === 'streaming' && (
                <span
                  className={styles.streamingCursor}
                  style={{ background: token.colorPrimary }}
                />
              )}
              {/* 复制按钮 */}
              {data.status !== 'streaming' && data.content && (
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  className={styles.copyBtn}
                  onClick={handleCopy}
                />
              )}
            </>
          )}
        </div>

        {/* ── 工具调用日志（assistant 消息下方） ── */}
        {!isUser && data.toolCalls && data.toolCalls.length > 0 && (
          <ToolCallTimeline toolCalls={data.toolCalls} />
        )}

        {/* ── 工作流计划卡片（仅最后一条 assistant message） ── */}
        {!isUser && isLastAssistant && data.workflow && data.workflow.length > 0 && runStatus && (
          <WorkflowRunCard
            workflow={data.workflow}
            runStatus={runStatus}
            onConfirmRun={onConfirmRun ?? (() => {})}
            onAdjustPlan={onAdjustPlan ?? (() => {})}
          />
        )}
      </div>

      {/* 用户头像 */}
      {isUser && (
        <div
          className={styles.avatar}
          style={{ background: token.colorFillSecondary, color: token.colorTextSecondary }}
        >
          <UserOutlined />
        </div>
      )}
    </div>
  )
}
