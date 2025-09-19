// CreateGroupScreen.js

import React, { useState } from 'react';
import { TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { db, auth } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');

  const createGroup = async () => {
    if (!groupName.trim()) return;
    const docRef = await addDoc(collection(db, 'rooms'), {
      name: groupName,
      isGroup: true,
      members: [auth.currentUser.uid],
      avatar: null,
    });
    navigation.navigate('GroupChatRoom', { roomId: docRef.id });
  };

  return (
    <Container>
      <Input
        placeholder="Enter group name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <CreateButton onPress={createGroup}>
        <Text style={{ color: '#fff' }}>Create Group</Text>
      </CreateButton>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.background};
`;

const Input = styled.TextInput`
  padding: 10px;
  border-radius: 10px;
  background-color: #eee;
  margin-bottom: 20px;
`;

const CreateButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.primary};
  padding: 15px;
  border-radius: 20px;
  align-items: center;
`;
