// Avatar.js

import React from 'react';
import { View, Text, Image } from 'react-native';
import styled from 'styled-components/native';

export default function Avatar({ name, uri, size = 50 }) {
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : '';

  return uri ? (
    <AvatarImage source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
  ) : (
    <AvatarPlaceholder style={{ width: size, height: size, borderRadius: size / 2 }}>
      <Initials>{initials}</Initials>
    </AvatarPlaceholder>
  );
}

const AvatarImage = styled.Image``;

const AvatarPlaceholder = styled.View`
  background-color: #888;
  justify-content: center;
  align-items: center;
`;

const Initials = styled.Text`
  color: #fff;
  font-weight: bold;
`;
