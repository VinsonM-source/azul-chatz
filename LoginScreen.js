// LoginScreen.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export default function LoginScreen({ navigation }) {
  return (
    <Container>
      <Title>Azul-Chatz</Title>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text>Go to Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text>Login</Text>
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

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${(props) => props.theme.text};
  margin-bottom: 40px;
`;
