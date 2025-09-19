// GroupChatRoomScreen.js

import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { db, auth } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import ChatBubble from '../components/ChatBubble';
import Avatar from '../components/Avatar';
import { sendPushNotification } from '../services/notifications';

const sendMessage = async () => {
  if (!input.trim()) return;

  const msgRef = await addDoc(collection(db, 'rooms', roomId, 'messages'), {
    text: input,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });

  setInput('');

  // Notify all group members except sender
  roomData.members.forEach(member => {
    if (member.uid !== auth.currentUser.uid) {
      sendPushNotification(member.uid, `${roomData.name}`, input);
    }
  });
};

export default function GroupChatRoomScreen({ route }) {
  const roomId = route?.params?.roomId;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const docRef = doc(db, 'rooms', roomId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setRoomData(docSnap.data());
    };
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    const q = query(collection(db, 'rooms', roomId, 'messages'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [roomId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await addDoc(collection(db, 'rooms', roomId, 'messages'), {
      text: input,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setInput('');
  };

  return (
    <Container>
      {roomData && (
        <RoomHeader>
          <Avatar name={roomData.name} uri={roomData.avatar || null} size={50} />
          <RoomName>{roomData.name}</RoomName>
        </RoomHeader>
      )}
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
        <Input placeholder="Type a message" value={input} onChangeText={setInput} />
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

const RoomHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: ${(props) => props.theme.background};
`;

const RoomName = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.text};
  margin-left: 10px;
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
