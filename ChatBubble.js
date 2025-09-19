// ChatBubble.js

import React from 'react';
import styled from 'styled-components/native';

export default function ChatBubble({ message, isMine, avatar, name }) {
  return (
    <BubbleRow isMine={isMine}>
      {!isMine && <Avatar name={name} uri={avatar} size={35} />}
      <BubbleContainer isMine={isMine}>
        <MessageText>{message.text}</MessageText>
        <TimeText>{message.createdAt?.toDate().toLocaleTimeString()}</TimeText>
      </BubbleContainer>
    </BubbleRow>
  );
}

const BubbleRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};
  margin: 5px 10px;
`;


export default function ChatBubble({ message, isMine }) {
  return (
    <BubbleContainer isMine={isMine}>
      <MessageText>{message.text}</MessageText>
      <TimeText>{message.createdAt?.toDate().toLocaleTimeString()}</TimeText>
    </BubbleContainer>
  );
}

const BubbleContainer = styled.View`
  background-color: ${(props) => (props.isMine ? props.theme.primary : '#ccc')};
  align-self: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};
  margin: 5px 10px;
  padding: 10px;
  border-radius: 15px;
  max-width: 70%;
`;

const MessageText = styled.Text`
  color: ${(props) => (props.isMine ? '#fff' : '#000')};
`;

const TimeText = styled.Text`
  font-size: 10px;
  color: ${(props) => (props.isMine ? '#eee' : '#333')};
  text-align: right;
  margin-top: 5px;
`;
