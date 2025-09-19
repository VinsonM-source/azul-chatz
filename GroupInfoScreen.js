// GroupInfoScreen.js

import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import styled from 'styled-components/native';
import { db, auth, storage } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Avatar from '../components/Avatar';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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


export default function GroupInfoScreen({ route, navigation }) {
  const roomId = route.params.roomId;
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const docRef = doc(db, 'rooms', roomId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setRoomData(docSnap.data());
    };
    fetchRoom();
  }, [roomId]);

  const pickGroupAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
    if (!result.canceled) {
      const file = await fetch(result.assets[0].uri);
      const blob = await file.blob();
      const storageRef = ref(storage, `groupAvatars/${roomId}.jpg`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'rooms', roomId), { avatar: url });
      setRoomData({ ...roomData, avatar: url });
    }
  };

  const removeMember = async (uid) => {
    if (uid === auth.currentUser.uid) return Alert.alert("You can't remove yourself here.");
    const updatedMembers = roomData.members.filter(m => m.uid !== uid);
    await updateDoc(doc(db, 'rooms', roomId), { members: updatedMembers });
    setRoomData({ ...roomData, members: updatedMembers });
  };

  return (
    <Container>
      {roomData && (
        <>
          <TouchableOpacity onPress={pickGroupAvatar}>
            <Avatar name={roomData.name} uri={roomData.avatar} size={80} />
          </TouchableOpacity>
          <RoomName>{roomData.name}</RoomName>
          <Text style={{ marginVertical: 10 }}>Members:</Text>
          <FlatList
            data={roomData.members}
            keyExtractor={item => item.uid}
            renderItem={({ item }) => (
              <MemberContainer>
                <Avatar name={item.name} uri={item.avatar} size={50} />
                <MemberName>{item.name}</MemberName>
                <RemoveButton onPress={() => removeMember(item.uid)}>
                  <Text style={{ color: '#fff' }}>Remove</Text>
                </RemoveButton>
              </MemberContainer>
            )}
          />
        </>
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.background};
`;

const RoomName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${(props) => props.theme.text};
  margin: 10px 0;
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
  margin-left: 10px;
`;

const RemoveButton = styled.TouchableOpacity`
  background-color: red;
  padding: 5px 10px;
  border-radius: 10px;
`;
