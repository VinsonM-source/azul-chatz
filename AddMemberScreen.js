// AddMemberScreen.js

import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { db, auth } from '../services/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function AddMembersScreen({ route, navigation }) {
  const roomId = route.params.roomId;
  const [contacts, setContacts] = useState([]);
  const [roomMembers, setRoomMembers] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const snapshot = await getDocs(collection(db, 'users', auth.currentUser.uid, 'contacts'));
      setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchRoom = async () => {
      const docSnap = await getDocs(collection(db, 'rooms'));
      const room = docSnap.docs.find(d => d.id === roomId)?.data();
      setRoomMembers(room?.members.map(m => m.uid) || []);
    };

    fetchContacts();
    fetchRoom();
  }, []);

  const addMember = async (contact) => {
    if (roomMembers.includes(contact.id)) return;
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await roomRef.get();
    const currentData = (await roomRef.get()).data();
    const updatedMembers = [...currentData.members, { uid: contact.id, name: contact.name, avatar: contact.avatar || null }];
    await updateDoc(roomRef, { members: updatedMembers });
    setRoomMembers([...roomMembers, contact.id]);
  };

  return (
    <Container>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MemberContainer>
            <MemberName>{item.name}</MemberName>
            <AddButton onPress={() => addMember(item)}>
              <Text style={{ color: '#fff' }}>Add</Text>
            </AddButton>
          </MemberContainer>
        )}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.background};
`;

const MemberContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const MemberName = styled.Text`
  flex: 1;
  font-size: 16px;
  color: ${(props) => props.theme.text};
`;

const AddButton = styled.TouchableOpacity`
  background-color: green;
  padding: 5px 10px;
  border-radius: 10px;
`;
