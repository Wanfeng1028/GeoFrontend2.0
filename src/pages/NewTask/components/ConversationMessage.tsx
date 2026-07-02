import { App, Button, Typography, theme } from 'antd'
import { CopyOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons'
import type { ConversationMessage } from './conversationStorage'
import { MarkdownLite } from './MarkdownLite'
import styles from './ConversationMessage.module.css'

const { Text } = Typography

interface ConversationMessageProps {
  data: ConversationMessage
}

export function ConversationMessageView({ data }: ConversationMessageProps) {
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
