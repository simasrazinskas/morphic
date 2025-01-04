import React from 'react'
import { ChatShare } from './chat-share'
import { CollapsibleMessage } from './collapsible-message'
type UserMessageProps = {
  message: string
  chatId?: string
  showShare?: boolean
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  chatId,
  showShare = false
}) => {
  const enableShare = process.env.ENABLE_SHARE === 'true'
  return (
    <CollapsibleMessage role="user">
      <div className="flex-1 break-words w-full">{message}</div>
      {enableShare && showShare && chatId && <ChatShare chatId={chatId} />}
    </CollapsibleMessage>
  )
}
