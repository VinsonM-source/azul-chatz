// ChatRoomScreen.js

import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { db, auth } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import ChatBubble from '../components/ChatBubble';
import { sendPushNotification } from '../services/notifications';
import { getDoc, doc } from 'firebase/firestore';

export default function ChatRoomScreen({ route }) {
  const roomId = route?.params?.roomId || 'general';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'rooms', roomId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [roomId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, 'rooms', roomId, 'messages'), {
      text: input,
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid,
    });
    setInput('');
  };

  // Send push notification to other members (group or private)
if (roomData?.members) {
  roomData.members.forEach(memberId => {
    if (memberId !== auth.currentUser.uid) {
      sendPushNotification(memberId, `New message in ${roomData.name}`, input);
    }
    }); 
}

  return (
    <Container>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <ChatBubble message={item} isMine={item.userId === auth.currentUser.uid} />
        )}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={{ flexDirection: 'column-reverse' }}
      />
      <InputContainer>
        <Input
          placeholder="Type a message"
          value={input}
          onChangeText={setInput}
        />
        <SendButton onPress={sendMessage}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </SendButton>
      </InputContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

const InputContainer = styled.View`
  flex-direction: row;
  padding: 10px;
  background-color: ${(props) => props.theme.background};
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  background-color: #eee;
  margin-right: 10px;
`;

const SendButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.primary};
  padding: 10px 15px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;
