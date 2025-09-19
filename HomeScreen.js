// HomeScreen.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export default function HomeScreen({ navigation }) {
  return (
    <Container>
      <Text>Welcome to Azul-Chatz!</Text>
      <TouchableOpacity onPress={() => navigation.navigate('ChatRoom')}>
        <Text>Enter Chat Room</Text>
      </TouchableOpacity>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.background};
`;
