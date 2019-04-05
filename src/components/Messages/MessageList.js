import React from 'react';

import MessageItem from './MessageItem';

import { Feed } from 'semantic-ui-react';

const MessageList = ({
  authUser,
  messages,
  onEditMessage,
  onRemoveMessage,
}) => (
  <Feed>
    {messages.map(message => (
      <MessageItem
        authUser={authUser}
        key={message.uid}
        message={message}
        onEditMessage={onEditMessage}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </Feed>
);

export default MessageList;
