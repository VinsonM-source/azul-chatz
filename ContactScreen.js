// ContactScreen.js

import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { db, auth } from '../services/firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import * as AppState from 'expo-app-state';

useEffect(() => {
  const setStatus = async (status) => {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { status });
    }
  };

  const subscription = AppState.addEventListener('change', nextState => {
    if (nextState === 'active') setStatus('online');
    else setStatus('away');
  });

  const authSub = onAuthStateChanged(auth, user => {
    if (user) setStatus('online');
    else setStatus('offline');
  });

  return () => {
    subscription.remove();
    authSub();
  };
}, []);

<Text style={{ color: member.status === 'online' ? 'green' : 'gray' }}>
  {member.status}
</Text>


export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'users', auth.currentUser.uid, 'contacts'),
      snapshot => setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );

    return unsub;
  }, []);

  const addContact = async () => {
    await addDoc(collection(db, 'users', auth.currentUser.uid, 'contacts'), {
      name: 'New Contact',
      email: 'contact@example.com',
    });
  };

  return (
    <Container>
      <FlatList
        data={contacts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ChatRoom', { roomId: item.id })}>
            <ContactText>{item.name}</ContactText>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      <AddButton onPress={addContact}>
        <Text style={{ color: '#fff' }}>Add Contact</Text>
      </AddButton>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 10px;
  background-color: ${(props) => props.theme.background};
`;

const ContactText = styled.Text`
  font-size: 18px;
  padding: 10px;
  color: ${(props) => props.theme.text};
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.primary};
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;
